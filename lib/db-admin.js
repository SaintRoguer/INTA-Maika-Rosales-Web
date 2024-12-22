import { deleteUser } from "firebase/auth";
import admin from "../configuration/firebaseAdmin";
import {
  collection,
  query,
  orderBy,
  getDoc,
  getDocs,
  doc,
} from "firebase/firestore";

const db = admin.firestore();
const auth = admin.auth();

function getDocRefFromId(collectionName, id) {
  return doc(db, collectionName, id);
}

export async function getAllSessions() {
  let data = [];

  const sessionsQuery = query(
    collection(db, "sessions"),
    orderBy("date", "desc")
  );
  const sessions = await getDocs(sessionsQuery);

  for (const session of sessions.docs) {
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
  }

  return data;
}

export async function getSessionDetails(sessionId) {
  const sessionsDetails = "sessionsDetails";
  const sessionRef = getDocRefFromId(sessionsDetails, sessionId);
  let data = [];

  const session = await getDoc(sessionRef);
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

export async function getLoteDetails(loteId) {
  //Creo que no se usa en ningun lado
  const lotesDetailsQuery = query(
    collection(db, "lotesDetails"),
    where("id", "==", loteId)
  );
  const lotesDetails = await getDocs(lotesDetailsQuery);

  const loteDetails = lotesDetails.docs[0];
  console.log("getLoteDetails");
  console.log(loteDetails);

  return {
    docRef: loteDetails.id,
    data: loteDetails.data(),
  };
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

export async function deleteUser(uid) {
  //HASTA QUE NO ESTE EL PERFIL ADMIN CREADO NO SE PUEDE PROBAR
  try {
    await auth.deleteUser(uid);
    console.log("User sucessfully deleted");
  } catch (error) {
    console.log("Error saving user in collection: " + error);
  }
}
