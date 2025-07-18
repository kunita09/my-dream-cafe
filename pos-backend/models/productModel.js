const mongoose = require('mongoose');

const ProdustSchema = new mongoose.Schema({
    id: Number,
    prod_name: String,
    prod_price: Number,
    prod_type: {
        type: String,
        enum: ['เครื่องดื่ม', 'ขนม'],
        default: null
    },
    update_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', ProdustSchema)