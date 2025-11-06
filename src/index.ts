import express, { Request, Response } from "express";
import { PORT } from "./constants";
import { PrismaClient } from "@prisma/client";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/error";
import { SignUpSchema } from "./schema/users";

const app = express();
app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query", "error", "info", "warn"],
}).$extends({
  query: {
    user: {
      create({ args, query }) {
        args.data = SignUpSchema.parse(args.data);
        return query(args);
      },
    },
  },
});
app.use(errorMiddleware);
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
