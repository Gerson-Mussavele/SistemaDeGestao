const mongoose = require('mongoose');

const schema = mongoose.Schema;

const clienteSchema = new schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
}, {
    timestamps: true  // Configuração correta para timestamps
});

module.exports = mongoose.model('Cliente', clienteSchema);