import { verifyIdToken } from "../../../configuration/firebaseAdmin";
import { getUserRole } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, uid } = req.body;
  const cookie = require("cookie");

  try {
    await verifyIdToken(token);
    const role = await getUserRole(uid);
    const tokenCookie = cookie.serialize("token", token, {
      httpOnly: true, // Para proteger la cookie
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60, // Expiración de 1 hora (en segundos)
      path: "/",
    });
    const roleCookie = cookie.serialize("role", role, {
      httpOnly: true, // Para proteger la cookie
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60, // Expiración de 1 hora (en segundos)
      path: "/",
    });
    res.setHeader("Set-Cookie", [tokenCookie, roleCookie]);
    return res.status(200).json({ message: "User logged successfully", role });
  } catch (error) {
    console.error("Error logging user:", error);
    return res.status(409).json({ error: " " + error });
  }
}
