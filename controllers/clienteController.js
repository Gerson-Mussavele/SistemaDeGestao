const { default: mongoose } = require('mongoose');
const Cliente = require('../models/clienteModel');
const { Vonage } = require('@vonage/server-sdk');

// Configurando o Vonage
const vonage = new Vonage({
    apiKey: "a812fd81",
    apiSecret: "qJWsyQ9SGWzHHNuy"
  })

// Função para obter todos os clientes
const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find({}).sort({ createdAt: -1 });
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para obter um cliente específico
const getCliente = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Cliente not found' });
    }

    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente not found' });
        }
        res.status(200).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para criar um cliente
const createCliente = async (req, res) => {
    const { name, phone, address } = req.body;

    const emptyFields = [];
    if (!name) emptyFields.push('name');
    if (!phone) emptyFields.push('phone');
    if (!address) emptyFields.push('address');

    if (emptyFields.length > 0) {
        return res.status(400).json({ error: 'Please fill in all fields', emptyFields });
    }

    try {
        const cliente = await Cliente.create({ name, phone, address, divida: 0 });
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para atualizar um cliente
const updateCliente = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Cliente not found' });
    }

    try {
        const cliente = await Cliente.findByIdAndUpdate(id, req.body, { new: true });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente not found' });
        }
        res.status(200).json({ message: 'Cliente updated successfully', cliente });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para marcar a dívida como paga
const markAsPaid = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Cliente not found' });
    }

    try {
        const cliente = await Cliente.findByIdAndUpdate(id, { divida: 0 }, { new: true });
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente not found' });
        }
        res.status(200).json({ message: 'Debt marked as paid', cliente });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para enviar um SMS ao cliente
const sendSMS = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Cliente not found' });
    }

    try {
        const cliente = await Cliente.findById(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente not found' });
        }

        const from = 'Vonage';
        const to = cliente.phone;
        const text = 'Hello from Vonage!';

        vonage.sms.send({ to, from, text }, (err, responseData) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to send SMS', details: err });
            }
            res.status(200).json({ message: 'SMS sent successfully', response: responseData });
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Função para deletar um cliente
const deleteCliente = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Cliente not found' });
    }

    try {
        const cliente = await Cliente.findByIdAndDelete(id);
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente not found' });
        }
        res.status(200).json({ message: 'Cliente deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getClientes,
    getCliente,
    createCliente,
    updateCliente,
    deleteCliente,
    markAsPaid,
    sendSMS
};
