import { PrismaService } from '../prisma/prisma.service';

/**
 * Truncates all tables between integration tests.
 * Call in afterEach to ensure test isolation.
 */
export async function clearDatabase(prisma: PrismaService): Promise<void> {
  const tableNames = await prisma.db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `;

  for (const { tablename } of tableNames) {
    if (tablename !== '_prisma_migrations') {
      await prisma.db.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`,
      );
    }
  }
}
