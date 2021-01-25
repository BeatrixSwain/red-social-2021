//05.01.2020
//BeatrixSwain

'use strict'

var express = require('express');
var followController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');
////////////////////////////////////////////////////////////////////////////////////////////////////////

api.get('/pruebas', md_auth.ensureAuth, followController.prueba);
api.post('/follow', md_auth.ensureAuth, followController.saveFollow);
api.delete('/delete/:id', md_auth.ensureAuth, followController.deleteFollow);
api.get('/following/:id?/:page?', md_auth.ensureAuth, followController.getFollowingUsers);
api.get('/followers/:id?/:page?', md_auth.ensureAuth, followController.getFollowers);
api.get('/myfollows', md_auth.ensureAuth, followController.getMyFollows);
api.get('/followback', md_auth.ensureAuth, followController.getFollowBacks);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, followController.listMyFollows);




module.exports = api;