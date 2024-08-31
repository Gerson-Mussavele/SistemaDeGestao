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
    divida: {
        type: Number,
        default: 0  // Initialize divida to 0
    }
}, {
    timestamps: true  // Correct configuration for timestamps
});

module.exports = mongoose.model('Cliente', clienteSchema);
