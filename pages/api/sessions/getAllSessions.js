import { getAllSessions } from "../../../lib/db-admin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const sessions = await getAllSessions();
    return res.status(200).json({ sessions });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return res.status(500).json({ error: "Error fetching sessions" });
  }
}

/*export default async (req, res) => {
  let data = [];

  const sessions = await firebase
    .collection("sessions")
    .orderBy("date", "desc")
    .get();

  for (const session of sessions.docs) {
    let sessionDetail = await session.data().ref.get();

    data.push(
      Object.assign(
        {
          sessionId: session.id,
          sessionDetailId: sessionDetail.id,
        },
        sessionDetail.data()
      )
    );
  }

  return res.json(data);
};*/
