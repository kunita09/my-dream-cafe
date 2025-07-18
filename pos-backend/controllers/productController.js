const productModel = require('../models/productModel.js');
const counterModel = require('../models/counterModel.js');


exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await productModel.find();
        if (!products) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(products);
    } catch (err) {
        next(err);
    }
}

exports.getProductById = async (req, res, next) => {
    try {
        const productItem = await productModel.findById(req.params.id);
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
        const count = await counterModel.findOneAndUpdate(
            { name: 'product' },
            { $inc: { value: 1 } },
            { new: true, upsert: true }
        );

        // สร้าง product ใหม่โดยใช้ id จาก counter
        const newProduct = await productModel.create({
            id: count.value,
            prod_name: req.body.prod_name,
            prod_price: req.body.prod_price,
            prod_type: req.body.prod_type
        });

        const products = await productModel.find();

        res.json(products);
    } catch (err) {
        next(err);
    }
}

exports.updateProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await productModel.findByIdAndUpdate(id, req.body);
        const updatedProducts = await productModel.find();
        res.json(updatedProducts);
    } catch (err) {
        next(err);
    }
}

exports.deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    try {
        await productModel.findByIdAndDelete(id);
        const updatedProducts = await productModel.find();
        res.json(updatedProducts);
    } catch (err) {
        next(err);
    }
}