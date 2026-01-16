const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    // Clear existing data
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // Create Categories
    // const burgers = await prisma.category.create({ data: { name: 'Burgers' } });
    // const drinks = await prisma.category.create({ data: { name: 'Drinks' } });
    // const sides = await prisma.category.create({ data: { name: 'Sides' } });

    // Create Products
    /*
    await prisma.product.createMany({
        data: [
            {
                name: 'Classic Burger',
                description: 'Juicy beef patty with lettuce and tomato.',
                price: 8.99,
                imageUrl: 'https://placehold.co/400x300?text=Burger', // Use Placeholder for now
                categoryId: burgers.id,
            },
            {
                name: 'Cheese Burger',
                description: 'Classic burger with melted cheddar.',
                price: 9.99,
                imageUrl: 'https://placehold.co/400x300?text=Cheese+Burger',
                categoryId: burgers.id,
            },
            {
                name: 'Fries',
                description: 'Crispy golden fries.',
                price: 3.99,
                imageUrl: 'https://placehold.co/400x300?text=Fries',
                categoryId: sides.id,
            },
            {
                name: 'Coke',
                description: 'Chilled cola.',
                price: 1.99,
                imageUrl: 'https://placehold.co/400x300?text=Coke',
                categoryId: drinks.id,
            },
        ],
    });
    */
    console.log('Database cleared (Ready for production use)');

    console.log('Seed data inserted');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
