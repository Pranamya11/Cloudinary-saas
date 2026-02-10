require("dotenv").config();
const { Client } = require("pg");

console.log("DB URL:", process.env.DATABASE_URL ? "FOUND ✅" : "MISSING ❌");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

(async () => {
  try {
    await client.connect();
    const res = await client.query("SELECT NOW()");
    console.log("Neon connected ✅", res.rows);
    await client.end();
  } catch (err) {
    console.error("Connection failed ❌", err.message);
  }
})();
