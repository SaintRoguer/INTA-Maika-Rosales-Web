import { resetPassword } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Remove the response handling from resetPassword function
    // and handle it here instead
    const result = await resetPassword(req);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ 
      error: error.code || "Internal server error",
      message: error.message 
    });
  }
}