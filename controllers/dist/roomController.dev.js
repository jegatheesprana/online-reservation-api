"use strict";

var Room = require('../models/Room');

var getAllRooms = function getAllRooms(req, res) {
  Room.find({}, function (err, rooms) {
    if (err) {
      res.send(err);
    } else {
      res.json(rooms);
    }
  });
};

var findOne = function findOne(req, res) {
  var id = req.params.id;
  Room.find({
    _id: id
  }, function (err, rooms) {
    if (err) {
      res.send(err);
    } else {
      res.json(rooms);
    }
  });
};

var reservations = function reservations(req, res) {
  Room.aggregate([{
    $unwind: "$reserved"
  }]).then(function (rooms) {
    res.json(rooms);
  })["catch"](function (err) {
    res.send(err);
  });
};

var findRoom = function findRoom(req, res) {
  var _req$body = req.body,
      roomType = _req$body.roomType,
      beds = _req$body.beds,
      guests = _req$body.guests,
      priceRange = _req$body.priceRange,
      from = _req$body.from,
      to = _req$body.to;
  Room.find({
    type: roomType,
    beds: beds,
    max_occupancy: {
      $gt: guests
    },
    cost_per_night: {
      $gte: priceRange.lower,
      $lte: priceRange.upper
    },
    reserved: {
      //Check if any of the dates the room has been reserved for overlap with the requsted dates
      $not: {
        $elemMatch: {
          from: {
            $lt: to.substring(0, 10)
          },
          to: {
            $gt: from.substring(0, 10)
          }
        }
      }
    }
  }, function (err, rooms) {
    if (err) {
      res.send(err);
    } else {
      res.json(rooms);
    }
  });
};

var reserveRoom = function reserveRoom(req, res) {
  var _req$body2 = req.body,
      _id = _req$body2._id,
      from = _req$body2.from,
      to = _req$body2.to;
  console.log(_id);
  Room.findByIdAndUpdate(_id, {
    $push: {
      "reserved": {
        from: from,
        to: to
      }
    }
  }, {
    safe: true,
    "new": true
  }, function (err, room) {
    if (err) {
      res.send(err);
    } else {
      res.json(room);
    }
  });
};

var createRoom = function createRoom(req, res) {
  var _req$body3 = req.body,
      title = _req$body3.title,
      number = _req$body3.number,
      type = _req$body3.type,
      beds = _req$body3.beds,
      maxOccupancy = _req$body3.maxOccupancy,
      costPerNight = _req$body3.costPerNight;
  var room = new Room({
    title: title,
    number: number,
    type: type,
    beds: beds,
    maxOccupancy: maxOccupancy,
    costPerNight: costPerNight,
    reserved: []
  });
  room.save().then(function (room) {
    res.send(room);
  })["catch"](console.log);
};

var updateRoom = function updateRoom(req, res) {
  var _req$body4 = req.body,
      title = _req$body4.title,
      number = _req$body4.number,
      type = _req$body4.type,
      beds = _req$body4.beds,
      maxOccupancy = _req$body4.maxOccupancy,
      costPerNight = _req$body4.costPerNight;
  Room.updateOne({
    _id: _id
  }, {
    title: title,
    number: number,
    type: type,
    beds: beds,
    maxOccupancy: maxOccupancy,
    costPerNight: costPerNight
  }).then(function (room) {
    res.send(room);
  })["catch"](console.log);
};

var deleteRoom = function deleteRoom(req, res) {
  Room.remove({
    _id: req.body._id
  }).then(function (result) {
    res.send(result);
  });
};

module.exports = {
  getAllRooms: getAllRooms,
  findOne: findOne,
  reservations: reservations,
  findRoom: findRoom,
  reserveRoom: reserveRoom,
  createRoom: createRoom,
  updateRoom: updateRoom,
  deleteRoom: deleteRoom
};