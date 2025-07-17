const product = require('../models/productModel.js');

exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await product.find();
        res.json(products);
    } catch (err) {
        next(err);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const productItem = await product.findById(req.params.id);
        if (!productItem) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(productItem);
    } catch (err) {
        next(err);
    }
}

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = await product.create(req.body);
        res.json(newProduct);
    } catch (err) {
        next(err);
    }
}

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await product.findByIdAndUpdate(id, req.body);
        const updatedProducts = await product.find();
        res.json(updatedProducts);
    } catch (err) {
        next(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await product.findByIdAndDelete(id);
        const updatedProducts = await product.find();
        res.json(updatedProducts);
    } catch (err) {
        next(err);
    }
}