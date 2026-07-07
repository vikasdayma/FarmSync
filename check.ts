import { PrismaClient } from './src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const rows = await prisma.$queryRawUnsafe(
    "SELECT column_name, is_nullable, data_type, column_default FROM information_schema.columns WHERE table_name = 'order_items' ORDER BY ordinal_position"
  );
  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });