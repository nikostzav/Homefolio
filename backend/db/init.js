import fs from "fs";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// One-off setup: loads db/schema.sql (a pg_dump that uses COPY blocks) into an empty database.
// Safe to run on every start: it does nothing if the tables already exist.
const pool = new pg.Pool({
connectionString: process.env.DATABASE_URL,
ssl: { rejectUnauthorized: false },
});

const unescape = (v) => v.replace(/\\(.)/g, (m, c) => (c === "n" ? "\n" : c === "t" ? "\t" : c === "r" ? "\r" : c));
const lit = (v) => (v === "\\N" ? "NULL" : "'" + unescape(v).replace(/'/g, "''") + "'");

const run = async () => {
const check = await pool.query("SELECT to_regclass('public.\"User\"') AS t");
if (check.rows[0].t) {
console.log("Database already initialised, skipping.");
return;
}
const lines = fs.readFileSync(new URL("./schema.sql", import.meta.url), "utf8").split("\n");
const out = [];
for (let i = 0; i < lines.length; i++) {
const line = lines[i];
const m = line.match(/^COPY (\S+) \((.*)\) FROM stdin;/);
if (m) {
const rows = [];
for (i++; lines[i] !== "\\."; i++) {
rows.push("(" + lines[i].split("\t").map(lit).join(",") + ")");
}
out.push("INSERT INTO " + m[1] + " (" + m[2] + ") VALUES " + rows.join(",") + ";");
} else if (!line.startsWith("--") && !line.startsWith("SET ") && !line.includes("set_config") && line.trim()) {
out.push(line);
}
}
await pool.query(out.join("\n"));
console.log("Database initialised from schema.sql");
};

run()
.catch((err) => {
console.error("DB init failed:", err);
process.exitCode = 1;
})
.finally(() => pool.end());

