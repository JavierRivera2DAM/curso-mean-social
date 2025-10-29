'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment');
var mongoosePaginate = require('mongoose-paginate-v2');

var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
const publication = require('../models/publication');
const { error } = require('console');

function probando (req, res){
    res.status(200).send({
        message: "Hola desde el Conmtrolador de Publicaciones"
    });    
}

//Metodo para Guardar las Publicaciones
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

//Metodo para Devolver Publicaciones
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

//Metodo para Devolver una Publicacion buscando por su Id
async function getPublication(req, res){
    try{   
    const publicationId = req.params.id;
    const publication = await Publication.findById(publicationId);
    
    if(!publication){
        return res.status(404).send({message: 'No existe la publicación'});
    }

        return res.status(200).send({publication});
    }    
    catch(err){
        return res.status(500).send({message: 'Error al Devolver Publicaciones'});
    }
}

//Metodo para Borrar Publicaciones
async function deletePublication(req, res){
    try{
    const publicationId = req.params.id;
    const publicationRemoved = await Publication.findByIdAndDelete(publicationId);        
    
    if(!publicationRemoved){
            return res.status(404).send({message: 'No existe la publicacion'});
        }
        return res.status(200).send({publication: publicationRemoved, message: 'Publicación ELIMINADA CORRECTAMENTE. Verifique la Base de Datos'});
    }

    catch(err){
    return res.status(500).send({message: 'Error al borrar publicaciones', error: err.message}); 
    }
}

//Metodo para subir fichero en la publicacion
async function uploadImage(req, res){
    
    var publicationId = req.params.id;    

    // if(publicationId != req.user.sub){
    //     return res.status(403).send({ message: 'No tienes permiso para actualizar los datos de la publicación', error: err.message });
    // }
        if(!req.files || !req.files.image){
            return res.status(400).send({ message: 'No se han subido imagenes', error: err.message});
        }

        var file_path = req.files.image.path;
        var file_name = require('path').basename(file_path);
        var file_ext = require('path').extname(file_name).toLowerCase().replace('.', '');
        var validExtensions = ['png', 'jpg', 'jpeg', 'gif'];                

        if(!validExtensions.includes(file_ext)){
           return removeFilesOfUploads(res, file_path, 'Extension no valida', err.message);
        }

        try{
            //Actualizar documento de publicacion
            var publicationUpdated = await Publication.findByIdAndUpdate(publicationId, { image: file_name }, { new: true});
                
                if(!publicationUpdated){
                    return res.status(404).send({message: 'No se ha podido actualizar', error: err.message});
                }
                return res.status(200).send({publication: publicationUpdated, message: 'La Imagen ha sido Subida CORRECTAMENTE'});
            }
         catch(err){
            return res.status(500).send({message: 'Error en la peticion', error: err.message});
        }                            
}

//Método para borrar un Archivo de Imagen Subido
function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        if (err) {
        return res.status(500).send({message: 'Error al eliminar el archivo'});
    }
        return res.status(200).send({message: message});
    });
}

//Devolver Imagen de Usuario
function getImageFile(req, res){
    var image_file = req.params.imageFile;    
    var path_file = path.resolve('./uploads/publications/', image_file);

    fs.access(path_file, fs.constants.F_OK, (err) => {
        if (err){
            res.status(200).send({message: 'No existe la imagen...'});            
        }
            res.sendFile(path.resolve(path_file));
            if(err){
                return res.status(500).send({ message: 'Error al enviar la imagen'});
            }       
    });
}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile

}