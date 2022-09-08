import { z } from "nestjs-zod/z";

const EnvSchema = z.object({
  PORT: z.number().default(5000),
  DATABASE_URL: z
    .string()
    .default(
      "postgresql://postgres:postgres@localhost:5434/nest?schema=public"
    ),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  COOKIE_SECRET: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.number().default(6379),
  CACHE_TTL: z.number().default(7200),
  SMTP_EMAIL: z.string().email(),
  SMTP_EMAIL_PASSWORD: z.string(),
  SMTP_NAME: z.string(),
});

export function validate(config: Record<string, unknown>) {
  const { PORT, REDIS_PORT, CACHE_TTL, ...rest } = config;
  // convert PORT env variable to number before
  // parsing thru zod schema
  const parsedEnv = EnvSchema.parse({
    PORT: parseInt(PORT as string),
    REDIS_PORT: parseInt(REDIS_PORT as string),
    CACHE_TTL: parseInt(CACHE_TTL as string),
    ...rest,
  });
  return parsedEnv;
}
