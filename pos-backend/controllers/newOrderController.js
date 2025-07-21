const orderModel = require('../models/orderModel.js');
const counter = require('../models/counterModel.js');
const Product = require('../models/productModel.js');


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
        const orderItems = [];

        for(let item of items){
            const { prod_name, quantity } = item;
            const qty =Number(quantity);
            if (!prod_name || isNaN(qty) || qty <= 0){
              return res.status(404).json({ message: 'จำนวนไม่ถูกต้อง'});
            }

            const product = await Product.findOne({ prod_name: prod_name });
            if (!product) {
              return res.status(400).json({ message: `ไม่พบสินค้า: ${prod_name}` });
            }
            
            const subtotal = product.prod_price * qty; 
            total += subtotal;

            orderItems.push({
              id: product._id.toString(),
              name: product.prod_name,
              price: product.prod_price,
              quantity: qty
            });
        }


        const counterValue = await counter.findOneAndUpdate(
            { name: 'order' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );
        
        const newOrder = new orderModel({
            orderNumber: counterValue.value,
            items: orderItems,
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