const express = require('express');

const{
    createSale,
    getSales,
    getSale,
    updateSale,
    deleteSale,
    finalizeSale
} = require('../controllers/saleController');

const router = express.Router();

// get all sales
router.get('/', getSales);

// get a single sale
router.get('/:id', getSale);

// create a sale
router.post('/', createSale);

// update a sale
router.put('/:id', updateSale);

// delete a sale
router.delete('/:id', deleteSale);

// finalize a sale
router.patch('/finalize/:id', finalizeSale);

module.exports = router;