//30.12.2020
//Controlador de usuarios
//BeatrixSwain

'use strict'

var User = require('../models/user');//../ para salir de la carpeta actual..
//////////////////////////////////////////////////////////////////////////////

function pruebaGet(req, res){
    res.status(200).send({
        message:'Hola cosita'
    });
};

function pruebaPost(req, res){
    console.log(req.body);
    res.status(200).send({
        message:'Hola cosita'
    });
};

function home(req, res){
    res.status(200).send({
        message:'Home de test'
    });
};

module.exports = {
    pruebaGet,
    pruebaPost,
    home
}