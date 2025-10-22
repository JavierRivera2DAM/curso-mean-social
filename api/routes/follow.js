'use strict'

//Definicion de las variables
var express = require('express');
var FollowController = require('../controllers/follow');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

//Definicion de las rutas
api.get('/pruebas', md_auth.ensureAuth, FollowController.prueba);

//Exportacion de los metodos
module.exports = app;