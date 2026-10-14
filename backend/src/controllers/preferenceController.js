// server.js
import express from 'express';
import client from "../models/db.js";// Import PostgreSQL client

const app = express();
app.use(express.json()); // For parsing JSON data

const VALID_WEIGHTS = ["low", "medium", "high", "very_high"];
const normalizeWeight = (weight) => (VALID_WEIGHTS.includes(weight) ? weight : "medium");

// Fetch user preferences
// app.get('/api/user/preferences/:userId'

export const getPreferences =  async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await client.query(
      `SELECT price, price_weight, bedroom, bedroom_weight, bathroom, bathroom_weight,
              city, city_weight, preferred_city
       FROM "UserCriteria" WHERE user_id = $1`,
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
  const {
    price,
    priceWeight,
    bedroom,
    bedroomWeight,
    bathroom,
    bathroomWeight,
    city,
    cityWeight,
    preferredCity,
  } = req.body;

  const values = [
    !!price,
    normalizeWeight(priceWeight),
    !!bedroom,
    normalizeWeight(bedroomWeight),
    !!bathroom,
    normalizeWeight(bathroomWeight),
    !!city,
    normalizeWeight(cityWeight),
    preferredCity || null,
    userId,
  ];

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
         SET price = $1, price_weight = $2,
             bedroom = $3, bedroom_weight = $4,
             bathroom = $5, bathroom_weight = $6,
             city = $7, city_weight = $8, preferred_city = $9
         WHERE user_id = $10`,
        values
      );
      res.status(200).json({ message: "Preferences updated successfully" });
    } else {
      // If preferences do not exist, insert them
      await client.query(
        `INSERT INTO "UserCriteria"
           (price, price_weight, bedroom, bedroom_weight, bathroom, bathroom_weight,
            city, city_weight, preferred_city, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        values
      );
      res.status(201).json({ message: "Preferences created successfully" });
    }
  } catch (error) {
    console.error("Error updating preferences:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
