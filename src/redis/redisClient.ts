import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});


redisClient.on("error", (err) => console.error("Redis Client Error", err));

await redisClient.connect();