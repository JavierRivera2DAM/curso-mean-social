'use strict'
var bcrypt = require('bcrypt') ;

var User = require('../models/user');

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

function loginUser(req, res){    
    
    var params = req.body;
    
    var email = params.email;
    var password = params.password;   

    User.findOne({email: email, password: password}, (err, user) => {
         if(err) return res.status(500).send({message: 'Error en la peticion'});

         if(!user){
            return res.status(404).send({message: 'El usuario no se ha podido identificar'});
         }
        
         bcrypt.compare(password, user.password, (err, check) => {
            if(check){
                //devolucion datos de usuario
                return res.status(200).send({user});
            }
            
            else{
                return res.status(404).send({message: 'El usuario no se ha podido identificar!!'});
            }
        });          
    })
}


module.exports = {
    home,
    pruebas,
    saveUser,
    loginUser
}


// async   function loginUser (req, res){
//     var params = req.body;

//     var email = params.email;
//     var password = params.password;

//     User.findOne({email: email, password: password}, (err, user) => {
//         if(err) return res.status(500).send({message: 'Error en la peticion'});

//         if(user){
//             bcrypt.compare(password, user.password, (err, check) => {
//                 if(check){
//                     //devolucion datos de usuario
//                     return res.status(200).send({user});
//                 }
//                 else{
//                     return res.status(404).send({message: 'El usuario no se ha podido identificar'});
//                 }
//             });
//         } else{
//             return res.status(404).send({message: 'El usuario no se ha podido identificar!!'})
//         }
//     });
// }