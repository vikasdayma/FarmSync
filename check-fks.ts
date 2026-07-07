import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
  const result = await prisma.$queryRaw`
    SELECT
      tc.table_name AS referencing_table,
      kcu.column_name AS referencing_column,
      ccu.table_name AS referenced_table
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu
      ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name IN ('crop_cycles', 'order_items', 'inventories', 'soil_reports', 'weather_logs');
  `;
  console.log(result);
}

main().finally(() => prisma.$disconnect());