const mongoose = require('mongoose');

const ProdustSchema = new mongoose.Schema({
    prod_name: String,
    prod_price: Number,
    prod_desc: String,
    update_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Product', ProdustSchema)