const order = require('../models/orderModel.js');
const counter = require('../models/counterModel.js');

exports.getAllOrders = async (req, res, next) => {
    try {
        const allOrders = await order.find().populate('items.product', 'prod_name prod_price');
        res.json(allOrders);
    } catch (err) {
        next(err);
    }
}


exports.creteOrder = async (req, res, next) => {
    try {
        const counterValue = await counter.findOneAndUpdate(
            { name: 'order' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const newOrder = new order({
            orderNumber: counterValue.value,
            items: req.body.items,
            status: 'Paid',
            create_at: new Date()
        });

        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (err) {
        next(err);
    }
}

exports.deleteOrder = async (req, res, next) => {
    try {
        const deletedOrder = await order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        next(err);
    }
}