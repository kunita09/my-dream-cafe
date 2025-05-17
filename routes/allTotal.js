const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Orders = require('../models/orderModel.js');
const AllTotal = require('../models/allTotalModel.js'); 
const Counter = require('../models/counter');


router.get('/', async (req, res, next) => {
    try{
        const order = await Orders.find();

        let total = 0
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

    } catch(err){
        next(err)
    }
})

router.delete('/reset', async (req, res, next) => {
    try {
        // ลบออร์เดอร์ทั้งหมด
        await Orders.deleteMany({});

        // รีเซ็ตค่า counter
        await Counter.findOneAndUpdate(
            { name: 'order' },
            { value: 0 },
            { upsert: true, new: true }
        );

        res.json({ message: 'Reset orders and order counter successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;