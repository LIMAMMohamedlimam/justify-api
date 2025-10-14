import { Express } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "justify-api",
      version: "1.0.0",
      description: "API documentation",
    },
    servers: [
      {
        url: process.env.BASE_URL || "http://localhost:5000/api",
      },
    ],
  },
  // Path to your route files
  apis: ["./src/routes/*.ts" , "./src/routes/api/*.ts"], 
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
