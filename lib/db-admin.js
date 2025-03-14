import admin from "../configuration/firebaseAdmin";
const db = admin.firestore();
const auth = admin.auth();
const cookie = require("cookie");
import { verifyIdToken } from "../configuration/firebaseAdmin";


function getDocRefFromId(collectionName, id) {
  return db.collection(collectionName).doc(id);
}


export async function getAllSessions(req) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  let data = [];
   if (!token)
      return res.status(401).json({ error: "Unauthorized" });
  try {
    
    const decodedToken = await verifyIdToken(token);
    const uid = decodedToken.uid;
    const sessionsSnapshot = await db
      .collection("sessions")
      .where("userId", "==", uid)
      .orderBy("date", "desc")
      .get();

    const sessionDocs = sessionsSnapshot.docs;

    const sessionDetailsPromises = sessionDocs.map(async (session) => {
      const sessionData = session.data();
      const sessionDetailSnapshot = await sessionData.ref.get();

      return {
        sessionId: session.id,
        sessionDetailId: sessionData.id,
        ...sessionDetailSnapshot.data(),
      };
    });

    const data = await Promise.all(sessionDetailsPromises);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error in getAllSessions:", error);
    return [];
  }
}

export async function getSessionDetails(sessionId) {
  const sessionRef = getDocRefFromId("sessionsDetails", sessionId);
  const session = await sessionRef.get();

  let data = [];

  data.push(
    Object.assign(
      {
        id: session.id,
      },
      session.data()
    )
  );

  return data[0];
}

/*export async function getLoteDetails(loteId) {
  //Creo que no se usa en ningun lado (MODIFICAR)
}*/
export async function getUserRole(uid) {
  try {
    const querySnapshot = await db
      .collection("users")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (querySnapshot.empty) {
      console.warn(`Usuario con userId ${uid} no encontrado en Firestore`);
      return null;
    }

    // Extraer el primer documento encontrado
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    return userData.role || null; // Retorna el rol o null si no existe
  } catch (error) {
    console.error(
      `Error obteniendo el rol del usuario con userId ${uid}:`,
      error
    );
    return null;
  }
}
export async function getAllUsers() {
  const data = [];
  try {
    const usersSnapshot = await db
      .collection("users")
      .orderBy("role", "asc")
      .get();

    const userIds = usersSnapshot.docs.map((doc) => doc.data().userId);

    for (const uid of userIds) {
      try {
        const userRecord = await auth.getUser(uid);
        const userData = usersSnapshot.docs
          .find((doc) => doc.data().userId === uid)
          ?.data();

        data.push({
          name: userData?.name || null,
          photoUrl: userData?.photoUrl || null,
          role: userData?.role || null,
          uid: uid || null,
          email: userRecord.email || null,
        });
      } catch (err) {
        console.error(`Error fetching user data for UID ${uid}:`, err);
      }
    }

    // Ensure the data is fully serializable
    return data.map((user) => ({
      name: user.name,
      photoUrl: user.photoUrl,
      role: user.role,
      uid: user.uid,
      email: user.email,
    }));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return [];
  }
}

export async function updateUserData({
  uid,
  name,
  photoUrl,
  role,
  email,
  password,
}) {
  try {
    if (!uid) {
      throw new Error("UID is required to update user data.");
    }

    // 1. Retrieve the snapshot by awaiting the query result
    const snapshot = await db
      .collection("users")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("Usuario no encontrado en la colección 'users'.");
    }

    // Access the first document in the snapshot
    const userRef = snapshot.docs[0].ref;

    // Only update Firestore if at least one of the fields (name, photoUrl, role) is provided
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (photoUrl) userUpdates.photoUrl = photoUrl;
    if (role) userUpdates.role = role;

    if (Object.keys(userUpdates).length > 0) {
      await userRef.update(userUpdates);
    }

    // 2. Update data in Firebase Authentication
    const authUpdates = {};
    if (email) authUpdates.email = email;
    if (password) authUpdates.password = password;

    if (Object.keys(authUpdates).length > 0) {
      await auth.updateUser(uid, authUpdates);
    }

    return {
      success: true,
      message: "Usuario actualizado exitosamente.",
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw new Error(`Error al actualizar usuario: ${error.message}`);
  }
}

export async function createNewUser(userName, email, password, role) {
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: userName,
    });
    console.log("User created successfully");
    await saveUserInCollection(userRecord.uid, userName, role);
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error(error.message || "Error creating user");
  }
}

async function saveUserInCollection(uid, userName, role) {
  try {
    await db.collection("users").doc().set({
      userId: uid,
      name: userName,
      role: role,
      photoUrl: "",
    });
  } catch (error) {
    console.log("Error saving user in collection: " + error);
  }
}

export async function delUser(uid) {
  //HASTA QUE NO ESTE EL PERFIL ADMIN CREADO NO SE PUEDE PROBAR
  try {
    await auth.deleteUser(uid);
    // Delete user from collection
    const userRef = db.collection("users").where("userId", "==", uid).limit(1);
    const userSnapshot = await userRef.get();
    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.delete();
    console.log("User sucessfully deleted");
  } catch (error) {
    console.log("Error saving user in collection: " + error);
  }
}

export async function getAllRoles() {
  const sessionsSnapshot = await db
      .collection("roles")
      .get();
  
  const roles = sessionsSnapshot.docs.map((doc) => doc.data().roleName);

  return roles;
}
