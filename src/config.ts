type Config = {
  readonly PORT: number;
  readonly DATABASE_URL: string;
}

export const config: Config = {
  PORT: Number(process.env.PORT!),
  DATABASE_URL: process.env.DATABASE_URL!
}
