'use strict'
var bcrypt = require('bcrypt') ;

var User = require('../models/user');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


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
async function getUser(req, res){
    try{
    const userId = req.params.id;
    const user = await User.findById(userId);

    if(!user){
        return res.status(404).send({message: 'El usuario no existe'});
    }
        return res.status(200).send({user});
    }

    catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error en la peticion'});
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

    return res.status(200).send({
            users,
            total,
            pages: Math.ceil(total/itemsPerPage)
        });
    
    }
    catch (err) {
    console.error(err);
    return res.status(500).send({message: 'error en la peticion'});
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
 function uploadImage(req, res){
    
    var userId = req.params.id;    

    if(userId != req.user.sub){
        removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar los datos del usuario');
    }
        if(!req.files || !req.files.image){
            return res.status(400).send({ message: 'No se han subido imagenes'});
        }            
        var file_path = req.files.image.path;
        console.log(file_path);

        var file_split = file_path.split('\\');
        console.log(file_split);

        var file_name = file_split[2];
        console.log(file_name);

        var ext_split = file_name.split('\.');
        console.log(ext_split);

        var file_ext = ext_split[1];
        console.log(file_ext);
                

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){
            //Actualizar documento de usuario logeado
            User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {


            });
        }
        

         else{             
                 removeFilesOfUploads(res, file_path, 'Extension no valida');
         } 
                    
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err) => {
        return res.status(200).send({message: message});
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
    uploadImage
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