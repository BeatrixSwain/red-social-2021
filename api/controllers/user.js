//30.12.2020
//Controlador de usuarios
//BeatrixSwain - Zuri Todas las pass son Zuri

'use strict'

var User = require('../models/user');//../ para salir de la carpeta actual..
var Publication = require('../models/publication');//02.02.2021
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
//const { param } = require('../routes/user');
var pagination = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

var Follow = require('../models/follow');
const { listMyFollows } = require('./follow');
const user = require('../models/user');
//////////////////////////////////////////////////////////////////////////////

/*function pruebaGet(req, res){
    res.status(200).send({
        message:'Hola cosita'
    });
};

function pruebaPost(req, res){
    console.log(req.body);
    res.status(200).send({
        message:'Hola cosita'
    });
};*/


//TESTS
function home(req, res){
    res.status(200).send({
        message:'Home de usuarios'
    });
};

function pruebas(req, res){
    res.status(200).send({
        message:'Pruebas de user'
    });
};

//Registro
function saveUser(req, res){
    var user = new User();
    var params = req.body;
    if(params.name&& params.surname && params.nick && params.password && params.email){
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick.toLowerCase();
        user.email = params.email.toLowerCase();
        user.role = 'ROLE_USER';
        user.image = null;
        //
        //controlar usuarios duplicados.

        User.find({
            $or: [{email:user.email.toLowerCase()},
                {nick:user.nick.toLowerCase()}
            ]//or de mongodb
        }).exec((err, users)=>{
            if(err){ 
                return res.status(500).send({message: 'Error al procesar su petición '+err});
            }
            if(users&&users.length>=1){  
                return res.status(200).send({message: 'Ese usuario ya existe'});
            }else{
                //Si no hay repetidos... lo guarda
                user.password = bcrypt.hash(params.password, null, null,  (err, hash)=>{
                    user.password = hash;
                    user.save((err, userStored) =>{
                        if(err){
                            return res.status(500).send({message: 'No se ha guardado el usuario: '+err})
                        }
        
                        if(userStored){
                            res.status(200).send({user: userStored});
                        }else{
                            res.status(404).send({message: 'No se ha registrado el usuario.'});
                        }
                    });
                }); //Hashea la pass con bcrypt.      
            }
        });

      

    
    }else{
        res.status(200).send({
            message: 'Faltan campos necesarios'
        });
    }

};

//Login
function loginUser(req, res){
    var params = req.body;
    var email = params.email.toLowerCase();
    var password = params.password;

    User.findOne({email:email}, (err, user)=>{
        if(err) return res.status(500).send({message: 'Hubo un error al consultar los datos '+err});

        if(user){
            bcrypt.compare(password, user.password, (err, check)=>{
                    if(check){
                        //Devolver los datos del usuario
                        if(params.gettoken){
                            //devolver y generar token.
                            return res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            //devolver los datos deel usuario en claro.
                            user.password = undefined;  //Eliminar la contraseña para que no se envie.
                            return res.status(200).send({user});
                        }
                       
                    }else{
                        return res.status(404).send({message: 'No se ha podido loggear'});
                    }

            });//comparar password

        }else{
            return res.status(404).send({message: 'No se ha podido identificar'});
        }

    });
}

//listar los datos de un usuario completo.
function getUser(req, res){
    var userId = req.params.id; //Por la url. Cuando es por post, body. 

    User.findById(userId, (err, user)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!user) return res.status(404).send({message:'El usuario no existe'});

   /*     Follow.findOne({user:req.user.sub, followed:userId}).exec((err, follow)=>{//comprobar si yo lo sigo
            if(err) return res.status(500).send({message:'Error al comprobar el seguimiento'});
            return res.status(200).send({follow});
        });*/

        //Con promesas
        followThisUser(req.user.sub, userId).then( (value)=>{
            return res.status(200).send({user, value});
        });
    });
}

async function followThisUser(identity_user_id, user_id) {

    var following = await Follow.findOne({ "user": identity_user_id, "followed": user_id }).exec().then((follow) => {    
        return follow;    
    }).catch((err) => {    
        return handleError(err);    
    });
    
    var followed = await Follow.findOne({ "user": user_id, "followed": identity_user_id }).exec().then((follow) => {    
        return follow;    
    }).catch((err) => {    
        return handleError(err);    
    });
    
    return {    
        following: following,
        followed: followed    
    }
    
}

//listar todos los usuarios de forma paginada.
function getUsers(req, res){
    //por la url se recibe el número de pagina.
    var identityUserId = req.user.sub;
    var page = 1;
    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 4;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!users) return res.status(404).send({message:'No hay  usuarios'});

        followThisUserIds(identityUserId).then((value)=>{
            return res.status(200).send({
                        users,
                        users_following:value.following,
                        users_follow_me:value.followed,
                        total,
                        pages: Math.ceil(total/itemsPerPage),


            });

        });
       
    });

}

//22.01.2021
async function followThisUserIds(user_id) {

    var following = await  Follow.find({ "user": user_id }).select({'_id':0, '__v':0,'user':0}).exec().then((follows) => {    
        var follows_clean = [];
        follows.forEach(element => {
            follows_clean.push(element.followed);
        });

        return follows_clean;    
    }).catch((err) => {    
        return handleError(err);    
    }); 

    var followed = await  Follow.find({ "followed": user_id }).select({'_id':0, '__v':0,'followed':0}).exec().then((follows) => {    
        var follows_clean = [];
        follows.forEach(element => {
            follows_clean.push(element.user);
        });
        
        return follows_clean;    
    }).catch((err) => {    
        return handleError(err);    
    }); 

    
    return {    
        following: following,
        followed: followed    
    }
    
}

/* FUNCIONES DE DEVOLVER CONTADORES Y ESTADÍSTICAS - 22.01.2021 */
function getCounters(req, res){
    var userId = req.user.sub;
    if(req.params.id){
        userId = req.params.id;
    }

    getCountFollow(userId).then((value)=>{
            return res.status(200).send(value);
        });


}

async function getCountFollow(user_id){
    var following = await Follow.count({"user":user_id}).exec().then((count)=>{
        return count;

    }).catch((err) => {    
        return handleError(err);    
    });

    var followed = await Follow.count({"followed":user_id}).exec().then((count)=>{
        return count;

    }).catch((err) => {    
        return handleError(err);    
    });

    var publications = await Publication.count({"user":user_id}).exec().then((count)=>{
        return count;

    }).catch((err) => {    
        return handleError(err);    
    });

    return {following:following, followed:followed, publications: publications}

}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Actualizar datos de un usuario.
function updateUser(req, res){
    var userId = req.params.id;//recoger por la ur
    var update = req.body;//Para recoger los datos del documento que vamos a eliminar -> eliminar la propiedad
                          // password que para poder cambiar la pass es mejor hacerlo con un método a parte
    //borrar la propiedad password
    delete update.password;
    if(userId != req.user.sub){
        return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
    }

    User.find({
        $or: [{email:update.email.toLowerCase()},
            {nick:update.nick.toLowerCase()}
        ]//or de mongodb
    }).exec((err, users)=>{
        if(err){ 
            return res.status(500).send({message: 'Error al procesar su petición '+err});
        }

        var existe = false;
        if(users){
            users.forEach((user)=>{
                if(user){                   
                    if(user._id!=userId){
                        existe = true; console.log(user);
                    }
                }
            });        
        }
        
        //////
        if(existe){
            return res.status(404).send({message: 'El nick/email ya está en uso'});
        }
        else{
            User.findByIdAndUpdate(userId, update, {new:true, useFindAndModify: false}, (err, userUpdate)=>{ 
                //new -> devuelve el actualizado
                //useFindAndModify -> para evitar un warning => DeprecationWarning: Mongoose: 
                //`findOneAndUpdate()` and `findOneAndDelete()` without the `useFindAndModify` 
                //option set to false are deprecated. 
                if(err) return res.status(500).send({message:'Error en la petición'});
                if(!userUpdate) return res.status(404).send({message:'No se ha podido actualizar el usuario'});

                return res.status(200).send({user:userUpdate});
            });
         }
    });
}

//Subir archivos de imagen/avatar de usuario.
function uploadImage(req, res){
    var userId = req.params.id;//re
    
    if(req.files){
        if(Object.keys(req.files).length>0){
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var nameFinal = file_split[file_split.length-1];
            var ext_split = nameFinal.split('\.');
            var file_ext = ext_split[ext_split.length-1];
            console.log("file_path: "+file_path);
            console.log("file_split: "+file_split);
            console.log("nameFinal: "+nameFinal);
            console.log("ext: "+ext_split);
            console.log("file_ext: "+file_ext);

            if(userId != req.user.sub){
                return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar este usuario');
               // return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
            }

            if(file_ext=='png' ||file_ext=='jpg' ||file_ext=='jpeg' ||
            file_ext=='gif' ){
                //Actualizar documento de usuario logeado
                User.findByIdAndUpdate(userId,{image:nameFinal}, {new:true, useFindAndModify: false}, (err, userUpdate)=>{
                    if(err) return res.status(500).send({message:'Error en la petición'});
                    if(!userUpdate) return res.status(404).send({message:'No se ha podido actualizar el usuario'});
                    return res.status(200).send({user:userUpdate});
                });
              
            }else{

                return removeFilesOfUploads(res, file_path, 'Ext no válida');
               // return res.status(500).send({message:'Formato de archivo inválido'});
            }
           
        }else{
            return res.status(200).send({message:'No se han subido archivos'});


        }
    }else{
        return res.status(200).send({message:'No se han subido archivos'});


    }
}

function removeFilesOfUploads(res, file_path, message){
    fs.unlink(file_path, (err)=>{
        return res.status(500).send({message:message});

    });
}

function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    var pathFile ='./uploads/users/'+imageFile;
    if(fs.existsSync(pathFile)){
        res.sendFile(path.resolve(pathFile));

    }else{
        res.status(200).send({message:'No existe la imagen'});

    }


}

module.exports = {
  //  pruebaGet,
  //  pruebaPost,
    home,
    pruebas,
    saveUser,
    loginUser,
    getUser,
    getUsers,
    getCounters,//22.01.2021
    updateUser,
    uploadImage, 
    getImageFile
}