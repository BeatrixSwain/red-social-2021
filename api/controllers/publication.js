//02.02.2021
////////////////////////////////////////
'use strict'

var path = require('path');
var fs = require('fs');
var moment = require('moment')
var mongoosePaginate = require('mongoose-pagination');
var Publication = require('../models/publication');
var User = require('../models/user');
var Follow = require('../models/follow');
const follow = require('../models/follow');

function probando(req, res) {
    res.status(200).send({
        message: 'Holi desde Controlador de publicaciones'
    });

}

function savePublication(req, res) {
    var params = req.body;
    var publication = new Publication();

    if (!params.text) return res.status(200).send({ message: 'Debes enviar un texto.' });
    // console.log("Continúo con ejecución el savePublication");

    var publication = new Publication();
    publication.text = params.text;
    publication.file = null;
    publication.user = req.user.sub;
    publication.created_at = moment().unix();
    publication.save((err, publicationStored) => {
        if (err) return res.status(500).send({ message: 'Error al guardar la publicación' });
        if (!publicationStored) return res.status(404).send({ message: 'Error al guardar la publicación' });

        return res.status(200).send({ publication: publicationStored });
    });

}

function getPublications(req, res) {
    var page = 1;
    var itemsPerPage = 3;

    if (req.params.page) {
        page = req.params.page;
    }

    Follow.find({ user: req.user.sub }).populate('followed').exec((err, follows) => {
        if (err) return res.status(500).send({ message: 'Error al devolver los follows' });
        var followsClean = [];
        follows.forEach(element => {
            followsClean.push(element.followed);
        });
        followsClean.push(req.user.sub);

        // console.log(followsClean);
        Publication.find({ user: { '$in': followsClean } }).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
            if (err) return res.status(500).send({ message: 'Error al devolver publicaciones' });
            if (!publications) return res.status(404).send({ message: 'No hay publicaciones' });
            return res.status(200).send({ total_items: total, publications, pages: Math.ceil(total / itemsPerPage), itemsPerPage: itemsPerPage });

        });


    });

}

function getPublication(req, res) {
    var publicationId = req.params.id;
    Publication.findById(publicationId, (err, publication) => {
        if (err) return res.status(500).send({ message: 'Error al devolver publicación', error: err });
        if (!publication) return res.status(404).send({ message: 'Ops! La publicación no existe.' });
        return res.status(200).send({ publication });
    });

}

function deletePublication(req, res) {
    var publicationId = req.params.id;
    console.log(req.user.sub);
    Publication.find({ 'user': req.user.sub, '_id': publicationId }).remove((err, publication) => {
        if (err) return res.status(500).send({ message: 'Error al borrar publicación', error: err });
        if (!publication) return res.status(404).send({ message: 'No se ha borrado la publicación.' });
        return res.status(200).send({ publication });
    });
}

//Subir archivos de imagen/avatar de usuario.
function uploadImage(req, res) {
    var publicationId = req.params.id; //re


    if (req.files) {
        if (Object.keys(req.files).length > 0) {
            var file_path = req.files.image.path;
            var file_split = file_path.split('\\');
            var nameFinal = file_split[file_split.length - 1];
            var ext_split = nameFinal.split('\.');
            var file_ext = ext_split[ext_split.length - 1];
            console.log("file_path: " + file_path);
            console.log("file_split: " + file_split);
            console.log("nameFinal: " + nameFinal);
            console.log("ext: " + ext_split);
            console.log("file_ext: " + file_ext);

            /* if(userId != req.user.sub){
                 return removeFilesOfUploads(res, file_path, 'No tienes permiso para actualizar este usuario');
                // return res.status(500).send({message:'No tienes permiso para actualizar este usuario'});
             }*/

            if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' ||
                file_ext == 'gif') {

                Publication.findOne({ 'user': req.user.sub, '_id': publicationId }).exec((err, publication) => {

                    if (err) return res.status(500).send({ message: 'Error en la petición' });
                    if (publication) {
                        //Actualizar documento de publicación
                        Publication.findByIdAndUpdate(publicationId, { file: nameFinal }, { new: true, useFindAndModify: false }, (err, publicationUpdate) => {
                            if (err) return res.status(500).send({ message: 'Error en la petición' });
                            if (!publicationUpdate) return res.status(404).send({ message: 'No se ha podido actualizar la aplicación' });
                            return res.status(200).send({ publication: publicationUpdate });
                        });
                    } else {
                        return removeFilesOfUploads(res, file_path, 'No puedes editar esa publicación.');

                    }
                });


            } else {

                return removeFilesOfUploads(res, file_path, 'Ext no válida');
                // return res.status(500).send({message:'Formato de archivo inválido'});
            }

        } else {
            return res.status(200).send({ message: 'No se han subido archivos' });


        }
    } else {
        return res.status(200).send({ message: 'No se han subido archivos' });


    }
}

function removeFilesOfUploads(res, file_path, message) {
    fs.unlink(file_path, (err) => {
        return res.status(500).send({ message: message });

    });
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var pathFile = './uploads/publications/' + imageFile;
    if (fs.existsSync(pathFile)) {
        res.sendFile(path.resolve(pathFile));

    } else {
        res.status(200).send({ message: 'No existe la imagen' });

    }


}

module.exports = {
    probando,
    savePublication,
    getPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile

}