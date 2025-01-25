import admin from "firebase-admin";

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      private_key: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    }),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!/already exists/u.test(error.message)) {
    // eslint-disable-next-line no-console
    console.error("Firebase admin initialization error", error.stack);
  }
}

export const verifyIdToken = async (token) => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    return await admin.auth().verifyIdToken(token);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export default admin;
