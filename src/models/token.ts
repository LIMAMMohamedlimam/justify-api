import { pool } from "../db/db.js";
import type { Token } from "../types.js";


// Create a new token for a user with an expiration date
export async function createToken(id: string,email : string,  jwt_token: string, last_reset: Date, balance:number) : Promise<Token> {
  const result = await pool.query(
    `INSERT INTO tokens (id, email, token,balance,last_reset)
     VALUES ($1, $2, $3,$4,$5)
     RETURNING *`,
    [id,email, jwt_token,balance,last_reset]
  );
  return result.rows[0];
}

// Find a token by its value
export async function findTokenByToken(jwt_token: string) : Promise<Token | null> {
  const result = await pool.query("SELECT * FROM tokens WHERE token = $1", [jwt_token]);
  return result.rows[0];
}

export async function findTokenByEmail(email: string) : Promise<Token | null> {
  const result = await pool.query("SELECT * FROM tokens WHERE email = $1", [email]);
  return result.rows[0];
}

export async function updateTokenBalance(jwt_token: string, newBalance: number): Promise<void> {
  await pool.query("UPDATE tokens SET balance = $1 WHERE token = $2", [newBalance, jwt_token]);
}

// Export function to get token balance
export async function getTokenBalance(jwt_token: string): Promise<number | null> {
  const result = await pool.query("SELECT balance FROM tokens WHERE token = $1", [jwt_token]);
  if (result.rows.length > 0) {
    return result.rows[0].balance;
  }
  return null; // Token not found
}

// Export function to reset token balance and last_reset timestamp
export async function resetTokenBalance(jwt_token: string, defaultBalance: number): Promise<void> {
  await pool.query(
    "UPDATE tokens SET balance = $1, last_reset = CURRENT_TIMESTAMP WHERE token = $2",
    [defaultBalance, jwt_token]
  );
}

// Revoke (delete) a token
export async function deleteToken(jwt_token: string) : Promise<void> {
  await pool.query("DELETE FROM tokens WHERE token = $1", [jwt_token]);
}

// Delete expired tokens
// export async function deleteExpiredTokens() {
//   await pool.query("DELETE FROM tokens WHERE expiration_date < NOW()");
// }
