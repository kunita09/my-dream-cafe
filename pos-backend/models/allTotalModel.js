const mongoose = require('mongoose');

const AllTotalSchema = new mongoose.Schema({
    create_at: {
        type: Date, default: Date.now
    },
    total: Number,
    totalOrder: Number
})

module.exports = mongoose.model('AllTotal', AllTotalSchema)