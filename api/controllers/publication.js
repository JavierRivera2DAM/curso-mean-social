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

async function savePublication(req, res){
    
    const params = req.body;
    
    //Se realiza la Validacion de Texto
    if(!params.text || params.text.trim() === ''){
        return res.status(200).send({message: 'Debes enviar un texto!!'});        
    }

    const publication = new Publication();    
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    try{
    const publicationStored = await publication.save()       
       if(!publicationStored){
        return res.status(404).send({message: 'La publicacion NO ha sido guardada'});
       }
       return res.status(200).send({publication: publicationStored}); 
    }

catch(err){
    return res.status(500).send({message: 'Error al guardar la publicacion', error: err.message});
}
}

module.exports = {
    probando,
    savePublication
}