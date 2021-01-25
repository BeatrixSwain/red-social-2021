//30.12.2020
//Conexion mongodb y servidor.
//Beatrix Swain
///////////////////////////////////////////////////////////////////

'use strict' //usar nuevas características de javascript.
var mongoose = require('mongoose');//cargar moongose en una variable
//Crear servidor web con express.
var app = require('./app'); // al estar en un archivo que no en el node module, url. ./ <-- esta ruta
var port = 3800;

//////////////////////////////////////////////////////////////

//para conectar se hace por promesas.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/redsocial2021', { useNewUrlParser: true, useUnifiedTopology: true})
                                .then(()=>{
                                    console.log("Conexión a base de datos correctamente :)");
                                    //crear servidor
                                    app.listen(port, ()=>{console.log("Server running...") });
                                })
                                .catch(err=> console.log(err));



