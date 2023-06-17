import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

/**
 * Login
 */
const loginSchema = z.object({
  email: z.string().email().trim(),
  password: z.string().min(1).trim(),
});
export type LoginSchema = z.infer<typeof loginSchema>;
export const loginValidator = withZod(loginSchema);
export type LoginContext = Record<"formData", z.infer<typeof loginSchema>>;

/**
 * Register
 */
const registerSchema = z
  .object({
    fullName: z.string().min(1).trim(),
    email: z.string().email(),
    password: z.string().min(1).trim(),
    confirmPassword: z.string().min(1).trim(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "'Password' and 'Confirm Password' must be identical",
    path: ["confirmPassword"],
  });
export type RegisterSchema = z.infer<typeof registerSchema>;
export const registerValidator = withZod(registerSchema);

/**
 * Reset password
 */
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(1).trim(),
    confirmNewPassword: z.string().min(1).trim(),
  })
  .refine(
    ({ newPassword, confirmNewPassword }) => newPassword === confirmNewPassword,
    {
      message: "'New Password' and 'Confirm New Password' must be identical",
      path: ["confirmNewPassword"],
    }
  );
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export const resetPasswordValidator = withZod(resetPasswordSchema);
