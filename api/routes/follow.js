'use strict'

//Definicion de las variables
var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//Definicion de las rutas
api.post('/follow', md_auth.ensureAuth, FollowController.saveFollow);
api.delete('/follow/:id', md_auth.ensureAuth, FollowController.deleteFollow);
api.get('/following/', md_auth.ensureAuth, FollowController.getFollowingUsers);   //:id?/page?
api.get('/following/:id', md_auth.ensureAuth, FollowController.getFollowingUsers); 
api.get('/following/:id/:page', md_auth.ensureAuth, FollowController.getFollowingUsers);
api.get('/followed/:id/:page', md_auth.ensureAuth, FollowController.getFollowedUsers);
api.get('/get-my-follows/:followed?', md_auth.ensureAuth, FollowController.getMyFollows);


//Exportacion de los metodos
module.exports = api;