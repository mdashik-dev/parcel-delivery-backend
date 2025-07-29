import { z } from "zod";

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

    role: z.enum(["ADMIN", "SENDER", "RECEIVER"], {
      required_error: "Role is required",
    }),
  }),
});
