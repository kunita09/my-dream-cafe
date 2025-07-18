const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const newOrder = require('../controllers/newOrderController.js');
const orders = require('../controllers/ordersController.js'); 
const product = require('../controllers/productController.js');


router.get('/allTotal', orders.getAllTotal);
router.delete('/resetOrders', orders.resetOrders);

router.patch('/paymentOrder/:id', newOrder.paymentOrder);
router.post('/createNewOrder', newOrder.createOrder);
router.delete('/resetNewOrder/:id', newOrder.resetOrder);

router.get('/allProducts', product.getAllProducts);
router.get('/product/:id', product.getProductById);
router.post('/createProduct', product.createProduct);
router.put('/updateProduct/:id', product.updateProduct);
router.delete('/deleteProduct/:id', product.deleteProduct);


module.exports = router;