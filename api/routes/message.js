//02.02.2021
'use strict'
var express = require('express');
var MessageController = require('../controllers/message');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
var multipart = require('connect-multiparty');
var md_upload = multipart({uploadDir:'./uploads/messages'});

api.get('/probando', md_auth.ensureAuth, MessageController.probando);
api.post('/message', md_auth.ensureAuth, MessageController.saveMessage);
api.get('/my-messages/:page?', md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get('/messages/:page?', md_auth.ensureAuth, MessageController.getEmittedMessages);
api.get('/unviewed', md_auth.ensureAuth, MessageController.getUnviewedMessages);
api.get('/check-viewed', md_auth.ensureAuth, MessageController.setViewedMessages); //marcar como vistos todos
api.get('/set-unviewed', md_auth.ensureAuth, MessageController.setAsUnViewedMessages); //marcar como no vistos -- método propio

module.exports = api;
