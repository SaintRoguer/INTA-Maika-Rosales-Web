import { getAllSessions } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessions = await getAllSessions(req);
    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Error fetching sessions" });
  }
}