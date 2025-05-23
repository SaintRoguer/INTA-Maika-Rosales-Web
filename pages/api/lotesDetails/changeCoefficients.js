import { setEolicErosionCoefficients } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await setEolicErosionCoefficients(req,res);  
    return res.status(200);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Error fetching sessions" });
  }
}
