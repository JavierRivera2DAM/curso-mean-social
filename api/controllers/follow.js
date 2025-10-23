'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
const follow = require('../models/follow');

//En esta funcion vamos a usar la metodologia de '.then - .catch' para evitar el error por los 'callbacks' desactualizados
function saveFollow(req, res){
    var params = req.body;

    var follow = new Follow();    
    //La propiedad 'user' del objeto 'req' adjunta un objeto con el usuario que esta logeado. Setea el user en 'authenticated.js', en el payload
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save()
    .then(followStored => {
        if(!followStored){
            return res.status(404).message.send({ message: 'El seguimiento no se ha guardado'});
        }
        return res.status(200).send({ follow:followStored });
    })
    .catch(err => {
        return res.status(500).send({ message: 'Error al guardar el seguimiento', error: err });
    });
}

//Se actualiza la metodologia original para usar '.then - .catch'
function deleteFollow(req, res){
    var userId = req.user.sub;
    var followId = req.params.id;

    //Importante. Hay que usar 'findOneAndDelete' si se deja 'findOne' no lo borra, aunque desde la terminal de postman muestre mensaje de exito
    Follow.findOneAndDelete()
    .then(deletedFollow => {
        if(!deletedFollow){
            return res.status(404).send({message: 'No se encontró el seguimiento'});            
        }
        return res.status(200).send({message: 'El follow se ha eliminado'});        
    })
    
    .catch(err => {
        return res.status(500).send({message: 'Error al dejar de seguir', error: err});
    });
}

module.exports = {
    saveFollow,
    deleteFollow
}