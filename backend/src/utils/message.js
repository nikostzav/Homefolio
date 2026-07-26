import client from "../models/db.js";
/**
 * Get the Message Model
 */

// Resolves the conversation by (listing, user pair) rather than requiring
// the caller to already know the chat's own id - that id doesn't exist yet
// for a brand-new conversation, so relying on it silently returned no
// history for the very first exchange between two users.
export const fetchMessages = async (roomId, userId, receiver) => {
  try {
    const query = `
      SELECT m.* FROM "Message" m
      JOIN "Chat" c ON m.chatid = c.id
      WHERE c.roomid = $1
      AND ((c.user1 = $2 AND c.user2 = $3) OR (c.user1 = $3 AND c.user2 = $2))
      ORDER BY m.created_at ASC
    `;
    const result = await client.query(query, [roomId, userId, receiver]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
};
