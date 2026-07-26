import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../models/db.js";

const JWT_SECRET_KEY = process.env.JWT_SECRET;

// In production the frontend and backend are on different domains, so the
// auth cookie needs `secure` + `sameSite: "none"` or the browser silently
// drops it. Localhost isn't served over HTTPS, so `secure` must stay off
// there or the cookie never gets set at all.
const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

export const register = async (req, res) => {
  const { username, email, password, criteria } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userResult = await client.query(
      `INSERT INTO "User" (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username`,
      [email, username, hashedPassword]
    );

    const userId = userResult.rows[0].id
    if (criteria && typeof criteria === "object") {
      const { bedroom, bathroom, price } = criteria;

      try {
        await client.query(
          `INSERT INTO "UserCriteria" (user_id, bedroom, bathroom, price)
       VALUES ($1, $2, $3, $4)`,
          [userId, bedroom || false, bathroom || false, price || false]
        );
      } catch (error) {
        console.error("Error inserting user preferences:", error);
        throw new Error("Error saving preferences");
      }
    }
    res.send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await client.query(
      'SELECT id, username, email, avatar FROM "User" WHERE id = $1',
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await client.query(
      `SELECT * FROM "User" WHERE username = $1`,
      [username]
    );

    if (result.rowCount > 0) {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
          expiresIn: "7d",
        });

        res
          .cookie("token", token, {
            ...authCookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
          })
          .status(200)
          .json({
            id: user.id,
            username: user.username,
            email: user.email,
            token: token,

          });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const logout = async (req, res) => {
  res.clearCookie("token", authCookieOptions).status(200).json({ message: "Logout Successful!" });
};
export const shouldBeLoggedIn = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  jwt.verify(token, JWT_SECRET_KEY, (err) => {
    if (err) return res.status(403).json({ message: "Token not Valid!" });
    res.status(200).json({ message: "You are authenticated" });
  });
};
