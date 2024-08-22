const mongoose = require('mongoose');

const schema = mongoose.Schema;

const supplierSchema = new schema({
    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },

}, {
    timestamps: true  // Configuração correta para timestamps
});
module.exports = mongoose.model('Supplier', supplierSchema);