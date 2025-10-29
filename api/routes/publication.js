'use strict'

var express = require('express');
var PublicationController = require('../controllers/publication');
var api = express.Router();
var md_auth = require('../middlewares/authenticated');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/publications' });

api.get('/probando-pub', md_auth.ensureAuth, PublicationController.probando);
api.post('/publication', md_auth.ensureAuth, PublicationController.savePublication);

//Rutas para 'publications' con ruta de pagina opcional
api.get('/publications', md_auth.ensureAuth, PublicationController.getPublications);
api.get('/publications/:page', md_auth.ensureAuth, PublicationController.getPublications);

api.get('/publication/:id', md_auth.ensureAuth, PublicationController.getPublication);

api.delete('/publication/:id', md_auth.ensureAuth, PublicationController.deletePublication);

//Rutas para la Subida y Muestra de Fichero de Imagen en Publicación
api.post('/upload-image-pub/:id', md_auth.ensureAuth, md_upload, PublicationController.uploadImage);
api.get('/get-image-pub/:imageFile', md_auth.ensureAuth, PublicationController.getImageFile);

module.exports = api;