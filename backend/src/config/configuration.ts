export const configuration = () => ({
  PORT: (parseInt(process.env.PORT, 10) as number) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: (parseInt(process.env.REDIS_PORT, 10) as number) || 6379,
  CACHE_TTL: (parseInt(process.env.CACHE_TTL, 10) as number) || 7200,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_NAME: process.env.SMTP_NAME,
  FRONTEND_URL: process.env.FRONTEND_URL,
});
