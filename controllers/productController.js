const mongoose = require('mongoose');
const Product = require('../models/productModel');
const Supplier = require('../models/supplierModel');

// Obter todos os produtos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).populate('supplier');
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products' });
    }
}

// Obter um produto específico
const getProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.findById(id).populate('supplier');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product' });
    }
}

// Criar um produto
const createProduct = async (req, res) => {
    const { name, description, price, stockQuantity, category, image, supplier: supplierData } = req.body;
    const { name: supplierName, phone: supplierPhone } = supplierData;

    let emptyFields = [];
    if (!name) emptyFields.push('name');
    if (!description) emptyFields.push('description');
    if (!price) emptyFields.push('price');
    if (!stockQuantity) emptyFields.push('stockQuantity');
    if (!category) emptyFields.push('category');
    if (!supplierName) emptyFields.push('supplier.name');
    if (!supplierPhone) emptyFields.push('supplier.phone');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    try {
        let supplier = await Supplier.findOne({ name: supplierName, phone: supplierPhone });
        if (!supplier) {
            supplier = await Supplier.create({ name: supplierName, phone: supplierPhone });
        }

        const product = await Product.create({
            name, description, price, stockQuantity, category, image, supplier: supplier._id
        });

        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ error: 'Error creating product', details: error.message });
    }
}

// Deletar um produto
const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product' });
    }
}

// Atualizar um produto
const updateProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Product not found' });
    }

    try {
        const product = await Product.findByIdAndUpdate(id, { ...req.body }, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
}

// Obter produtos com estoque crítico
const getCriticalStockProducts = async (req, res) => {
    try {
        const criticalStockProducts = await Product.find({ stockQuantity: { $lte: 10 } });
        res.status(200).json(criticalStockProducts);
    } catch (error) {
        console.error('Error fetching critical stock products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, getCriticalStockProducts };
