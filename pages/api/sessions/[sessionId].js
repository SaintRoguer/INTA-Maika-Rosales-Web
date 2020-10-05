import firebase from "../../../configuration/firebase";

export default (req, res) => {
  let sessionsDetailsRef = firebase.collection("sessionsDetails");
  let querySessionDetails = sessionsDetailsRef
    .where("id", "==", req.query.sessionId)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log("No matching SessionDetails.");
        return res.json([]);
      }
      let infoArray = [];

      snapshot.forEach((doc) => {
        infoArray.push(doc.data());
      });
      return res.json(infoArray[0]);
    })
    .catch((err) => {
      console.log("Error getting documents", err);
    });
};
