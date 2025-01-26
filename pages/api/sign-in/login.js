import { userLogin } from "../../../lib/db-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    await userLogin(email, password);
    return res.status(200).json({ message: "User logged successfully" });
  } catch (error) {
    console.error("Error logging user:", error);
    return res.status(409).json({ error: " " + error });
  }
}
