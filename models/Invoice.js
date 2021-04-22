const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvoiceItemSchema = new Schema({
    productItem: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    productTitle: {
        type: String,
        required: true
    },
    mrp: {
        type: Number,
        required: false
    },
    qty: {
        type: Number,
        required: false
    },
    status: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const InvoiceSchema = new Schema({
    date: {
        type: Date,
        validate: {
            validator: date => date.length > 2,
            message: 'Invalide Date'
        },
        required: [true, 'Title required']
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    type: {
        type: String,
        enum: ['SALE', 'PURCHASE'],
        default: 'SALE'
    },
    total: {
        type: Number
    },
    items: [InvoiceItemSchema]
}, { timestamps: true });

const Invoice = mongoose.model('Invoice', InvoiceSchema);
module.exports = Invoice;