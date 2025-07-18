const orderModel = require('../models/orderModel.js');
const counter = require('../models/counterModel.js');


exports.paymentOrder = async (req, res, next) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const money = req.body.money;
    const priceTotal = order.priceTotal;

    if (money < priceTotal) {
      return res.status(400).json({ message: 'เงินไม่พอชำระ' });
    }

    const change = money - priceTotal;

    order.status = 'ชำระแล้ว';
    order.paidAmount = money;
    order.change = change;

    const updatedOrder = await order.save();

    res.json({
      message: 'ชำระเงินเรียบร้อย',
      total: priceTotal,
      paid: money,
      change: change,
      currency: 'THB',
      order: updatedOrder
    });
  } catch (err) {
    next(err);
  }
};


exports.createOrder = async (req, res, next) => {
    try {
        const items = req.body.items;

        let total = 0;
        for(let item of items){
            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (isNaN(price) || isNaN(quantity)) {
                return res.status(400).json({ message: 'Invalid price or quantity', item });
            }

            total += price * quantity;
        }
        const counterValue = await counter.findOneAndUpdate(
            { name: 'order' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        const newOrder = new orderModel({
            orderNumber: counterValue.value,
            items: items,
            priceTotal: total,
            status: 'ยังไม่ได้ชำระเงิน',
            create_at: new Date()
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        next(err);
    }
}

exports.resetOrder = async (req, res, next) => {
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.id,
      {
        items: [],
        priceTotal: null,
        status: null,
        orderNumber: null,
        change: null,
        paidAmount: null,
        create_at: null
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order reset successfully', order: updatedOrder });
  } catch (err) {
    next(err);
  }
};