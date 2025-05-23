export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const cookie = require("cookie");
  try {
    const tokenCookie = cookie.serialize("token", null, {
      httpOnly: true, // Para proteger la cookie
      secure: true,
      sameSite: "lax",
      maxAge: 0, // Expiración de 1 hora (en segundos)
      path: "/",
      expires: new Date(0),
    });
    const roleCookie = cookie.serialize("role", null, {
      httpOnly: true, // Para proteger la cookie
      secure: true,
      sameSite: "lax",
      maxAge: 0, // Expiración de 1 hora (en segundos)
      path: "/",
      expires: new Date(0),
    });
    res.setHeader("Set-Cookie", [tokenCookie, roleCookie]);
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(409).json({ error: " " + error });
  }
}
