import { getRoleFromToken} from "../../../lib/db-client";

export default async function handler(req, res) {

   if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const role = await getRoleFromToken(req);  
      return res.status(200).json({ role });
    } catch (error) {
      console.error("Error fetching routes:", error);
      return res.status(500).json({ error: "Error fetching routes" });
    }
  }
  
