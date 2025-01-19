import {
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  getAuth,
} from "firebase/auth";
import { app, auth } from "../configuration/firebaseClientApp";
import { getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(app);
const description = "description";

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
    //Si tenes 2 notas identicas y vos queres cambiar una, te cambia las 2.
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
  const lotesCollection = "lotesDetails";
  const campo = "images";
  const loteRef = getDocRefFromId(lotesCollection, loteDetailId);
  const lote = await getDoc(loteRef);

  const image = lote.data()[campo][imageNumberInArray];
  let updatedImages = [];

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

  return await updateDoc(loteRef, { [campo]: updatedImages });
}

export async function updateSession(sessionId, sessionDetailId, newData) {
  const sessions = "sessions";
  const sessionsDetails = "sessionsDetails";

  const sessionRef = getDocRefFromId(sessions, sessionId);
  const sessionDetailRef = getDocRefFromId(sessionsDetails, sessionDetailId);

  await updateDoc(sessionDetailRef, { [description]: newData });
  return await updateDoc(sessionRef, { [description]: newData });
}

export async function updateLote(loteDetailId, newData) {
  const lotesDetails = "lotesDetails";
  const loteDetailRef = getDocRefFromId(lotesDetails, loteDetailId);

  await updateDoc(loteDetailRef, { [description]: newData });
}

export async function updatePastura(pasturaDetailId, newData) {
  const pasturasDetails = "pasturasDetails";
  const pasturaDetailRef = getDocRefFromId(pasturasDetails, pasturaDetailId);

  await updateDoc(pasturaDetailRef, { [description]: newData });
}

export async function userlogin(email, password) {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    // Guarda el token en una cookie
    document.cookie = `token=${token}; Path=/; HttpOnly`;

    return userCredential.user;
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
}

export async function userLogout() {
  const auth = getAuth();

  try {
    await signOut(auth);
    // Elimina el token de la cookie
    document.cookie = "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  } catch (error) {
    console.error("Error en el logout:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  //Habria que hacer la parte del perfil para probar
  const { name, photoUrl, password } = updates;

  // Verifica que el usuario esté autenticado
  const currentUser = auth.currentUser;
  if (!currentUser || currentUser.uid !== userId) {
    throw new Error("Usuario no autenticado o ID de usuario no coincide");
  }

  // Actualizar Firestore (name y photoUrl)
  if (name || photoUrl) {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error("Documento de usuario no encontrado");
    }

    const updatedData = {};
    if (name) updatedData.name = name;
    if (photoUrl) updatedData.photoUrl = photoUrl;

    await updateDoc(userDocRef, updatedData);
    console.log("Perfil de usuario actualizado en Firestore");
  }

  // Actualizar Firebase Authentication (password y photoURL)
  if (password) {
    try {
      await updatePassword(currentUser, password);
      console.log("Contraseña actualizada en Firebase Authentication");
    } catch (error) {
      console.error("Error al actualizar contraseña:", error.message);
      throw error;
    }
  }
}
