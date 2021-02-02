//CONFIGURACIÓN DE TODO LO QUE TIENE QUE VER CON EXPRESS.
//30.12.2020 BEATRIX SWAIN
/////////////////////////////////////////////////////////
'use strict'
var express = require('express');
var bodyParser = require ('body-parser');
var app = express();

////////////////////////////////////////////////
//cargar rutas
var user_routes = require('./routes/user'); //configuracion de rutas de user
var pruebas_routes = require('./routes/pruebas'); //configuracion de rutas de user
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes  = require('./routes/message');//02.02.2021


//middlewares -> método antes de que llegue a un controlador. En cada peticion se ejecuta.
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors - Configuración de cabeceras.
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


//rutas - app.use permite hacer middleware. Siempre se ejecuta antes de la acción del controlador
//app.use(user_routes); // usa la ruta establecida en user_routes.
app.use('/api', user_routes); //pone delante la ruta de /api/ --> /api/rutadelmetodo
app.use('/test', pruebas_routes); //pone delante la ruta de /api/ --> /api/rutadelmetodo
app.use('/follow', follow_routes); 
app.use('/publication', publication_routes);//02.02.2021
app.use('/msg', message_routes);//02.02.2021
////////////////////////////////////////////////


//exportar
module.exports = app;
