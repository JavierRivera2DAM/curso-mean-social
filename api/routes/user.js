'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();

//Rutas
api.get('/home', UserController.home);
api.get('/pruebas', UserController.pruebas);

module.exports = api;