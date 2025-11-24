import { email, z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string(),
  phone: z.string(),
});

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().nullable().optional(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  pinCode: z.string().min(6),
});

export const UpdateUserSchema = z.object({
  name: z.string().optional(),
  defaultShippingAddress: z.number().optional(),
  defaultBillingAddress: z.number().optional(),
});
