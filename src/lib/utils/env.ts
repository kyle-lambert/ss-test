import { type TypeOf, z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  /**
   * Stripe payments
   */
  STRIPE_PUBLISH_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  /**
   * Resend emails
   */
  RESEND_API_KEY: z.string().min(1),
  RESEND_EMAIL_FROM_ADDRESS: z.string().min(1),
});

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof envSchema> {}
  }
}
