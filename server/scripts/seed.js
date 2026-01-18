const prisma = require('../prismaClient');

const DATA_CATEGORIES = [
    { name: 'Appetizers' },
    { name: 'Mains' },
    { name: 'Desserts' },
    { name: 'Beverages' }
];

const DATA_DISHES = [
    { name: 'Truffle Mushroom Burger', price: 88, category: 'Mains', availableTime: 'LUNCH,DINNER' },
    { name: 'Spicy Seafood Pasta', price: 128, category: 'Mains', availableTime: 'DINNER' },
    { name: 'Avocado Toast', price: 58, category: 'Appetizers', availableTime: 'BREAKFAST' },
    { name: 'Chocolate Lava Cake', price: 45, category: 'Desserts', availableTime: 'ALL' },
    { name: 'Matcha Latte', price: 32, category: 'Beverages', availableTime: 'ALL' },
    { name: 'Caesar Salad', price: 48, category: 'Appetizers', availableTime: 'LUNCH' },
    { name: 'Wagyu Beef Steak', price: 288, category: 'Mains', availableTime: 'DINNER' },
    { name: 'Mango Sticky Rice', price: 42, category: 'Desserts', availableTime: 'ALL' },
    { name: 'Iced Americano', price: 28, category: 'Beverages', availableTime: 'ALL' },
    { name: 'Eggs Benedict', price: 68, category: 'Appetizers', availableTime: 'BREAKFAST,LUNCH' }
];

const setup = async () => {
    console.log('🌱 Starting test data setup...');

    const categoryMap = {};

    // Create Categories
    for (const cat of DATA_CATEGORIES) {
        const existing = await prisma.category.findFirst({ where: { name: cat.name } });
        if (existing) {
            categoryMap[cat.name] = existing.id;
        } else {
            const newCat = await prisma.category.create({ data: cat });
            categoryMap[cat.name] = newCat.id;
            console.log(`Created category: ${cat.name}`);
        }
    }

    // Create Dishes
    for (const dish of DATA_DISHES) {
        const existing = await prisma.product.findFirst({ where: { name: dish.name } });
        const imageUrl = `https://loremflickr.com/800/600/food,${encodeURIComponent(dish.name.split(' ')[0])}/all`;

        if (existing) {
            await prisma.product.update({
                where: { id: existing.id },
                data: { imageUrl, availableTime: dish.availableTime, price: dish.price, categoryId: categoryMap[dish.category] }
            });
            console.log(`Updated dish: ${dish.name}`);
        } else {
            await prisma.product.create({
                data: {
                    name: dish.name,
                    description: `Delicious ${dish.name} made with fresh ingredients. A perfect choice for a hungry customer.`,
                    price: dish.price,
                    imageUrl,
                    availableTime: dish.availableTime,
                    categoryId: categoryMap[dish.category]
                }
            });
            console.log(`Created dish: ${dish.name}`);
        }
    }
    console.log('✅ Test data setup completed.');
};

const teardown = async () => {
    console.log('🧹 Cleaning up test data...');

    // Delete Dishes
    for (const dish of DATA_DISHES) {
        // Find existing products with this name
        const products = await prisma.product.findMany({ where: { name: dish.name } });

        for (const p of products) {
            // Delete related OrderItems first to fix foreign key constraint
            const deletedItems = await prisma.orderItem.deleteMany({
                where: { productId: p.id }
            });
            if (deletedItems.count > 0) {
                console.log(`Deleted ${deletedItems.count} order items for dish: ${p.name}`);
            }

            // Then delete the product
            await prisma.product.delete({ where: { id: p.id } });
            console.log(`Deleted dish: ${p.name}`);
        }
    }

    console.log('✅ Test data teardown completed (Categories preserved for safety).');
};

const clear = async () => {
    console.log('⚠️  Clearing ALL database data...');

    // Delete in order to respect foreign keys
    const deletedOrderItems = await prisma.orderItem.deleteMany();
    console.log(`Deleted ${deletedOrderItems.count} order items`);

    const deletedOrders = await prisma.order.deleteMany();
    console.log(`Deleted ${deletedOrders.count} orders`);

    const deletedProducts = await prisma.product.deleteMany();
    console.log(`Deleted ${deletedProducts.count} products`);

    const deletedCategories = await prisma.category.deleteMany();
    console.log(`Deleted ${deletedCategories.count} categories`);

    console.log('✅ Database cleared successfully.');
};

const main = async () => {
    const command = process.argv[2];

    if (command === 'setup') {
        await setup();
    } else if (command === 'teardown') {
        await teardown();
    } else if (command === 'clear') {
        await clear();
    } else {
        console.log('Please specify a command:');
        console.log('  node server/scripts/seed.js setup    -> Insert test data');
        console.log('  node server/scripts/seed.js teardown -> Delete test data (only)');
        console.log('  node server/scripts/seed.js clear    -> Delete ALL data (Warning!)');
    }
};

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
