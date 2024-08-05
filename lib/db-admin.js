//import firebase from "../configuration/firebase";
import { app } from "../configuration/firebaseClientApp";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore(app);

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
  /*
  const {
    docs: [doc],
  } = await firebase.collection("lotesDetails").where("id", "==", loteId).get();

  return {
    docRef: doc.ref.id,
    data: doc.data(),
  };*/
}
