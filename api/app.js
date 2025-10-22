'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar Rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/folllow');

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.json());

//Cors

//Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);

//Exportar
module.exports = app;