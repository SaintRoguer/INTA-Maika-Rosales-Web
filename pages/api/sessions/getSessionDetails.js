import { getSessionDetails } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.query;

  try {
    const session = await getSessionDetails(sessionId);
    return res.status(200).json({ sessions: session });
  } catch (error) {
    console.error("Error fetching session:", error);
    return res.status(500).json({ error: "Error fetching session" });
  }
}