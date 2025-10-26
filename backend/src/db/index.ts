import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import dotenv from 'dotenv'
import * as schema from './schema.js'

dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/todo_db',
})

export const db = drizzle(pool, { schema })
export { schema }

