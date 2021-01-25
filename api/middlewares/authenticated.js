//MIDDLEWARE - SE EJECUTA ANTES DE PASAR A LA URL.
//01.01.2021.
//BeatrixSwain
//////////////////////////////////////////////////////////

'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'D4nt33s4zr43lY4m44B34tr1xSw41n_43v3r';//CLAVE SECRETA DE LA CLASE jwt.js <- es mía.

//req los datos que recibimos
//res nuestra respuesta
//next es la funcionalidad que nos permite saltar a otra cosa.. Hasta que no lancemos el next, el programa 
//no va a salir del middleware. -> en este caso el método de la ruta.
exports.ensureAuth = function (req, res, next){
    if(!req.headers.authorization){
        return res.status(404).send({message:'La petición no tiene la cabecera de autenticación'});
    }

    var token = req.headers.authorization.replace(/['"]/g, "");
    try{
        var payload = jwt.decode(token, secret);
        if(payload.exp<=moment().unix){
            return res.status(401).send({message:'El token ha expirado'});
        }
    }catch(ex){
        console.log("ERROR PAYLOAD: "+ex);
        return res.status(404).send({message:'El token no es válido'});

    }

    req.user = payload;//En los controladores así se tiene acceso al payload -> user.
    next();//saltar a lo siguiente o acción del controlador.
};
