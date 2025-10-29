'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');

var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando(req, res){
    res.status(200).send({message: 'Hola qué tal'});
}

module.exports = {
    probando
}