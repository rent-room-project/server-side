import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must have at least 3 characters")
    .max(255, "Username is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email must be a valid Email" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(5, "Password must have at least 5 characters")
    .max(255, "Password is too long"),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, "Role must have at least 1 character")
    .max(255, "Role is too long"),
  phoneNumber: z
    .string()
    .min(8, "Phone Number must have at least 8 characters")
    .max(18, "Phone Number is too long")
    .optional(),
  address: z
    .string()
    .min(1, "Address must have at least 1 character")
    .max(255, "Address is too long")
    .optional(),
});

export const loginSchema = userSchema.pick({ email: true, password: true });

export type RegisterPayload = z.infer<typeof userSchema>;

export type LoginPayload = z.infer<typeof loginSchema>;
