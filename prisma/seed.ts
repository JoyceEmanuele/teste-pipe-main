import { types } from './types';
import { subtypes } from './subtypes';
import { health_indexes } from './health_indexes';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (const index of types) {
    await prisma.notificationTypes.upsert({
      where: { ID: index.ID },
      update: {},
      create: {
        TYPE_NAME: index.TYPE_NAME,
      },
    });
  }
  for (const index of subtypes) {
    await prisma.notificationSubtypes.upsert({
      where: { ID: index.ID },
      update: {},
      create: {
        NOTIFICATION_TYPE_ID: index.NOTIFICATION_TYPE_ID,
        SUBTYPE_NAME: index.SUBTYPE_NAME,
      },
    });
  }
  for (const index of health_indexes) {
    await prisma.notificationMachineHealthIndexes.upsert({
      where: { ID: index.ID },
      update: {},
      create: {
        HEALTH_INDEX_NAME: index.HEALTH_INDEX_NAME,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
