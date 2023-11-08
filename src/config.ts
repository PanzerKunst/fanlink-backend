type Config = {
  readonly PORT: number;
  readonly IS_PROD: boolean;
  readonly DATABASE_URL: string;
  readonly FRONTEND_URL: string;
}

export const config: Config = {
  PORT: Number(process.env.PORT!),
  IS_PROD: process.env.NODE_ENV === "production",
  DATABASE_URL: process.env.DATABASE_URL!,
  FRONTEND_URL: process.env.FRONTEND_URL!
}
