import { Router } from "express";
import { authRouter } from "./api/auth.js";
import { justifyRouter } from "./api/justify.js";   

export const apiRouter = Router();

// Mount auth routes
apiRouter.use("/", authRouter); 

// Mount justify routes 
apiRouter.use("/justify", justifyRouter)