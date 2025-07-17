const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const orders = require('../controllers/orderController.js');
const allTotal = require('../controllers/allTotalController.js'); 
const product = require('../controllers/productController.js');


router.get('/allTotal', allTotal.getAllTotal);
router.delete('/resetOrders', allTotal.resetOrders);

router.get('/allOrders', orders.getAllOrders);
router.post('/createOrder', orders.creteOrder);
router.delete('/deleteOrder/:id', orders.deleteOrder);

router.get('/allProducts', product.getAllProducts);
