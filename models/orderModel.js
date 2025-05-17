const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderNumber: Number,
    items: [{
        product: { type: mongoose.Schema.Types.ObjectId,ref: 'Product'},
        quantity: Number,
        option: {
        type: String,
        enum: ['Hot', 'Iced', 'Frappe']
        } 
    }],
    status: {
        type: String,
        enum: ['Paid', 'Not yet Paid'],
        default: 'Not yet Paid'
    },
    create_at: {
        type: Date, default: Date.now
    }
})

module.exports = mongoose.model('Order', OrderSchema)