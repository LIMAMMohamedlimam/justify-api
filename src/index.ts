import express, { Request, Response } from "express";
import { apiRouter } from "./routes/index.js";   
import { initDatabase } from "./db/init.js";

import dotenv from "dotenv";
dotenv.config();



// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and text bodies
app.use(express.json()); // parse application/json
app.use(express.text({ type: "text/plain" })); // parse text/plain

// Middleware to log all incoming requests
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Use the API router for all /api routes
app.use("/api", apiRouter);

// Initialize DB tables
initDatabase();


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
