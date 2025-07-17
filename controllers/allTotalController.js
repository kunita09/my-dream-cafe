const orders = require('../models/orderModel.js');
const product = require('../models/productModel.js');

exports.getAllTotal = async (req, res, next) => {
    try {
        const order = await orders.find();

        let total = 0;
        order.forEach(order => {
            if (order.priceTotal) {
                total += order.priceTotal;
            }
        });

        await AllTotal.findOneAndUpdate(
            {},                        
            { total: total },       
            { upsert: true, new: true }
        );

        res.json({
            orders: order,
            totalAllDay: total,
            currency: 'THB'
        });

    } catch (err) {
        next(err);
    }
}

exports.resetOrders = async (req, res, next) => {
    try {
        // Delete all orders
        await orders.deleteMany({});

        // Reset the counter
        await Counter.findOneAndUpdate(
            { name: 'order' },
            { value: 0 },
            { upsert: true, new: true }
        );

        res.json({ message: 'Reset orders and order counter successfully' });
    } catch (err) {
        next(err);
    }
}