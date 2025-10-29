'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');
const message = require('../models/message');

//Funcion de prueba para verificar el direccionamiento de rutas
function probando(req, res){
    res.status(200).send({message: 'Hola qué tal desde los Mensajes Privados'});
}

//Creacion del Metodo de Guardado de Mensajes 'saveMessage'

function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver){
        return res.status(200).send({message: 'Envia los datos necesarios'});
    }
    var message = new Message();
    message.emitter = req.user.sub;
    message.receiver = req.receiver;
    message.text = params.text;
    message.created_at = moment().unix();

    message.save((err, messageStored) => {
        if(err){
        return res.status(500).send({message: 'Error en la peticion'});
        }
        if(!messageStored){
        return res.status(500).send({message: 'Error al enviar el mensaje'});    
        }

        return res.status(200).send({message: messageStored});
    });
}

module.exports = {
    probando,
    saveMessage
}