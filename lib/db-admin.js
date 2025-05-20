import { get } from "react-hook-form";
import admin from "../configuration/firebaseAdmin";
const db = admin.firestore();
const auth = admin.auth();
const cookie = require("cookie");
import { verifyIdToken } from "../configuration/firebaseAdmin";


function getDocRefFromId(collectionName, id) {
  return db.collection(collectionName).doc(id);
}


export async function getAllSessions(req,res) {

  let data = [];

  try {
    
    const uid = await getUid(req, res);
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
  const session = await db
  .collection("sessions")
  .where("id", "==", sessionId)
  .get();

  const path = session.docs[0].data().ref.path;
  const id = path.split("/")[1];

  const sessionDetailRef = getDocRefFromId("sessionsDetails", id);
  const sessionDetail = await sessionDetailRef.get();

  let data = [];


  data.push(
    Object.assign(
      {
        id: sessionDetail.id,
        refID : id
      },
      sessionDetail.data()
    )
  );

  return data[0];
}


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
          shared: userData?.shared || {},
        });
      } catch (err) {
        console.error(`Error fetching user data for UID ${uid}:`, err);
      }
    }

    return data.map((user) => ({
      name: user.name,
      photoUrl: user.photoUrl,
      role: user.role,
      uid: user.uid,
      email: user.email,
      shared: user.shared,
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
    // 1. Create Auth user
    const userRecord = await auth.createUser({
      email: email,
      password: password,
      displayName: userName,
    });
    
    console.log("User created successfully");
    
    // 2. Create Firestore document with matching ID
    await saveUserInCollection(userRecord.uid, userName, role);
    
    return userRecord.uid; // Return the UID/document ID
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function saveUserInCollection(uid, userName, role) {
  try {
    // Use uid as the document ID
    await db.collection("users").doc(uid).set({
      userId: uid, // Still store uid as a field for query flexibility
      name: userName,
      role: role,
      photoUrl: "",
      shared: {},
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`User document created with ID: ${uid}`);
  } catch (error) {
    console.error("Error saving user document:", error);
    throw error; // Re-throw to handle in createNewUser
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
    console.log("Error deleting user in collection: " + error);
  }
}

export async function getAllRoles() {
  const sessionsSnapshot = await db
      .collection("roles")
      .get();
  
  const roles = sessionsSnapshot.docs.map((doc) => doc.data().roleName);

  return roles;
}

export async function getSharedSessions(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Get user document
    const userQuery = await db.collection("users").where("userId", "==", uid).get();
    if (userQuery.empty) {
      return res.status(404).json({ error: "User not found" });
    }
    
    const userData = userQuery.docs[0].data();
    const sharedSessions = userData.shared || {};
    
    const sharedSessionIds = Object.keys(sharedSessions);

    if (sharedSessionIds.length === 0) {
      return [];
    }

    // Get all shared sessions
    const sessionsRef = db.collection("sessions");
    const chunkSize = 10;
    const queryPromises = [];

    for (let i = 0; i < sharedSessionIds.length; i += chunkSize) {
      const chunk = sharedSessionIds.slice(i, i + chunkSize);
      queryPromises.push(
        sessionsRef
          .where("id", "in", chunk)
          .orderBy("date", "desc")
          .get()
      );
    }

    const snapshots = await Promise.all(queryPromises);
    const sessionDocs = snapshots.flatMap(snapshot => snapshot.docs);

    // Get session details for each session
    const sessionDetailsPromises = sessionDocs.map(async (session) => {
      const sessionData = session.data();
      const sessionDetailSnapshot = await sessionData.ref.get();

      return {
        sessionId: session.id,
        sessionDetailId: sessionData.id,
        permission: sharedSessions[sessionData.id], // Include permission level
        ...sessionDetailSnapshot.data(),
      };
    });

    const data = await Promise.all(sessionDetailsPromises);

    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Error in getSharedSessions:", error);
    if (res) {
      return res.status(500).json({ error: "Internal server error" });
    }
    throw error;
  }
}

export async function synchronizeUsersPermissions(req, res) {
  try {
    const { sessionId, sharedUsers, allUsers } = req.body;
    
    if (!sessionId || !Array.isArray(sharedUsers)) {
      return res.status(400).json({ 
        error: 'Missing required parameters: sessionId and sharedUsers must be provided' 
      });
    }

    const batch = db.batch();
    const operations = [];

    allUsers.forEach((user) => {
      if (user?.shared && sessionId in user.shared) {
        const userRef = db.collection("users").doc(user.uid);
        operations.push({
          type: 'remove',
          user: user.uid
        });
        batch.update(userRef, {
          [`shared.${sessionId}`]: admin.firestore.FieldValue.delete()
        });
      }
    });

    sharedUsers.forEach((user) => {
      if (!user?.uid) {
        console.warn('Skipping invalid user in sharedUsers:', user);
        return;
      }
      
      const userRef = db.collection("users").doc(user.uid);
      operations.push({
        type: 'update',
        user: user.uid,
        permission: user.permission
      });
      batch.update(userRef, {
        [`shared.${sessionId}`]: user.permission
      });
    });

    if (operations.length === 0) {
      console.log('No permission changes needed');
      return res.status(200).json({ 
        message: 'No permission changes required',
        operations: [] 
      });
    }

    await batch.commit();
    
    console.log(`Successfully updated permissions for session ${sessionId}`, {
      totalOperations: operations.length,
      operations
    });

    return res.status(200).json({
      success: true,
      sessionId,
      updatedUsers: operations.length,
      operations
    });

  } catch (error) {
    console.error('Error synchronizing permissions:', error);
    return res.status(500).json({ 
      error: 'Failed to synchronize permissions',
      details: error.message 
    });
  }
}

export async function getUid(req, res) {
  try {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;
    
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = await verifyIdToken(token);
    return decodedToken.uid; 
    
  } catch (error) {
    console.error("Error in getUid:", error);   
    if (error.code === 'auth/id-token-expired' || 
        error.code === 'auth/argument-error') {
      return res.status(401).json({ error: "Invalid or expired token" });
    }
    
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}

export async function setEolicErosionCoefficients(req, res) { 
  try {
    const { windVelocity, soilSensitivity, loteDetailId } = req.body;
    if (!loteDetailId) {
      return res.status(400).json({ error: "Lote Detail ID is required" });
    }
    const sessionRef = db.collection("lotesDetails").doc(loteDetailId);
    await sessionRef.update({
      windVelocity: windVelocity,
      soilSensitivity: soilSensitivity,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return res.status(200).json({
      success: true,
      message: "Coeficientes actualizados con éxito",
      windVelocity: windVelocity,
      soilSensitivity: soilSensitivity,
    });
  } catch (error) {
    console.error("Error al cambiar los coeficientes:", error);
    if (error.code === 'not-found') {
      return res.status(404).json({ error: "Sesión no encontrada" });
    }
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message 
    });
  }
}

