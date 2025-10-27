'use strict'
var bcrypt = require('bcrypt') ;

var User = require('../models/user');
var Follow = require('../models/follow');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');
const follow = require('../models/follow');


//Metodos de Prueba
function home (req, res){
    res.status(200).send({
        message: 'Hola Mundo desde el Servidor de NodeJS'
    });
}

function pruebas (req, res){
    console.log(req.body);
    res.status(200).send({
        message: 'Accion de pruebas en el servidor de Node'
    });
}

//Registro de Usuario
//En el curso se utiliza metodología de callbacks, debido a que usa una versión más antigua de Mongoose. Se sustituye por uso de función asíncrona y 'await' 

async function saveUser(req, res){
    console.log('req.body:', req.body);
    
    if (!req.body) {
        return res.status(400).send({ message: 'No se han enviado datos en el cuerpo de la solicitud' });
    }   
    var params = req.body;
    var user = new User();

    if(!params.name || !params.surname ||
         !params.nick || !params.email || !params.password){
           return res.status(400).send({ message: 'Envia todos los campos necesarios' });           
    }
    try {
        //Se procede a la verificacion de la existencia del usuario
        const existingUser = await User.findOne({
            $or: [{ email: params.email }, { nick: params.nick }]
        });

        if (existingUser){
            return res.status(409).send({ message: 'El usuario que intentas registrar ya existe'})
        }
        //Creacion de Nuevo Ususario
        const user = new User({
            name: params.name,
            surname: params.surname,
            nick: params.nick,
            email: params.email,
            role: 'ROLE_USER',
            image: null,

        //Cifrado y Guardado de Contraseña
            password: await bcrypt.hash(params.password, 10)
    });

    const userStored = await user.save();
    return res.status(200).send({ user: userStored });

  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Error al guardar el usuario' });
  }
}


//Login
//Se sustituye el uso de la función normal por asíncrona. y en vez de usar 'callbacks' (deprecados en esta versión de Mongoose), se usa 'await'

async function loginUser(req, res) {
    try {
        const { email, password, gettoken } = req.body;        

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }

        const check = await bcrypt.compare(password, user.password);

        if (check) {
            if (gettoken) {
                //generar y devolver token
                return res.status(200).send({
                    token: jwt.createToken(user)
                });

    
            } else {
                //devolver datos de usuario
                return res.status(200).send({ user });
    
            }
            
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido identificar' });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

//Conseguir datos de un usuario
//Sustitución función síncrona por asíncrona y uso de 'awaits' en vez de 'callbacks'
// async function getUser(req, res){
//     try{
//     const userId = req.params.id;
//     const user = await User.findById(userId);

//     if(!user){
//         return res.status(404).send({message: 'El usuario no existe'});
//     }
//     const followStatus = await followThisUser(req.user.sub, userId);
    
      
//         return res.status(200).send({
//             user,
//             following: followStatus.following,
//             followed: followStatus.followed
//         });        
    
// }
//     catch(err){
//         console.error(err);
//         return res.status(500).send({message: 'Error en la peticion'});
//     }
// }

async function getUser(req, res){
    try{
    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).send({message: 'El usuario no existe'});
    }
    //const follow = await Follow.findOne({"user":req.user.sub, "followed":userId});
    const follow = await Follow.findOne({"user":req.user.sub, "followed":userId});        
    
        return res.status(200).send({user, follow});
    
    
}
    catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error en la peticion'});
    }
}

//Explicacion Metodologia 'Async/Await' del Curso. Punto 37
//Se crea la Funcion Asincrona 'followThisUser'
async function followThisUser(identity_user_id, userId){
    var following = await Follow.findOne({"user": identity_user_id, "followed":userId}).exec((err, follow) => {
        if(err){
            return handleError(err);
        }
        return follow;
    }); 
    
    var followed = await Follow.findOne({"user": identity_user_id, "followed":userId}).exec((err, follow) => {
        if(err){
            return handleError(err);
        }
        return follow;
    });

    return {
        following: following,
        followed: followed
    }
}


//Devolver un listado de usuarios paginado
//Sustitución función síncrona por asíncrona y uso de 'awaits' en vez de 'callbacks'
async function getUsers(req, res){
    try{        
    const identity_user_id = req.user.sub;
    const identity = await User.findById(identity_user_id);

    const page = parseInt(req.params.page) || 1;
    const itemsPerPage = 5;

    const total = await User.countDocuments();
    const users = await User.find().sort('_id').skip((page - 1) * itemsPerPage).limit(itemsPerPage);

    if (!users || users.length === 0) {
        return res.status(404).send({message: ' No hay usuarios disponibles'});        
    }

    followThisUser(req.user.sub, userId).then((value) => {
        return res.status(200).send({user, follow});
    });
    
    }
    catch (err) {
    console.error(err);
    return res.status(500).send({message: 'El usuario no existe'});
    }
}

//Edicion de datos de usuario
//Sustitución función síncrona por asíncrona y uso de 'awaits' en vez de 'callbacks'

async function updateUser(req, res){
    try{
    const userId = req.params.id;
    const update = req.body;    

    //Borrar propiedad password
    delete update.password;  
    
    //Verificar que el usuario autenticado es el dueño del perfil
    if (userId !== req.user.sub){
        return res.status(403).send({message: 'No tienes permiso para actualizar los datos del usuario'});
    }

    const userUpdated = await User.findByIdAndUpdate(userId, update, { new: true});
              

        if(!userUpdated){
            return res.status(404).send({message: 'No se ha podido actualizar el usuario'});
        }
        return res.status(200).send({user: userUpdated});
    }
    catch(err){
        console.error(err);
         return res.status(500).send({message: 'Error en la peticion'});
    }
}

//Subir archivos de imagen/avatar de usuario
//Sustitución función síncrona por asíncrona y uso de 'awaits' en vez de 'callbacks'
 async function uploadImage(req, res){
    
    var userId = req.params.id;    

    if(userId != req.user.sub){
        return res.status(403).send({ message: 'No tienes permiso para actualizar los datos del usuario' });
    }
        if(!req.files || !req.files.image){
            return res.status(400).send({ message: 'No se han subido imagenes'});
        }

        var file_path = req.files.image.path;
        var file_name = require('path').basename(file_path);
        var file_ext = require('path').extname(file_name).toLowerCase().replace('.', '');
        var validExtensions = ['png', 'jpg', 'jpeg', 'gif'];                

        if(!validExtensions.includes(file_ext)){
           return removeFilesOfUploads(res, file_path, 'Extension no valida');
        }

        try{
            //Actualizar documento de usuario logeado
            var userUpdated = await User.findByIdAndUpdate(userId, { image: file_name }, { new: true});
                
                if(!userUpdated){
                    return res.status(404).send({message: 'No se ha podido actualizar'});
                }
                return res.status(200).send({user: userUpdated});
            }
         catch(err){
            return res.status(500).send({message: 'Error en la peticion'});
        }                            
}

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
    var path_file = path.resolve('./uploads/users/', image_file);

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

//Exportaciones de los módulos empleados
module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    updateUser,
    uploadImage,
    getImageFile    
}

// //Edicion de datos de usuario
// function updateUser(req, res){
//     var userId = req.params.id;
//     var update = req.body;

//     //Borrar propiedad password
//     delete update.password;

//     if(userId != req.user.sub){
//         return res.status(500).send({message: 'No tienes permiso para actualizar los datos del usuario'});
//     }

//     User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated) => {
//         if(!userUpdated){ return res.status(500).send({message: 'Error en la peiticion'});
//         }

//         if(!userUpdated) return res.status(404).send({message: 'No se ha podido actualizar el usuario'});

//         return res.status(200).send({user: userUpdated});
//     });
// }


//return res.status(200).send({
    //         users,
    //         total,
    //         pages: Math.ceil(total/itemsPerPage)
    //     });