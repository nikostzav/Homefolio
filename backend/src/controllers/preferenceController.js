// server.js
import express from 'express';
import client from "../models/db.js";// Import PostgreSQL client

const app = express();
app.use(express.json()); // For parsing JSON data

// Fetch user preferences
// app.get('/api/user/preferences/:userId'

export const getPreferences =  async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await client.query(
      `SELECT price, bedroom, bathroom FROM "UserCriteria" WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      // If preferences are found, return them
      res.json(result.rows[0]);
    } else {
      // If no preferences are found, return default values
      res.status(404).json({ error: "Preferences not found for this user" });
    }
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// app.put('/api/user/preferences/:userId', 

// Update user preferences
export const updatePreferences = async (req, res) => {
  const { userId } = req.params;
  const { price, bedroom, bathroom } = req.body;

  try {
    // Check if preferences already exist for this user
    const result = await client.query(
      `SELECT * FROM "UserCriteria" WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length > 0) {
      // If preferences exist, update them
      await client.query(
        `UPDATE "UserCriteria"
         SET price = $1, bedroom = $2, bathroom = $3
         WHERE user_id = $4`,
        [price, bedroom, bathroom, userId]
      );
      res.status(200).json({ message: "Preferences updated successfully" });
    } else {
      // If preferences do not exist, insert them
      await client.query(
        `INSERT INTO "UserCriteria" (user_id, price, bedroom, bathroom)
         VALUES ($1, $2, $3, $4)`,
        [userId, price, bedroom, bathroom]
      );
      res.status(201).json({ message: "Preferences created successfully" });
    }
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

