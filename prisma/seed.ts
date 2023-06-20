import { PrismaClient } from "@prisma/client";
import {
  ADMIN_ROLE_PERMISSIONS,
  BASIC_ROLE_PERMISSIONS,
  ROLE_PERMISSIONS,
} from "@/lib/utils/system";

const prisma = new PrismaClient();

async function seed() {
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();
  await prisma.userTenant.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.product.deleteMany();
  await prisma.subscription.deleteMany();

  await Promise.all(
    ROLE_PERMISSIONS.map(async (permissionName) => {
      const promise = await prisma.permission.create({
        data: {
          name: permissionName,
        },
      });
      return promise;
    })
  );

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
