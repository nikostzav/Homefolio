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

// Neon (and Postgres generally) can close idle connections at any time -
// e.g. Neon scaling to zero. Without this handler, an idle client erroring
// out is an unhandled 'error' event, which crashes the whole process.
client.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client:", err);
});

export default client;
