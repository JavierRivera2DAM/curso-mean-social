'use strict'

var express = require('express');
//var bodyParser = require('body-parser');

var app = express();
app.use(express.json());

//Cargar Rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');

//Middlewares

//app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({extended:false}));

//Cors

//Rutas
app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);

//Exportar
module.exports = app;