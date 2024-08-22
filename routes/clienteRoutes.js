const express = require('express');
const {
    createCliente,
    getClientes,
    getCliente,
    updateCliente,
    deleteCliente
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

module.exports = router;