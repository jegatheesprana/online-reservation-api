const Room = require('../models/Room');

const getAllRooms = (req, res) => {
    Room.find({}, (err, rooms) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rooms);
        }
    });
}

const findOne = (req, res) => {
    const { id } = req.params;
    Room.find({ _id: id }, (err, rooms) => {
        if (err) {
            res.send(err);
        } else {
            res.json(rooms);
        }
    });
}

const reservations = (req, res) => {
    Room.aggregate([{ $unwind: "$reserved" }])
        .then(rooms => {
            res.json(rooms);
        })
        .catch(err => {
            res.send(err)
        });
}

const findRoom = (req, res) => {
    const { roomType, beds, guests, priceRange, from, to } = req.body;
    Room.find({
        type: roomType,
        beds: beds,
        max_occupancy: { $gt: guests },
        cost_per_night: { $gte: priceRange.lower, $lte: priceRange.upper },
        reserved: {

            //Check if any of the dates the room has been reserved for overlap with the requsted dates
            $not: {
                $elemMatch: { from: { $lt: to.substring(0, 10) }, to: { $gt: from.substring(0, 10) } }
            }

        }
    }, function (err, rooms) {
        if (err) {
            res.send(err);
        } else {
            res.json(rooms);
        }
    });
}

const reserveRoom = (req, res) => {
    const { _id, from, to } = req.body;
    console.log(_id);

    Room.findByIdAndUpdate(_id, {
        $push: { "reserved": { from, to } }
    }, {
        safe: true,
        new: true
    }, function (err, room) {
        if (err) {
            res.send(err);
        } else {
            res.json(room);
        }
    });
}

const createRoom = (req, res) => {
    const { title, number, type, beds, maxOccupancy, costPerNight } = req.body;
    const room = new Room({
        title, number, type, beds, maxOccupancy, costPerNight, reserved: []
    })
    room.save()
        .then(room => {
            res.send(room)
        })
        .catch(console.log);
}

const updateRoom = (req, res) => {
    const { title, number, type, beds, maxOccupancy, costPerNight } = req.body;
    Room.updateOne({ _id }, { title, number, type, beds, maxOccupancy, costPerNight })
        .then(room => {
            res.send(room)
        })
        .catch(console.log);
}

const deleteRoom = (req, res) => {
    Room.remove({ _id: req.body._id }).then(result => {
        res.send(result)
    })
}

module.exports = {
    getAllRooms,
    findOne,
    reservations,
    findRoom,
    reserveRoom,
    createRoom,
    updateRoom,
    deleteRoom
}