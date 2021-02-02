//definir modelo en js y mongoose.
//generarlo como en mongoose.
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MessageSchema = Schema({
    //_id no es necesario porque es automático de mongo
    emitter:  {type: Schema.ObjectId, ref:'User'},
    receiver:  {type: Schema.ObjectId, ref:'User'},
    text: String,
    created_at: String,
    viewed: String,
});

module.exports = mongoose.model('Message', MessageSchema);//exporta el modelo, nombre y el esquema.