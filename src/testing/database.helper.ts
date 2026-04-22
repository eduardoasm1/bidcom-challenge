import { PrismaService } from '../prisma/prisma.service';

/**
 * Deletes all records from every model between integration tests.
 * Add new models here as they are created.
 * Call in afterEach to ensure test isolation.
 */
export async function clearDatabase(prisma: PrismaService): Promise<void> {
  await prisma.db.product.deleteMany();
}
