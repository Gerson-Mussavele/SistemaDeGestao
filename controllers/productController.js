const {default: mongoose} = require('mongoose');   
const Product = require('../models/productModel');
const Supplier = require('../models/supplierModel');

//get all products
const getProducts = async (req, res) => {
    const products = await Product.find({}).sort({createdAt: -1}).populate('supplier');
    res.status(200).json(products);
}

//get a single product
const getProduct = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Product not found'});
    }

    const product = await Product.findById(id).populate('supplier');
    

    if(!product){
        return res.status(404).json({message: 'Product not found'});
    }

    return res.status(200).json(product);
}


//create a product
const createProduct = async (req, res) => {
    const {name, description, price, stockQuantity, category, image, supplier: supplierData} = req.body;
    const {name: supplierName, phone: supplierPhone} = supplierData;

    let emptyFields = [];

    if(!name){
        emptyFields.push('name');
    }
    if(!description){
        emptyFields.push('description');
    }
    if(!price){
        emptyFields.push('price');
    }
    if(!stockQuantity){
        emptyFields.push('stockQuantity');
    }
    if(!category){
        emptyFields.push('category');
    }
    if(!supplierName){
        emptyFields.push('supplier.name');
    }
    if(!supplierPhone){
        emptyFields.push('supplier.phone');
    }

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all fields', emptyFields});
    }

    try {
        // Busca o fornecedor pelo nome e telefone
        let supplier = await Supplier.findOne({name: supplierName, phone: supplierPhone});

        // Se o fornecedor não existir, você pode escolher criá-lo
        if(!supplier) {
            supplier = await Supplier.create({name: supplierName, phone: supplierPhone});
        }

        // Cria o produto com a referência ao fornecedor
        const product = await Product.create({
            name, description, price, stockQuantity, category, image, supplier: supplier._id
        });

        res.status(200).json(product);
    } catch(error) {
        res.status(400).json({error: 'Error creating product', details: error.message});
    }
};


// delete a product
const deleteProduct = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Product not found'});
    }

    const product = await Product.findByIdAndDelete(id);

    if(!product){
        return res.status(404).json({error: 'Product not found'});
    }
    
    res.status(200).json(product);
};

// update a product
const updateProduct = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Product not found'});
    }

    const product = await Product.findByIdAndUpdate({_id: id}, {
        ...req.body
    })
    if(!product){
        return res.status(400).json({error: 'Product not found'});
    }

    res.status(200).json(product);

};

module.exports = {getProducts, getProduct, createProduct, updateProduct, deleteProduct};