import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { redisClient } from "../redis/redisClient.js";

import { findTokenByEmail, getTokenBalance, updateTokenBalance } from "../models/token.js";
import { sanitizeEmail } from "../utils/emailValidator.js";
import { createSession } from "./api/auth.js";


const JWT_SECRET = process.env.JWT_SECRET || "fallback";

// Extend Request interface to include user property
interface AuthenticatedRequest extends Request {
  token?: string | null ;
}

// Middleware to authenticate JWT token and check its validity in Redis
export async function authenticateToken(req: AuthenticatedRequest, 
  res: Response, 
  next: NextFunction
): Promise<Response<any, Record<string, any>> | void>  {
  const authHeader = req.headers["authorization"];
  const jwt_token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"


  if (!jwt_token) return res.status(401).json({ error: "Token required" }); // 401 Unauthorized

  

  // Vérification du token JWT
  try {
    const payload: any = jwt.verify(jwt_token, JWT_SECRET);

    // Verification de l'acitvité du token dans Redis
    const exists = await redisClient.exists(jwt_token);
    
    if (!exists){
      const dbToken = await findTokenByEmail(sanitizeEmail(payload.email));
      if (dbToken == null) return res.status(403).json({ error: "Token revoked or expired" });
    }
    
    await createSession(payload.email); // Refresh session in Redis
    
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) return res.status(403).json({ error: "Token expired" });
    return res.status(403).json({ error: "Invalid token" });
  }
}



// Middleware to check rate limit based on user's balance
export async function checkRateLimit(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {

    const authHeader = req.headers["authorization"];
    const jwt_token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

    const text = req.body;

    if (!text) return res.status(400).json({ error: "Text is required" });
    if (!jwt_token) return res.status(400).json({ error: "Token is required" });


    const textLength = text.length;

    // Check balance in Redis
    let balance = await redisClient.get(`balance:${jwt_token}`);
    let balanceNum: number | null = null;
    
    if (balance === null) {
      // Not in Redis, fetch from database
        balanceNum = await getTokenBalance(jwt_token); 
      if (balanceNum === null) {
        return res.status(404).json({ error: "token not found" });
      }

      // Store in Redis for future requests 
      await redisClient.set(`balance:${jwt_token}`, balanceNum, { EX: 3600 });
    } else {
      // Convert Redis string to number
      balanceNum = parseInt(balance, 10);
    }


    if (balanceNum < textLength) {
      return res.status(402).json({ error: "Insufficient balance" });
    }

    // Deduct balance in Redis
    balanceNum -= textLength;
    await redisClient.set(`balance:${jwt_token}`, balanceNum, { EX: 3600 });


    // Deduct balance in PostgreSQL
    await updateTokenBalance(jwt_token, balanceNum);

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

  
