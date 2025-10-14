import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../redis/redisClient.js";

import { pool as db } from "../db/db.js";
import { getUserBalance } from "../models/user.js";


const JWT_SECRET = process.env.JWT_SECRET || "fallback";

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Middleware to authenticate JWT token and check its validity in Redis
export async function authenticateToken(req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<Response<any, Record<string, any>> | void>  {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"


  if (!token) return res.status(401).json({ error: "Token required" }); // 401 Unauthorized

  // Vérification du token JWT
  try {
    const payload: any = jwt.verify(token, JWT_SECRET);

    // Verification de l'acitvité du token dans Redis
    const exists = await redisClient.exists(token);
    if (!exists) return res.status(403).json({ error: "Token revoked or expired" });

      req.user  = { id: payload.userId };
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}



// Middleware to check rate limit based on user's balance
export async function checkRateLimit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.id ; 
    const text = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (!userId) return res.status(400).json({ error: "User ID is required" });


    const textLength = text.length;

    // Check balance in Redis
    let balance = await redisClient.get(`balance:${userId}`);
    let balanceNum: number | null = null;
    
    if (balance === null) {
      // Not in Redis, fetch from database
        balanceNum = await getUserBalance(userId); 
      if (balanceNum === null) {
        return res.status(404).json({ error: "User not found" });
      }

      // Store in Redis for future requests 
      await redisClient.set(`balance:${userId}`, balanceNum, { EX: 3600 });
    } else {
      // Convert Redis string to number
      balanceNum = parseInt(balance, 10);
    }


    if (balanceNum < textLength) {
      return res.status(402).json({ error: "Insufficient balance" });
    }

    // Deduct balance in Redis
    balanceNum -= textLength;
    await redisClient.set(`balance:${userId}`, balanceNum, { EX: 3600 });

    console.log(`User ${userId} has balance: ${balanceNum}, text length: ${textLength}`);

    // Deduct balance in PostgreSQL
    await db.query("UPDATE users SET balance = $1 WHERE id = $2", [balanceNum, userId]);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

  
