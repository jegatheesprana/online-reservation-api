const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    beds: {
        type: Number,
        required: false
    },
    maxOccupancy: {
        type: Number,
        required: false
    },
    costPerNight: {
        type: String,
        required: false
    },
    reserved: {
        type: [
            {
                from: String,
                to: String
            }
        ],
        required: false,
        default: []
    }
}, { timestamps: true });

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;