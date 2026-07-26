import bcrypt from "bcrypt";
import client from "../models/db.js";
export const updateProfile = async (req, res) => {
  try {
    const { id, username, email, password, avatar } = req.body;

    // If username provided → check for duplicates first
    if (username) {
      const usernameExists = await client.query(
        `SELECT id FROM "User" WHERE username = $1 AND id != $2`,
        [username, id]
      );
      if (usernameExists.rows.length > 0) {
        return res.json({ message: "username_exists" });
      }

      await client.query(`UPDATE "User" SET username = $1 WHERE id = $2`, [username, id]);
    }

    // Update email if provided
    if (email) {
      const emailExists = await client.query(
        `SELECT id FROM "User" WHERE email = $1 AND id != $2`,
        [email, id]
      );
      if (emailExists.rows.length > 0) {
        return res.json({ message: "email_exists" });
      }

      await client.query(`UPDATE "User" SET email = $1 WHERE id = $2`, [email, id]);
    }

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await client.query(`UPDATE "User" SET password = $1 WHERE id = $2`, [hashedPassword, id]);
    }

    // Update avatar if provided
    if (avatar) {
      await client.query(`UPDATE "User" SET avatar = $1 WHERE id = $2`, [avatar, id]);
    }

    return res.json({ message: "ok" });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "error", error: error.message });
  }
};
