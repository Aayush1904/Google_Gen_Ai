import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(
  process.env.NEXT_PUBLIC_DB_CONNECTION_STRING || 
  "postgresql://neondb_owner:rb7JgAGiy4SC@ep-snowy-block-a5zonir7.us-east-2.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle({ client: sql });
