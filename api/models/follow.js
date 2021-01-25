//definir modelo en js y mongoose.
//generarlo como en mongoose.
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FollowSchema = Schema({
    //_id no es necesario porque es automático de mongo
    user:  {type: Schema.ObjectId, ref:'User'}, //el que sigue
    followed:  {type: Schema.ObjectId, ref:'User'} //el seguido
});

module.exports = mongoose.model('Follow', FollowSchema);//exporta el modelo, nombre y el esquema.