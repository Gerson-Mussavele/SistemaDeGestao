const express = require('express');
const {
    createCliente,
    getClientes,
    getCliente,
    updateCliente,
    deleteCliente,
    markAsPaid,
    sendSMS
} = require('../controllers/clienteController');

const router = express.Router();

// get all clientes
router.get('/', getClientes);

// get a single cliente
router.get('/:id', getCliente);

// create a cliente
router.post('/', createCliente);

// update a cliente
router.patch('/:id', updateCliente);

// delete a cliente
router.delete('/:id', deleteCliente);

// mark debt as paid
router.patch('/:id/paid', markAsPaid);

// send SMS to cliente
router.post('/:id/sendsms', sendSMS);

module.exports = router;
