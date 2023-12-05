type Config = {
  readonly IS_PROD: boolean;
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly FRONTEND_URL: string;
}

export const config: Config = {
  IS_PROD: process.env.NODE_ENV === "production",
  PORT: Number(process.env.PORT!),
  DATABASE_URL: process.env.DATABASE_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!
}
