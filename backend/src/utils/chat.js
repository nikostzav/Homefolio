import client from "../models/db.js";
/**
 * Save a chat message, reusing an existing conversation between these two
 * users about this listing if one already exists (looked up server-side,
 * rather than trusting a client-supplied chat id which may be stale or
 * unknown for a brand-new conversation).
 */
export const saveChat = async (text, userid, receiver, roomid, username) => {
  let chatid;
  try {
    const checkQuery = `
      SELECT id FROM "Chat"
      WHERE roomid = $1
      AND ((user1 = $2 AND user2 = $3) OR (user1 = $3 AND user2 = $2))
      LIMIT 1;
    `;
    const checkResult = await client.query(checkQuery, [roomid, userid, receiver]);

    if (checkResult.rowCount > 0) {
      chatid = checkResult.rows[0].id;
    } else {
      const insertQuery = `
        INSERT INTO "Chat" (user1, user2, lastmessage, roomid, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id;
      `;
      const insertResult = await client.query(insertQuery, [
        userid,
        receiver,
        text,
        roomid,
        username,
      ]);
      chatid = insertResult.rows[0].id;
    }
  } catch (error) {
    console.error("Error resolving chat:", error);
    throw error;
  }

  try {
    await client.query(`UPDATE "Chat" SET lastmessage = $1 WHERE id = $2`, [
      text,
      chatid,
    ]);

    const query = `
      INSERT INTO "Message" (text, userid, chatid, receiver, roomid, username)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;
    const values = [text, userid, chatid, receiver, roomid, username];
    const result = await client.query(query, values);
    return { chatId: chatid, message: result.rows[0] };
  } catch (error) {
    console.error("Error adding message:", error);
    throw error;
  }
};

/**
 * Fetch all chats
 */
export const fetchChats = async () => {
  try {
    const result = await client.query(`SELECT * FROM "Chat" ORDER BY id ASC`);
    return result.rows;
  } catch (error) {
    console.error("Error fetching chats:");
  }
};
