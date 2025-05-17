const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/productModel.js'); 

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
})

router.get('/:id', async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        res.json(product);
    } catch (err) {
        next(err);
    }
})

// POST new product
router.post('/', async (req, res, next) => {
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        const allProduct = await Product.find();
        res.json(allProduct);
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        const allProduct = await Product.find();
        res.json(allProduct);
    } catch (err) {
        next(err);
    }
})



module.exports = router;