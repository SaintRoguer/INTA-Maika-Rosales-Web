import admin from "../../../configuration/firebaseAdmin";

const firebase = admin.firestore();

export default async (req, res) => {
  let data = [];

  const sessionDetails = await firebase
    .collection("sessionsDetails")
    .doc(req.query.sessionId)
    .get();

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
        sessionData: {
          description: sessionDetails.data().description,
          user: sessionDetails.data().user,
          creationDate: sessionDetails.data().date,
          notes: sessionDetails.data().notes,
        },
        loteDetailId: lotesDetails.ref.id,
        loteData: lotesDetails.data(),
        pasturasData: pasturasData,
      })
    );
  }

  return res.json(data);
};
