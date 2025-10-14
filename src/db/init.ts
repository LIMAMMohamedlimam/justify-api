import { pool } from "./db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function initDatabase() {
  try {
    // getting shema.sql file path and executing its content
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.join(__dirname, "schema.sql");
    const sql = fs.readFileSync(filePath, "utf-8");
    await pool.query(sql);

  } catch (err) {
    console.error("Error initializing database:", err);
  }
}
