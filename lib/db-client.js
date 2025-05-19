import {
  signInWithEmailAndPassword,
  signOut,
  updateCurrentUser,
  updateProfile,
  updatePassword,
  getAuth,
} from "firebase/auth";
import { app, auth } from "../configuration/firebaseClientApp";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  where,
  collection,
  query,
  getDocs,
} from "firebase/firestore";

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

export async function updateSession(
  sessionId,
  sessionDetailId,
  newDescription
) {
  const sessions = "sessions";
  const sessionsDetails = "sessionsDetails";

  try {
    // Obtener referencia a la sesión
    const sessionRef = doc(db, sessions, sessionId);

    // Primero buscar el documento que tenga sessionDetailId en su campo id
    const detailsQuery = query(
      collection(db, sessionsDetails),
      where("id", "==", sessionDetailId)
    );

    const querySnapshot = await getDocs(detailsQuery);

    if (querySnapshot.empty) {
      throw new Error("No se encontró el detalle de sesión con ese ID");
    }
    // Obtener la referencia al primer documento que coincida
    const sessionDetailRef = querySnapshot.docs[0].ref;

    // Actualizar ambos documentos
    await updateDoc(sessionDetailRef, { description: newDescription });
    await updateDoc(sessionRef, { description: newDescription });

    return { success: true };
  } catch (error) {
    console.error("Error al actualizar documentos:", error);
    throw error;
  }
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

export async function userLogin(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    return { token: token, uid: userCredential.user.uid };
  } catch (error) {
    console.error("Error en el login:", error);
    throw error;
  }
}

export async function userLogout() {
  const auth = getAuth();

  try {
    await signOut(auth);
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
