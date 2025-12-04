import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Try connecting immediately
pool.connect()
  .then(() => console.log("📦 Database connected successfully!"))
  .catch(err => console.error("❌ Database connection error:", err));

export default pool;
