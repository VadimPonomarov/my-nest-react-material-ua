import { PrismaClient } from '@prisma/client';
import { RoleEnum } from '../../src/common/constants';
import { userAdminData, _truckList } from './data';

const prisma = new PrismaClient();

async function main() {
  try {
    await console.log(`Start seeding ...`);
    const isExist = await prisma.user.findFirst({ where: { name: 'admin' } });
    if (!isExist) {
      /*user*/
      const user = await prisma.user.create({
        data: {
          ...userAdminData,
          roles: { create: { name: RoleEnum.ADMIN } },
        },
      });
      await console.log(`User ${user.name} with id: ${user.id} is created`);
    };
    /*trackList*/
    const isTruckListExist = await prisma.truck.findMany();
    if (isTruckListExist.length){
      const _trucksMapped = await _truckList();
      await prisma.truck.createMany({
        data: _trucksMapped,
        skipDuplicates: true,
      });
      console.log(_trucksMapped);
      console.log(
          `Scraping process is finished and initial truckList is created`,
      );
    }
    console.log(`Seeding has finished.`);
  } catch (e) {
    console.log(e);
  }
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
