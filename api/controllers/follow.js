'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');
const follow = require('../models/follow');

function saveFollow(req, res){
    var params = req.body;

    var follow = new Follow();    
    //La propiedad 'user' del objeto 'req' adjunta un objeto con el usuario que esta logeado. Setea el user en 'authenticated.js', en el payload
    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored) => {
        if(err){
            return res.status(500).send({message: 'Error al guardar el seguimiento'});
        }

        if(!followed){
            return resw.status(404).message.send({message: 'El seguimiento no se ha guardado'});
        }
        return res.status(200).send({follow:followStored});
    });
}

module.exports = {
    saveFollow
}