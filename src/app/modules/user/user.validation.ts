import { z } from "zod";
import { Role } from "./user.interface";

export const createUserZodSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
      })
      .min(3, "Name must be at least 3 characters long"),

    email: z
      .string({
        required_error: "Email is required",
      })
      .email("Invalid email address"),

    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must contain uppercase, lowercase, number, and special character"
      ),

    role: z.enum([...Object.values(Role)] as [string, ...string[]], {
      required_error: "Role is required",
    }),
  }),
});


export const blockUserZodSchema = z.object({
  params: z.object({
    id: z
      .string({
        required_error: "User ID is required",
      })
      .regex(/^[a-f\d]{24}$/i, "Invalid user ID format"),
  }),
});
