const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductItemSchema = new Schema({
    title: {
        type: String,
        default: ''
    },
    weight: {
        type: String,
        required: true
    },
    upc: {
        type: Number,
        required: false,
        default: 1
    },
    mrp: {
        type: Number,
        default: 0
    },
    purPrice: {
        type: Number,
        default: 0
    },
    selPrice: {
        type: Number,
        default: 0
    },
    stock: [
        {
            expDate: Date,
            qty: Number
        }
    ],
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

const ProductSchema = new Schema({
    title: {
        type: String,
        validate: {
            validator: title => title.length > 2,
            message: 'Title must be longer than 2 characters.'
        },
        required: [true, 'Title required']
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    items: [ProductItemSchema]
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;