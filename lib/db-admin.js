import firebase from "../configuration/firebase";

async function getDocRefFromId(collectionName, id) {
  return firebase.collection(collectionName).doc(id);
}

export async function getAllSessions() {
  let data = [];

  const sessions = await firebase
    .collection("sessions")
    .orderBy("date", "desc")
    .get();

  for (const session of sessions.docs) {
    let sessionDetail = await session.data().ref.get();

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
  const session = await getDocRefFromId("sessionsDetails", sessionId);
  let data = [];

  await session
    .get()
    .then((doc) => {
      data.push(
        Object.assign(
          {
            id: doc.id,
          },
          doc.data()
        )
      );
    })
    .catch((error) => {
      return { error };
    });

  return data[0];
}

export async function getLoteDetails(loteId) {
  const {
    docs: [doc],
  } = await firebase.collection("lotesDetails").where("id", "==", loteId).get();

  return {
    docRef: doc.ref.id,
    data: doc.data(),
  };
}
