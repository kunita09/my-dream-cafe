const orderModel = require('../models/orderModel.js');
const productModel = require('../models/productModel.js');
const Counter = require('../models/counterModel.js');

exports.getAllTotal = async (req, res, next) => {
    try {
        const orders = await orderModel.find();

        let total = 0;
        orders.forEach(order => {
            if (order.priceTotal) {
                total += order.priceTotal;
            }
        });

        res.json({
            orders: orders,
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
        await orderModel.deleteMany({});

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