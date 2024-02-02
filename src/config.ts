type Config = {
  readonly IS_PROD: boolean;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly FRONTEND_URL: string;
  readonly UPLOADS_DIR: string;
  readonly STRIPE_SECRET_KEY: string;
  readonly STRIPE_PREMIUM_MEMBERSHIP_PRICE_USD: string;
  readonly STRIPE_PREMIUM_MEMBERSHIP_PRICE_EUR: string;
}

export const config: Config = {
  IS_PROD: process.env.NODE_ENV === "production",
  PORT: Number(process.env.PORT!),
  DATABASE_URL: process.env.DATABASE_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!,
  UPLOADS_DIR: process.env.UPLOADS_DIR!,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
  STRIPE_PREMIUM_MEMBERSHIP_PRICE_USD: process.env.STRIPE_PREMIUM_MEMBERSHIP_PRICE_USD!,
  STRIPE_PREMIUM_MEMBERSHIP_PRICE_EUR: process.env.STRIPE_PREMIUM_MEMBERSHIP_PRICE_EUR!
}
