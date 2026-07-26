import client from "../models/db.js";

export const getChatRooms = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await client.query(`SELECT DISTINCT c.* 
     FROM "Chat" c
     JOIN "Message" m ON c.id = m.chat_id
     WHERE m.seen = FALSE AND c.id = $1`,
      [id]);

    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      res
        .status(404)
        .json({ message: "No posts found for the given user ID." });
    }
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllChatRooms = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await client.query(`SELECT * FROM "Chat"`);

    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      res
        .status(404)
        .json({ message: "No posts found for the given user ID." });
    }
  } catch (error) {
    console.error("Database query failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserChatRooms = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await client.query(
      `
      SELECT DISTINCT ON (c.id)
        c.id AS chat_id,
        c.user1,
        c.user2,
        c.lastmessage,
        c.username,
        c.roomid,
        c.seenby,
        c.created_at,
        json_build_object(
          'id', u1.id,
          'name', u1.username,
          'email', u1.email,
          'avatar', u1.avatar
        ) AS user1_details,
        json_build_object(
          'id', u2.id,
          'name', u2.username,
          'email', u2.email,
          'avatar', u2.avatar
        ) AS user2_details
      FROM "Chat" c
      JOIN "User" u1 ON c.user1 = u1.id
      JOIN "User" u2 ON c.user2 = u2.id
      WHERE c.user1 = $1 OR c.user2 = $1
      ORDER BY c.id, c.created_at DESC
      `,
      [id]
    );

    if (response.rowCount > 0) {
      res.status(200).json(response.rows);
    } else {
      res.status(404).json({ message: "No chats found for the given user ID." });
    }
  } catch (error) {
    console.error("Database query failed:--", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




export const markAsSeen = async (req, res) => {
  const { userId, roomId } = req.body;
  try {
    // Step 1: Update `seenby` in the `Chat` table
    await client.query(
      `UPDATE "Chat"
SET seenby = array_append(COALESCE(seenby, '{}'), $1)
WHERE id = $2
AND NOT ($1 = ANY(COALESCE(seenby, '{}')));`, // Ensure the user's ID is not already in the array
      [userId, roomId]
    );

    // Step 2: Update `seen` in the `Messages` table
    await client.query(
      `UPDATE "Message"
         SET seen = TRUE
         WHERE roomid = $1
         AND seen = FALSE`, // Only update unseen messages
      [roomId]
    );

    res.status(200).json({ message: "Messages and chat marked as seen successfully." });

  } catch (error) {
    console.error("Error marking messages as seen:", error);
    res.status(500).json({ error: "An error occurred while marking messages as seen." });
  }
};

export const unseenCount = async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    // Query to count chats where the user ID is not in the seenby array
    const result = await client.query(
      `SELECT COUNT(*)
        FROM "Chat"
        WHERE (user1 = $1 OR user2 = $1)
        AND NOT ($1 = ANY(COALESCE(seenby, '{}')));`,
      [userId]
    );

    const count = result.rows[0].count;
    res.status(200).json({ count: parseInt(count, 10) });

  } catch (error) {
    console.error("Error counting unseen chats:", error);
    res.status(500).json({ error: "An error occurred while fetching the count." });
  }
}
