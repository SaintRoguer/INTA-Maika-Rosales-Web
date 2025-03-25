// pages/api/sessionDetails/[sessionId].js
import { getSessionDetails } from "../../../lib/db-admin";

export default async function handler(req, res) {
  const { sessionId } = req.query;
  const sessionDetails = await getSessionDetails(sessionId);
  res.status(200).json(sessionDetails);
}