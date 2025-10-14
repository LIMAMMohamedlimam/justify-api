import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Token } from "../../../types.js";
import { redisClient } from "../../redis/redisClient.js";
import { isValidEmail, sanitizeEmail } from "../../utils/emailValidator.js";
import {  createToken, findTokenByEmail } from "../../models/token.js";
import { v4 as uuidv4 } from "uuid";



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


  var token : Token | null = await findTokenByEmail(sanitizedEmail);

  // If user does not exist, create a new one

  if (token == null) {
    try {
      const user_id : string = uuidv4()
      const jwt_token = generateJwtToken(sanitizedEmail);
      token = await createToken(
        user_id,
        sanitizedEmail,
        jwt_token,
        new Date(),
        80000
      );
    } catch (error) {
      return res.status(500).json({ error: "User creation failed" });
    }
  }

  const jwt_token = token.token


  // Generate a token for the user
  // const token = await createSession(user.id);


  
  // Return the token to the client
  return res.json({ jwt_token });
});

function generateJwtToken(email: string): string {
   // Generate JWT token
  const jwt_token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  return jwt_token;
}
  

export async function createSession(jwt_token:string): Promise<string> {

 

  // Store the token in Redis with an expiration time (e.g., 15 minutes)
  await redisClient.setEx(jwt_token, 15 * 60, String(jwt_token));

  return jwt_token;
}

// Revoke a token
export async function revokeSession(token: string) : Promise<void> {
  await redisClient.del(token);
}