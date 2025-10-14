import { Router } from "express";
import { authRouter } from "./api/auth.js";
import { justifyRouter } from "./api/justify.js";   

export const apiRouter = Router();

// Mount auth routes
apiRouter.use("/", authRouter); 

// Mount justify routes 
/**
 * @swagger
 * /justify:
 *   post:
 *     summary: return a justified text
 *     requestBody:
 *       required: true
 *       content:
 *         text/plain:
 *           schema:
 *             type: string
 *             example: "This is an example text that needs to be justified."
 *     responses:
 *       200:
 *         description: Justified text
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "This  is  an  example  text that needs to be justified."
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Invalid token
 *       402:
 *         description: limit exceeded Payment required

 */
apiRouter.use("/justify", justifyRouter)