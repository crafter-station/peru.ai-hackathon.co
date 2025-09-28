import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  console.warn("DATABASE_URL is not set. Database features will be disabled.")
}

export const sql = databaseUrl ? neon(databaseUrl) : undefined
export const db = sql ? drizzle(sql, { schema }) : undefined


