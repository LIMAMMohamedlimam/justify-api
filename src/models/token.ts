import { pool } from "../db/db.js";
import type { token } from "../../types.js";

// Create a new token for a user with an expiration date
export async function createToken(userId: string, token: string , expiration_date: Date) {
  const result = await pool.query(
    `INSERT INTO tokens (user_id, token , expiration_date)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, token, expiration_date]
  );
  return result.rows[0];
}

// Find a token by its value
export async function findToken(token: string) : Promise<token> {
  const result = await pool.query("SELECT * FROM tokens WHERE token = $1", [token]);
  return result.rows[0];
}

// Delete expired tokens
// export async function deleteExpiredTokens() {
//   await pool.query("DELETE FROM tokens WHERE expiration_date < NOW()");
// }
