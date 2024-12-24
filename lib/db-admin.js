import admin from "../configuration/firebaseAdmin";
/*import {
  collection,
  query,
  orderBy,
  getDoc,
  getDocs,
  doc,
  where,
} from "firebase/firestore";*/

const db = admin.firestore();
const auth = admin.auth();

function getDocRefFromId(collectionName, id) {
  //return doc(db, collectionName, id);
  return db.collection(collectionName).doc(id);
}

export async function getAllSessions() {
  let data = [];

  /*const sessionsQuery = query(
    collection(db, "sessions"),
    orderBy("date", "desc")
  );
  const sessions = await getDocs(sessionsQuery);*/

  const sessions = await db
    .collection("sessions")
    .orderBy("date", "desc")
    .get();

  for (const session of sessions.docs) {
    const sessionData = session.data();
    const sessionDetail = await sessionData.ref.get(); // Admin SDK usa `.get()` en lugar de `getDoc`
    data.push({
      sessionId: session.id,
      sessionDetailId: sessionDetail.id,
      ...sessionDetail.data(),
    });
  }

  /*for (const session of sessions.docs) {
    let sessionDetailRef = session.data().ref;
    let sessionDetail = await getDoc(sessionDetailRef);

    data.push(
      Object.assign(
        {
          sessionId: session.id,
          sessionDetailId: sessionDetail.id,
        },
        sessionDetail.data()
      )
    );
  }*/

  return data;
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

export async function getAllUsers() {
  const data = [];
  const users = await db.collection("users").orderBy("date", "desc").get();

  for (const user of users.docs) {
    const userData = user.data();
    const uid = userData.userId;
    const userRecord = await auth.getUser(uid);

    data.push({
      name: userData.name,
      photoUrl: userData.photoUrl,
      role: userData.role,
      uid: uid,
      email: userRecord.email,
    });
  }

  return users;
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
    // 1. Actualizar los datos en la colección 'users'
    const snapshot = db
      .collection("users")
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error("Usuario no encontrado en la colección 'users'.");
    }

    const userRef = snapshot.docs[0].ref;

    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (photoUrl) userUpdates.photoUrl = photoUrl;
    if (role) userUpdates.role = role;

    await userRef.update(userUpdates);

    // 2. Actualizar datos en Firebase Authentication
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
  //HASTA QUE NO ESTE EL PERFIL ADMIN CREADO NO SE PUEDE PROBAR
  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: userName,
    });
    console.log("User created successfully");
    await saveUserInCollection(userRecord.uid, userName, role);
  } catch (error) {
    console.log("Error creating user: " + error);
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
    console.log("User sucessfully deleted");
  } catch (error) {
    console.log("Error saving user in collection: " + error);
  }
}
