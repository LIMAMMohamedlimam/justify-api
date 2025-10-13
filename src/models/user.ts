import { user } from "../../types.js";
import { pool } from "../db/db.js";
import { v4 as uuidv4 } from "uuid";

const STANDARD_BALANCE = 80_000;

// Create a new user with a unique ID and standard balance
export async function createUser(email: string) : Promise<user> {

  const id : string = uuidv4();
  const balance : number = STANDARD_BALANCE;
  // const last_reset : Date = new Date();

  const result = await pool.query(
    "INSERT INTO users (id,email,balance) VALUES ($1,$2,$3) RETURNING *",
    [id,email,balance]
  );
  console.log(result.rows);

  if (!result.rows[0]) throw new Error("User creation failed");

  return { id, email, balance} as user;
}

// Find a user by their email
export async function findUserByEmail(email: string) : Promise<user | null> {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

// Find a user by their ID
export async function findUserById(id: string) : Promise<user | null> {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

// Update a user's balance
export async function updateUserBalance(id: string, newBalance: number) : Promise<user | null> {
  const result = await pool.query(
    "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
    [newBalance, id]
  );
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

// Get a user's balance
export async function getUserBalance(id: string) : Promise<number | null> {
  const result = await pool.query("SELECT balance FROM users WHERE id = $1", [id]);
  if (result.rows.length === 0) return null;
  return result.rows[0].balance;
}

