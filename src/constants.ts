import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export const PORT: number = parseInt(process.env.PORT ?? "8000", 10);
export const JWT_SECRET: string = process.env.JWT_SECRET as string;
