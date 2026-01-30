const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
        console.error('ADMIN_USERNAME and ADMIN_PASSWORD are required');
        process.exit(1);
    }

    const existing = await prisma.adminUser.findUnique({ where: { username } });
    if (existing) {
        console.log('Admin already exists');
        return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.adminUser.create({
        data: { username, passwordHash }
    });

    console.log('Admin created');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
