import admin from "../../../configuration/firebaseAdmin";

const firebase = admin.firestore();

export default async (req, res) => {
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

  return res.json(data);
};
