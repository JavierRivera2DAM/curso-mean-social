'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
const publication = require('../models/publication');

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

async function getPublications(req, res){
    let page = parseInt(req.params.page) || 1;
    const itemsPerPage = 4;
    try{
        //Obtener los Usuarios Seguidos
        const follows = await Follow.find({user: req.user.sub}).populate('followed');

        //Extraer los Ids de los Usuarios Seguidos
        const follows_clean = follows.map(follow => follow.followed._id);

        //Se añade el propio usuario para incluir sus publicaciones
        follows_clean.push(req.user.sub);

        //Búsqueda de las Publicaciones de los Seguidos y del Propio Usuario
        const publications = await Publication.find({ user: { $in: follows_clean}})
        .sort('-created_at')
        .skip((page - 1)* itemsPerPage)
        .limit(itemsPerPage)
        .populate('user');
        
        //Se cuenta el total de publicaciones para paginación
        const total = await Publication.countDocuments({ user: { $in: follows_clean}});

        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            page,
            publications
        });             
    
}
catch(err){
    return res.status(500).send({message: 'Error al devolver publicacion'});
}
}

function getPublication(req, res){
    var publId = req.params.id;

    Publication.findById(publicationId, (err, publication) => {
        if(err){
            return res.status(500).send({message: 'Error al Devolver Publicaciones'});
        }

        if(!publication){
            return res.status(404).send({message: 'No existe la publicación'});
        }

        return res.status(200).send({publication});
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication

}