import { email, z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string(),
  phone: z.string(),
});
