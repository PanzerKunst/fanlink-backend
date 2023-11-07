import * as dotenv from "dotenv"
import type { Config } from "drizzle-kit"

dotenv.config()

export default {
  schema: "./src/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: "postgresql://postgres:6gW^tm@4MC1T@localhost:5432/fanlink",
    // connectionString: "postgres://jwfckpjvvvdofw:a92ab70a4b85f73d988b0a1871fc869b4249d5b981f97ea36af014836e06d3c3@ec2-54-78-142-10.eu-west-1.compute.amazonaws.com:5432/d3cvkk2lhrjsid",
  }
} satisfies Config
