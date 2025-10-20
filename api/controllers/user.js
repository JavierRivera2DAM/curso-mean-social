'use strict'

var User = require('../models/user');

function home (req, res){
    res.status(200).send({
        message: 'Hola Mundo desde el Servidor de NodeJS'
    });
}

function pruebas (req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de Node'
    });
}

module.exports = {
    home,
    pruebas
}