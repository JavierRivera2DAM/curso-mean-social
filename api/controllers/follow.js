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
    follow.user = req.user.sub
}

module.exports = {
    prueba
}