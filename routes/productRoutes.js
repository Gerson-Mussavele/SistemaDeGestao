const express = require('express');

const{
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

// get all products
router.get('/', getProducts);

// get a single product
router.get('/:id', getProduct);

// create a product
router.post('/', createProduct);

// update a product
router.put('/:id', updateProduct);

// delete a product
router.delete('/:id', deleteProduct);

module.exports = router;