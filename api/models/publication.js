//definir modelo en js y mongoose.
//generarlo como en mongoose.
'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var PublicationSchema = Schema({
    //_id no es necesario porque es automático de mongo
    user: {type: Schema.ObjectId, ref:'User'},
    text: String,
    file: String,
    created_at: String
});

module.exports = mongoose.model('Publication', PublicationSchema);//exporta el modelo, nombre y el esquema.