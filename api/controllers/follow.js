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
function saveFollow(req, res) {
    var params = req.body;

    var follow = new Follow();
    follow.user = req.user.sub;
    follow.followed = params.followed;

    // Verificar si ya existe el seguimiento
    Follow.findOne({ user: follow.user, followed: follow.followed })
    .then(existingFollow => {
        if (existingFollow) {
            return res.status(409).send({ message: 'Ya estás siguiendo a este usuario' });
        }

        // Si no existe, guardar el nuevo seguimiento
        return follow.save();
    })
    .then(followStored => {
        if (!followStored) {
            return res.status(404).send({ message: 'El seguimiento no se ha guardado' });
        }
        return res.status(200).send({ follow: followStored });
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
        
        //Primero se busca dentro de 'req.params.page' en las rutas del tipo '/usuario/:page'
        //Si no lo localiza, busca dentro de las rutas del tipo '/usuario?/page'
        
        const rawPage = req.params.page || req.query.page;

        //Se realiza la conversion de 'rawPage' a número. Si no es válido ('NAN'), se emplea la pagina 1 por defecto
        const page = Number.isNaN(parseInt(rawPage)) ? 1 : parseInt(rawPage);
        
        //Definicion de cuantos elementos se mostraran por pagina
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

//Devolver los Usuarios que Siguen a un Usuario
async function getFollowedUsers(req, res){
    try{
    let userId = req.user.sub;
    let page = 1;

    if(req.params.id && req.params.page){
        userId = req.params.id;
        page = parseInt(req.params.page);
    }  

    //Definimos la constante para visualizar el limite de items por cada pagina
    const itemsPerPage = 4;
    
    //Definimos la constante de saltar o skip, para determinar segun la posicion de la pagina, cuantos items debe saltar.
    //En la primera pagina, muestra los 4 primeros, en la segunda, se salta los 4 primeros y accede al 5º, y asi sucesivamente.
    const skip = (page - 1) * itemsPerPage;

    const follows = await Follow.find({followed:userId}).populate('user').skip(skip).limit(itemsPerPage);
        
        if(!follows || follows.length === 0){
            return res.status(404).send({message: 'No te sigue ningun usuario'});
        }

        //Total de seguidores
        const total = await Follow.countDocuments({ followed: userId });

        return res.status(200).send({
            total,
            pages: Math.ceil(total/itemsPerPage),
            follows
        });
     }
     catch(err) {
        return res.status(500).send({message: 'Error en el servidor'});
    }
 }

//Funcion para devolver los Ususarios que Sigo
async function getMyFollows(req, res){
    try{
        const userId = req.user.sub;
        const isFollowedView = req.params.followed;

        // const query = isFollowedView
        //     ? { followed: userId }
        //     : { user: userId };

        //Se aplica la logica de mostrar los usuarios seguidos o los que me siguen. Usando un booleano
        let query = {};
        if (isFollowedView === true){ //(Logica Booleana para llevar a cabo la busqueda)
        query = {followed: userId};
        }
        else{
        query = {user: userId};
        }

        const follows = await Follow.find(query).populate('userfollowed');

        return res.status(200).send({follows});
    }
    catch(err){
        return res.status(500).send({message: 'Error en el servidor', error: err})
    }

    // var userId = req.user.sub;    

    // var find = Follow.find({user: userId});

    // if(req.params.followed){
    //      find = Follow.find({followed: userId});
    // }

    // find.populate('user followed').exec((err, follows) => {
    //     if(err){
    //         return res.status(500).send({message: 'Error en el servidor'});
    //     }
    //     return res.status(200).send({follows});
    // });
}




module.exports = {
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getMyFollows
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


// function getFollowedUsers(req, res){
//     var userId = req.user.sub;

//     if(req.params.id && req.params.page){
//         userId = req.params.id;
//     }
//     var page = 1;
    
//     if(req.pararms.page){
//         page = req.params.page;
//     }
//     else{
//         page = req.params.id;
//     }

//     var itemsPerPage = 4;

//     Follow.find({followed:userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
//         if(err){
//         return res.status(500).send({message: 'Error en el servidor'});
//         }

//         if(!follows){
//             return res.status(404).send({message: 'No te sigue ningun usuario'});
//         }
//         return res.status(200).send({
//             total: total,
//             pages: Math.ceil(total/itemsPerPage),
//             follows
//         });
//      })
//  }

// function getMyFollows(req, res){
//     var userId = req.user.sub;    

//     var find = Follow.find({user: userId});

//     if(req.params.followed){
//          find = Follow.find({followed: userId});
//     }

//     find.populate('user followed').exec((err, follows) => {
//         if(err){
//             return res.status(500).send({message: 'Error en el servidor'});
//         }
//         return res.status(200).send({follows});
//     });
// }