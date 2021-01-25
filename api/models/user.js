//definir modelo en js y mongoose.
//generarlo como en mongoose.
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = Schema({
    //_id no es necesario porque es automático de mongo
    name: String,
    surname: String,
    nick: String,
    email: String,
    password: String,
    role: String,
    image: String
});

module.exports = mongoose.model('User', UserSchema);//exporta el modelo, nombre y el esquema.

/*
Lo anterior es como si:
    const schema = new mongoose.Schema({ name: 'string', size: 'string' });
    const UserSchema = mongoose.model('User', schema);
    UserSchema.save(function (err) { <-- es posteriormente para guardarlo, está en el controlador
        if (err) return handleError(err);
        // saved!
    });
*/

