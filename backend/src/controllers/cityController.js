import client from "../models/db.js";

export const getCities = async (req, res) => {
  try {
    const result = await client.query('select distinct city from "Post"');
    res.send(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
