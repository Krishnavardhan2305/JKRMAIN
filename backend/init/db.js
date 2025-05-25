import pg from "pg";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') }); 

const { Pool } = pg;


const pool = new Pool({
  connectionString: process.env.DB_STRING,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to Supabase PostgreSQL!");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
})();

pool.on("error", (err) => {
  console.error("Unexpected database error:", err);
  process.exit(1);
});

export const query = (text, params) => pool.query(text, params);
export default pool;

