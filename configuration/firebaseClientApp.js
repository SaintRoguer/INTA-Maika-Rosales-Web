/*import firebase from "firebase/compat/app";
import "firebase/compat/firestore";*/
import { initializeApp,getApps,getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//import {getAuth} from 'firebase/auth'

const clientCredentials = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

/*if (typeof window !== "undefined" && !firebase.apps.length) {
  firebase.initializeApp(clientCredentials);
}*/

const app = !getApps().length ? initializeApp(clientCredentials) : getApp();

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

//const auth = getAuth(app);

export default {app,db};
