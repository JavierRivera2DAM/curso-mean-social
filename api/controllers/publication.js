'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');

function probando (req, res){
    res.status(200).send({
        message: "Hola desde el Conmtrolador de Publicaciones"
    });    
}

module.exports = {
    probando
}