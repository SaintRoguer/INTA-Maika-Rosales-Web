import { getAllUsers, getUid } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const currentUserUid = await getUid(req, res);
    if (!currentUserUid) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const users = await getAllUsers();

    const filteredUsers = users
      .filter(user => user.uid !== currentUserUid) 
      .map(({ role, ...rest }) => rest); 

    return res.status(200).json({ users: filteredUsers });
  } catch (error) {
    console.error("Error in API handler:", error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
}