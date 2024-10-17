const Order = require('../models/OrderModel');

module.exports = async () => {
    const orders = [
        {
            user: '60d0fe4f5311236168a109ca', // Replace with actual user ID from your database
            items: [
                {
                    item: '60d0fe4f5311236168a109cb', // Replace with actual item ID from your database
                    quantity: 2,
                    price: 10.0
                },
                {
                    item: '60d0fe4f5311236168a109cc', // Replace with actual item ID from your database
                    quantity: 1,
                    price: 20.0
                }
            ],
            totalPrice: 40.0,
            status: 'Pending'
        },
        {
            user: '60d0fe4f5311236168a109cd', // Replace with actual user ID from your database
            items: [
                {
                    item: '60d0fe4f5311236168a109ce', // Replace with actual item ID from your database
                    quantity: 3,
                    price: 15.0
                }
            ],
            totalPrice: 45.0,
            status: 'Processing'
        }
    ];

    try {
        await Order .deleteMany({});

        await Order.insertMany(orders);
        console.log('Orders seeded successfully');
    } catch (error) {
        console.error('Error seeding orders:', error);
    }
};