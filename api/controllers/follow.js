//05.01.2020
//BeatrixSwain

'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');

var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
res.status(200).send({message:'Hola tú'});

}

function saveFollow(req, res){
    var params = req.body;
    var follow = new Follow();

    follow.user = req.user.sub;
    follow.followed = params.followed;

    follow.save((err, followStored)=>{
        if(err) return res.status(500).send({message:'Error al guardar el seguimiento'});
        if(!followStored) return res.status(404).send({message:'El seguimiento no se ha guardado'});

        return res.status(200).send({follow:followStored});

    });
}


function deleteFollow(req, res){
    var idUser = req.user.sub;
    var idFollowed = req.params.id;
    
   /*     Follow.find({user:idUser, followed:idFollowed}, (err, follow)=>{
            if(err) return res.status(500).send({message:'Error al recuperar el follow'});
            if(!follow) return res.status(404).send({message:'El follow está vacío'});

            return res.status(200).send({follow:follow});
        });*/

        //Follow.find({user:idUser, followed:idFollowed}).remove((err)=>{ //evitar el warning de collection.remove is deprecated.
   Follow.find({user:idUser, followed:idFollowed}).deleteMany((err, res2)=>{

             console.log(res2); //n; ok; deleteCount            
            if(err) return res.status(500).send({message:'Error al borrar el follow'});
            return res.status(200).send({message:'Ha dejado de seguir al usuario. Registros borrados:'+res2.deletedCount});
    });
      
    
}

function getFollowingUsers(req, res){
    var idUser = req.user.sub;
    if(req.params.id/*&&req.params.page*/&&isNaN( req.params.id)){
        idUser = req.params.id;        
    }

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 2;
    //populate se usa para recuperar el documento entero del usuario followed
    Follow.find({user:idUser}).populate({path:'followed'}).paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message:'Error en el servidor'+err});
        if(!follows) return res.status(404).send({message:'No seguimos a nadie'});

        return res.status(200).send({total:total, pages:Math.ceil(total/itemsPerPage), follows});

    });

}

function getFollowers(req, res){
    var idUser = req.user.sub;
    if(req.params.id/*&&req.params.page*/&&isNaN( req.params.id)){
        idUser = req.params.id;        
    }

    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 2;
    //populate se usa para recuperar el documento entero del usuario followed
    Follow.find({followed:idUser}).populate({path:'user'}).paginate(page, itemsPerPage, (err, follows, total)=>{
        if(err) return res.status(500).send({message:'Error en el servidor'+err});
        if(!follows) return res.status(404).send({message:'No nos sigue nadie'});

        return res.status(200).send({total:total, pages:Math.ceil(total/itemsPerPage), follows});

    });

}

//Listar de manera clara los usuarios que sigo
function getMyFollows(req, res){
    var idUser = req.user.sub;

    Follow.find({user:idUser}).populate({path:'user followed'}).exec((err, follows)=>{
        if(err) return res.status(500).send({message:'Error en el servidor'+err});
        if(!follows) return res.status(404).send({message:'Sigues a nadie'});

        return res.status(200).send({follows});

    });

}

//Usuarios que me siguen
function getFollowBacks(req, res){
    var idUser = req.user.sub;

    Follow.find({followed:idUser}).populate({path:'user followed'}).exec((err, follows)=>{
        if(err) return res.status(500).send({message:'Error en el servidor'+err});
        if(!follows) return res.status(404).send({message:'Sigues a nadie'});

        return res.status(200).send({follows});

    });

}

//método que hace ambas cosas según un parámetro de url
function listMyFollows(req, res){
    var idUser = req.user.sub;
    var find = Follow.find({user:idUser});

    if(req.params.followed){
        find = Follow.find({followed:idUser}); //Para obtener mis seguidores
    }

    find.populate({path:'user followed'}).exec((err, follows)=>{
        if(err) return res.status(500).send({message:'Error en el servidor'+err});
        if(!follows) return res.status(404).send({message:'Sin resultados'});

        return res.status(200).send({follows});

    });

}


module.exports={
    prueba,
    saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowers,
    getMyFollows,
    getFollowBacks,
    listMyFollows
}