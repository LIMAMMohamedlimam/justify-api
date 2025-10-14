import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { user } from "../../../types.js";
import { redisClient } from "../../redis/redisClient.js";
import { findUserByEmail , createUser } from "../../models/user.js";
import { isValidEmail, sanitizeEmail } from "../../utils/emailValidator.js";




export const authRouter = Router() ;

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || "fallback";
const JWT_EXPIRATION = "10m"; 

// token endpoint to authenticate user and provide a token
/**
 * @swagger
 * /token:
 *   post:
 *     summary: Authenticate user and get a token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "foo@gmail.com"
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Bad Request - Missing or invalid email
 *       500:
 *         description: Internal Server Error - User creation failed
 */
authRouter.post("/token", async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  //  validate and sanitize email
  const sanitizedEmail = sanitizeEmail(email)
  if (!isValidEmail(sanitizedEmail)) return res.status(400).json({ error: "Invalid email" }); 


  let user : user | null = await  findUserByEmail(email); 

  // If user does not exist, create a new one

  if (user == null) {
    try {
      user = await createUser(email);
    } catch (error) {
      return res.status(500).json({ error: "User creation failed" });
    }
  }


  // Generate a token for the user
  const token = await createSession(user.id);

  console.log(`User ${user.email} authenticated`);

  // Create and Store the session/token in Redis 
  await createSession(user.id);
  
  // Return the token to the client
  return res.json({ token });
});



export async function createSession(userId:string): Promise<string> {

  // Generate JWT token
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  // Store the token in Redis with an expiration time (e.g., 15 minutes)
  await redisClient.setEx(token, 15 * 60, String(userId));

  return token;
}

// Revoke a token
export async function revokeSession(token: string) : Promise<void> {
  await redisClient.del(token);
}