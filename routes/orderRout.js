const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Orders = require('../models/orderModel.js')
const Counter = require('../models/counter.js');


router.post('/', async (req, res, next) => {
    try{
        const counter = await Counter.findOneAndUpdate(
            { name: 'order' },
            { $inc: {value: 1} },
            { new : true, upsert: true }
        );

       const newOrder = new Orders({
        orderNumber: counter.value,
        items: req.body.items,
        status: 'Not yet Paid',
        create_at: new Date()
       });
        const saveOrder = await newOrder.save();
        res.json(saveOrder);
    } catch (err) {
        next(err);
    }
})

router.get('/', async (req, res, next) => {
    try{
        const allOrders = await Orders.find().populate('items.product','prod_name prod_price');
        res.json(allOrders);
    }catch (err){
        next(err);
    }
})

router.patch('/:id', async (req, res, next) => { //add order
    try{
        const addProduct = await Orders.findByIdAndUpdate(
            req.params.id,
            { $push: { items: req.body.items } },
            { new: true }
        );
        res.json(addProduct);
    } catch (err) {
        next(err)
    }
})

router.put('/:id' , async (req, res, next) => {
    try{
        await Orders.findByIdAndUpdate(req.params.id, req.body)
        const editOrder = await Orders.findById(req.params.id).populate('items.product','prod_name prod_price');
        res.json(editOrder)
    } catch(err) {
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try{
        await Orders.findByIdAndDelete(req.params.id, res.body);
        res.json({
            message : "ลบออร์เดอร์สำเร็จ"
        })
    } catch (err) {
        next(err);
    }
})

module.exports = router;