const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: Number,
    items: [
        {
            id: Number,
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    priceTotal: { type: Number, default: null },
    paidAmount: { type: Number, default: null },
    change: { type: Number, default: null },
    status: { type: String, default: null },
    create_at: { type: Date, default: null }
})

module.exports = mongoose.model('order', OrderSchema)