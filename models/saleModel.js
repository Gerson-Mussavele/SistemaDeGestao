const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total: {
        type: Number,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'pos', 'mpesa', 'emola'],
        default: null // Torna o campo opcional e permite null como valor padrão
    },
    date: {
        type: Date,
        required: true
    },
    tableNumber: {
        type: String,
        required: true
    },
    finished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
