const { default: mongoose } = require('mongoose');
const Sale = require('../models/saleModel');
const Product = require('../models/productModel');

// Obter todas as vendas
const getSales = async (req, res) => {
    try {
        const sales = await Sale.find({}).sort({ createdAt: -1 });
        res.status(200).json(sales);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obter uma venda específica
const getSale = async (req, res) => {
    try {
        const { id } = req.params;

        // Validar se o ID é um ObjectId válido do MongoDB
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Sale ID' });
        }

        const sale = await Sale.findById(id);

        // Verificar se a venda foi encontrada
        if (!sale) {
            return res.status(404).json({ error: 'Sale not found' });
        }

        res.status(200).json(sale);
    } catch (error) {
        console.error('Error in getSale:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


// Criar uma nova venda
const createSale = async (req, res) => {
    const { products, total, paymentMethod, date, tableNumber } = req.body;

    let emptyFields = [];

    if (!products || !Array.isArray(products) || products.length === 0) {
        emptyFields.push('products');
    }

    if (typeof total !== 'number' || total <= 0) {
        emptyFields.push('total');
    }

    if (isNaN(Date.parse(date))) {
        emptyFields.push('date');
    }

    if (!tableNumber || tableNumber.trim() === '') {
        emptyFields.push('tableNumber');
    }

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const productValidationPromises = products.map(async (item) => {
            if (!item.productId || !item.quantity) {
                throw new Error(`Product ID or quantity missing in item: ${JSON.stringify(item)}`);
            }
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            if (product.stockQuantity < item.quantity) {
                throw new Error(`Not enough stock for product with ID ${item.productId}`);
            }
            product.stockQuantity -= item.quantity;
            await product.save({ session });
            return product;
        });

        await Promise.all(productValidationPromises);

        const sale = await Sale.create([{ products, total, paymentMethod: paymentMethod || null, date, tableNumber }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(sale);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};

// Finalizar uma venda
const finalizeSale = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Sale not found' });
    }

    const { paymentMethod } = req.body;

    if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required to finalize the sale' });
    }

    try {
        const sale = await Sale.findByIdAndUpdate(id, { finished: true, paymentMethod }, { new: true });
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json(sale);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Atualizar uma venda
const updateSale = async (req, res) => {
    const { id } = req.params;
    const { products, total } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Sale not found' });
    }

    if (!products || !Array.isArray(products)) {
        return res.status(400).json({ message: 'Invalid products data' });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Atualizar estoque dos produtos existentes
        const sale = await Sale.findById(id).session(session);
        if (!sale) {
            throw new Error('Sale not found');
        }

        // Verificar e ajustar o estoque dos produtos
        const productValidationPromises = products.map(async (item) => {
            if (!item.productId || !item.quantity) {
                throw new Error(`Product ID or quantity missing in item: ${JSON.stringify(item)}`);
            }
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            // Ajustar o estoque do produto, baseado nas diferenças
            const existingProduct = sale.products.find(p => p.productId.equals(item.productId));
            if (existingProduct) {
                product.stockQuantity += existingProduct.quantity - item.quantity;
            } else {
                product.stockQuantity -= item.quantity;
            }
            if (product.stockQuantity < 0) {
                throw new Error(`Not enough stock for product with ID ${item.productId}`);
            }
            await product.save({ session });
            return product;
        });

        await Promise.all(productValidationPromises);

        // Atualizar a venda
        sale.products = products;
        sale.total = total;
        await sale.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.status(200).json(sale);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(500).json({ error: error.message });
    }
};


// Deletar uma venda
const deleteSale = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Sale not found' });
    }

    try {
        const sale = await Sale.findByIdAndDelete(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(200).json({ message: 'Sale deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getSales, getSale, createSale, updateSale, deleteSale, finalizeSale };
