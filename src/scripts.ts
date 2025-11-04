import dotenv from "dotenv";

dotenv.config({ path: ".env" });

if (!process.env.PORT) {
  throw new Error("PORT is not defined in environment variables");
}

export const PORT: number = parseInt(process.env.PORT, 10);
