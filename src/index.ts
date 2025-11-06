import express, { Request, Response } from "express";
import { PORT } from "./constants";
import { PrismaClient } from "@prisma/client";
import rootRouter from "./routes";

const app = express();
app.use(express.json());

app.use('/api', rootRouter)

export const prismaClient = new PrismaClient({
  log: ["query" , "error" , "info" , "warn"],
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
