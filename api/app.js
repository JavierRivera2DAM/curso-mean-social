'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//Cargar Rutas

//Middlewares
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Cors

//Rutas

app.get('/', (req, res) => {
    res.status(200).send({
        message: 'Hola Mundo desde el Servidor de NodeJS'
    })
})

app.post('/pruebas', (req, res) => {
    console.log(req.body);
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de Node'
    })
})

//Exportar
module.exports = app;