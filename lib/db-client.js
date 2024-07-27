import { app } from "../configuration/firebaseClientApp";
import {
  getFirestore,
  collection,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const db = getFirestore(app);

function getDocRefFromId(collectionName, id) {
  return doc(db, collectionName, id);
}

export async function editItemFromArrayByDescription(
  attribute,
  collectionName,
  detailId,
  oldDescription,
  newDescription
) {
  const detail = getDocRefFromId(collectionName, detailId);
  const detailDoc = await getDoc(detail);
  const detailRef = detailDoc.data(); //Supuestamente es necesario usar un exists() antes de pedir la data()

  const oldArray = detailRef[attribute];

  let newArray = [];
  oldArray.map((note, index) => {
    if (note === oldDescription) {
      newArray.push(newDescription);
    } else {
      newArray.push(note);
    }
  });

  return await updateDoc(detail, { [attribute]: newArray });
}

export async function editNoteFromImage(
  loteDetailId,
  note,
  imageId,
  imageNumberInArray,
  newData
) {
  const lote = await getDocRefFromId("lotesDetails", loteDetailId).get();

  let updatedImages = [];

  const image = lote.data().images[imageNumberInArray];
  if (image.before.id === imageId && note === image.before.note) {
    image.before.note = newData;
  } else if (
    image.after &&
    image.after.id == imageId &&
    note === image.after.note
  ) {
    image.after.note = newData;
  }
  updatedImages.push(image);

  return lote.ref.update({
    images: updatedImages,
  });
}

export async function updateSession(sessionId, sessionDetailId, newData) {
  const session = await getDocRefFromId("sessions", sessionId).get();
  const sessionDetail = await getDocRefFromId(
    "sessionsDetails",
    sessionDetailId
  ).get();

  sessionDetail.ref.update({
    description: newData,
  });

  return session.ref.update({
    description: newData,
  });
}

export async function updateLote(loteDetailId, newData) {
  const loteDetail = await getDocRefFromId("lotesDetails", loteDetailId).get();

  loteDetail.ref.update({
    description: newData,
  });
}

export async function updatePastura(pasturaDetailId, newData) {
  const pasturaDetail = await getDocRefFromId(
    "pasturasDetails",
    pasturaDetailId
  ).get();

  pasturaDetail.ref.update({
    description: newData,
  });
}
