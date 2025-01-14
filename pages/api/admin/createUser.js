import { createNewUser } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password, role } = req.body;

  try {
    await createNewUser(name, email, password, role);
    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(409).json({ error: " " +error });
  }
}
