const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BranchSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    num: {
        type: Number,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    postal: {
        type: Number,
        required: false
    },
    supplier: {
        type: String,
        required: false
    },
    rep: {
        type: String,
        required: false
    },
    repNum: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Branch = mongoose.model('Branch', BranchSchema);
module.exports = Branch;