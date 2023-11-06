type Config = {
  readonly PG_USERNAME: string;
  readonly PG_PWD: string;
}

export const config: Config = {
  PG_USERNAME: process.env.PG_USERNAME!,
  PG_PWD: process.env.PG_PWD!
}
