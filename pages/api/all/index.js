import admin from "../../../configuration/firebaseAdmin";

const firebase = admin.firestore();

export default async (req, res) => {
  let dataResult = [];

  const sessions = await firebase
    .collection("sessions")
    .orderBy("date", "desc")
    .get();

  for (const session of sessions.docs) {
    let sessionDetails = await session.data().ref.get();

    let data = [];

    for (const lote of sessionDetails.data().lotes) {
      let lotesDetails = await firebase
        .collection("lotesDetails")
        .doc(lote.ref.id)
        .get();

      let pasturasData = [];
      if (lotesDetails.data()) {
        for (const pastura of lotesDetails.data().pasturas) {
          let pasturasDetails = await firebase
            .collection("pasturasDetails")
            .doc(pastura.ref.id)
            .get();

          pasturasData.push({
            data: pasturasDetails.data(),
            pasturaDetailId: pasturasDetails.ref.id,
          });
        }
      }

      data.push(
        Object.assign({
          loteDetailId: lotesDetails.ref.id,
          loteData: lotesDetails.data(),
        })
      );
    }
    dataResult.push({
      sessionData: {
        description: sessionDetails.data().description,
        user: sessionDetails.data().user,
        creationDate: sessionDetails.data().date,
        notes: sessionDetails.data().notes,
      },
      lotesAndPasturasData: {
        data,
      },
    });
  }

  return res.json(dataResult);
};
