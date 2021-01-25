//30.12.2020
//BeatrixSwain
'use strict'

var express = require('express');
var UserController = require('../controllers/user');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/users'})

////////////////////////////////////////////////////////////

//api.get('/pruebas', UserController.pruebaGet);
//api.post('/pruebas', UserController.pruebaPost);
api.get('/', UserController.home);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.loginUser);
api.post('/pruebas', md_auth.ensureAuth, UserController.pruebas);//el segundo parámetro es el middleware por el que va  pasar primero.
api.get('/user/:id', md_auth.ensureAuth, UserController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, UserController.getUsers);//? significa que es opcional
api.put('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);//actualizar recursos de la api
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);//actualizar recursos de la api
api.get('/get-image-user/:imageFile', UserController.getImageFile);
api.get('/counters/:id?', [md_auth.ensureAuth, md_upload],UserController.getCounters);


module.exports = api;


