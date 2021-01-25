//30.12.2020
//BeatrixSwain
'use strict'
var express = require('express');
var UserController = require('../controllers/pruebas');
var api = express.Router();
////////////////////////////////////////////////////////////

api.get('/pruebas', UserController.pruebaGet);
api.post('/pruebas', UserController.pruebaPost);
api.get('/', UserController.home);


module.exports = api;

