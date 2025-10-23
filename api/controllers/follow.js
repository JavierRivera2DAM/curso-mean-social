'use strict'

//var path = require('path');
//var fs = require('fs');
var mongoosePaginate = require('mongoose-paginate-v2');
const mongoose = require('mongoose');

var User = require('../models/user');
var Follow = require('../models/follow');
const follow = require('../models/follow');

//Se crea el metodo 'saveFollow' para guardar los follows de cada usuario
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
            return res.status(404).send({ message: 'El seguimiento no se ha guardado'});
        }
        return res.status(200).send({ follow:followStored });
    })
    .catch(err => {
        return res.status(500).send({ message: 'Error al guardar el seguimiento', error: err });
    });
}

//Se crea el metodo para borrar Usuario Seguido
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

//Se crea el Metodo para Listar los Ususarios que se estan siguiendo
//Se procede a modificar 'getFollowingUsers' para evitar el error en el uso de callbacks desactualizado. Metodo asincrono 'await'

async function getFollowingUsers(req, res) {
    try {
        let userId = req.params.id;

        // Si no hay id o el id es inválido, usar el usuario autenticado
        if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
            userId = req.user.sub;
        }

        //Para poder emplear cualquier tipo de valor en el campo del '(/:id)' sin que salte una excepcion o error
        const rawPage = req.params.page || req.query.page;
        const page = Number.isNaN(parseInt(rawPage)) ? 1 : parseInt(rawPage);
        const itemsPerPage = 4;

        const result = await Follow.paginate(
            { user: userId },
            {
                page,
                limit: itemsPerPage,
                populate: { path: 'followed' }
            }
        );

        const { docs: follows, totalDocs: total = 0 } = result;

        return res.status(200).send({
            total,
            pages: Math.ceil(total / itemsPerPage),
            currentPage: page,
            follows
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor', error: err.message });
    }
}

module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers
}



// function getFollowingUsers(req,res){
//     var userId = req.user.sub;

//     if(req.params.id){
//         userId = req.params.id;
//     }

//     var page = 1;
    
//     if(req.pararms.page){
//         page = req.params.page;
//     }

//     var itemsPerPage = 4;

//     Follow.find({user:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
//         if(err){
//         return res.status(500).send({message: 'Error en el servidor'});
//         }

//         if(!follows){
//             return res.status(404).send({message: 'No estas siguiendo a un usuario'});
//         }
//         return res.status(200).send({
//             total: total,
//             pages: Math.ceil(total/itemsPerPage),
//             follows
//         });
//     })
// }