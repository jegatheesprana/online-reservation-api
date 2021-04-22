"use strict";

var express = require('express');

var router = express.Router();

var roomController = require('../controllers/roomController');

router.get('/', roomController.getAllRooms);
router.get('/findOne/:id', roomController.findOne);
router.get('/reservations', roomController.reservations);
router.get('/filter', roomController.findRoom);
router.post('/reserve', roomController.reserveRoom);
router.post('/newRoom', roomController.createRoom);
router.put('/updateRoom', roomController.updateRoom);
router["delete"]('/updateRoom', roomController.updateRoom);
module.exports = router;