import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const client = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  //once i use local db comment these lines
  ssl: {
    rejectUnauthorized: false, // Allows self-signed certificates
  },
});


client
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

export default client;
