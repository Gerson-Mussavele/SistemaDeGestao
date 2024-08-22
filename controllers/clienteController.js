const {default: mongoose} = require('mongoose');
const Cliente = require('../models/clienteModel');

//get all clientes
const getClientes = async (req, res) => {
    const clientes = await Cliente.find({}).sort({createdAt: -1});
    res.status(200).json(clientes);
};

//get a single cliente
const getCliente = async (req, res ) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Cliente not found'});
    }

    const cliente = await Cliente.findById(id);

    if(!cliente){
        return res.status(404).json({message: 'Cliente not found'});
    }

    res.status(200).json(cliente);

};

//create a cliente

const createCliente = async (req, res) => {
    const {name, phone, address} = req.body;

    let emptyFields = [];

    if(!name){
        emptyFields.push('name');
    }

    if(!phone){
        emptyFields.push('phone');
    }

    if(!address){
        emptyFields.push('address');
    }

    if(emptyFields.length > 0){
        return res.status(400).json({error: 'Please fill in all fields', emptyFields});
    }

    try{
        const cliente = await Cliente.create({name, phone, address});
        res.status(201).json(cliente);
    } catch(error){
        res.status(500).json({error: 'Internal server error'});
    }
};

//update a cliente
const updateCliente = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Cliente not found'});
    }

    const cliente = await Cliente.findByIdAndUpdate({_id: id},{
        ...req.body
    
    })
    if(!cliente){
        return res.status(404).json({message: 'Cliente not found'});
    }

    res.status(200).json({message: 'Cliente updated successfully'});
   
};

//delete a cliente

const deleteCliente = async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({message: 'Cliente not found'});
    }

    const cliente = await Cliente.findByIdAndDelete(id);

    if(!cliente){
        return res.status(404).json({message: 'Cliente not found'});
    }

    res.status(200).json({message: 'Cliente deleted successfully'});
}

module.exports = {getClientes, getCliente, createCliente, updateCliente, deleteCliente};