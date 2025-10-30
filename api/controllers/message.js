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
//Modificación de la función por Asíncrona para enviar el deprecado de callbacks de Mongoose actualizado

async function saveMessage(req, res){    
    const params = req.body;
    if(!req.body){
    return res.status(400).send({message: 'No se recibió cuerpo en la solicitud'});
    }

    if(!params.text || !params.receiver){
        return res.status(400).send({message: 'Envia los datos necesarios'});
    }
    try{
    const message = new Message();
    message.text = params.text;
    message.emitter = req.user.sub;
    message.receiver = params.receiver;
    
    message.created_at = moment().unix();

    message.viewed = 'false';
    
    const messageStored = await message.save();
        
    if(!messageStored){
        return res.status(500).send({message: 'Error al enviar el mensaje'});    
    }

    return res.status(200).send({message: messageStored});
    
    }
    
    catch(err){
        return res.status(500).send({message: 'Error en la peticion', error: err.message});
    }
}

//Creacion del Metodo de Devolucion de los Mensajes Recibidos por un Usuario
//Conversion a Funcion Asincrona y uso de 'await' para evitar deprecado de Mongoose

async function getReceivedMessages(req, res){
    let page = parseInt(req.params.page) || 1;
    const itemsPerPage = 4;
    var userId = req.user.sub;    
    
    if(req.params.page){
       page = req.params.page;
    }
    
    try{
    var messages = await Message.find({receiver: userId}).populate('emitter', 'name surname image nick  _id') //.paginate(page, itemsPerPage, (err, messages, total) => {
    
    var total = await Message.countDocuments({ receiver: userId});
        
        if(!messages || messages.length === 0){
            return res.status(404).send({message: 'No hay mensajes'});
        }
        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    }    
    catch(err){
        return res.status(500).send({message: 'Error en la peticion', error: err.message});
    }
}

//Creacion de Método que devuelva los Mensajes Enviados por un Usuario

async function getEmmitMessages(req, res){
    let page = parseInt(req.params.page) || 1;
    const itemsPerPage = 4;
    var userId = req.user.sub;    
    
    if(req.params.page){
       page = req.params.page;
    }
    
    try{
    var messages = await Message.find({emitter: userId}).populate('emitter receiver', 'name surname image nick  _id') //.paginate(page, itemsPerPage, (err, messages, total) => {
    
    var total = await Message.countDocuments({ emitter: userId});
        
        if(!messages || messages.length === 0){
            return res.status(404).send({message: 'No hay mensajes'});
        }
        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            messages
        });
    }    
    catch(err){
        return res.status(500).send({message: 'Error en la peticion', error: err.message});
    }

}

//Creación de Método que cuenta los Mensajes No Vistos
//Modificado a Asíncrono para evitar Deprecado de Callbacks

async function getUnviewedMessages(req, res){
    var userId = req.user.sub;
    try{
        const unviewedMessage = await Message.countDocuments({receiver:userId, viewed: 'false'});
        
            return res.status(200).send({
                //'unviewed': count
                'unviewed': unviewedMessage
            });
    }

    catch(err){
        return res.status(500).send({message: 'Error en la Peticion', error: err.message});
    }
}

//Creado Método que se encarga de ajustar o asignar valor de 'leído' o 'no leído'
//Modificado a Asíncrono para evitar Deprecado de Callbacks

async function setViewedMessages(req, res){
    var userId = req.user.sub;
    try{

    const messagesUpdated = await Message.updateOne({receiver:userId, viewed: 'false'}, {viewed: 'true'}, {multi: 'true'}); 
    return res.status(200).send({
        messages: messagesUpdated
    });        
    }
    catch(err){
        return res.status(500).send({message: 'Error en la Peticion', error: err.message});
    }
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmmitMessages,
    getUnviewedMessages,
    setViewedMessages
}

// function saveMessage(req, res){
//     var params = req.body;

//     if(!params.text || !params.receiver){
//         return res.status(200).send({message: 'Envia los datos necesarios'});
//     }
//     var message = new Message();
//     message.emitter = req.user.sub;
//     message.receiver = req.receiver;
//     message.text = params.text;
//     message.created_at = moment().unix();

//     message.save((err, messageStored) => {
//         if(err){
//         return res.status(500).send({message: 'Error en la peticion'});
//         }
//         if(!messageStored){
//         return res.status(500).send({message: 'Error al enviar el mensaje'});    
//         }

//         return res.status(200).send({message: messageStored});
//     });
// }

// function getReceivedMessages(req, res){
//     var userId = req.user.sub;
//     var page = 1;
//     if(req.params.page){
//        page = req.params.page;
//     }
//     var itemsPerPage = 4;

//     Message.find({receiver: userId}).populate('emitter').paginate(page, itemsPerPage, (err, messages, total) => {
//         if(err){
//         return res.status(500).send({message: 'Error en la peticion', error: err.message});
//         }
//         if(!messages){
//             return res.status(404).send({message: 'No hay mensajes'});
//         }
//         return res.status(200).send({
//             total,
//             pages: Math.ceil(total/itemsPerPage),
//             messages
//         });
//     });

// }