//02.02.2021
'use strict'
var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function probando(req, res){
    return res.status(200).send({message:"Hola desde message"});
}

function saveMessage(req, res){
    var params = req.body;

    if(!params.text || !params.receiver){
        return res.status(200).send({message:"Envía los campos necesarios."});
    }else{
        var message = new Message();
        message.emitter= req.user.sub;
        message.receiver = params.receiver;
        message.text = params.text;
        message.createdAt = moment().unix();
        message.viewed = "false";
        message.save((err, messageStored)=>{
            if(err) return res.status(500).send({message:'Error en la petición'});
            if(!messageStored) return res.status(404).send({message:'Error al enviar el mensaje'});
    
            return res.status(200).send({message:messageStored});
        });

    }

}

function getReceivedMessages(req, res){
    var userId = req.user.sub;
    var page =  1;
    var itemsPerPage = 2;
    if(req.params.page){
        page = req.params.page;
    }
    //Populate pasando los campos que queremos
    Message.find({receiver: userId}).populate('emitter', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!messages) return res.status(404).send({message:'No hay mensajes.'});
        
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages: messages
        });

    });
}

function getEmittedMessages(req, res){
    var userId = req.user.sub;
    var page =  1;
    var itemsPerPage = 2;
    if(req.params.page){
        page = req.params.page;
    }
    //Populate pasando los campos que queremos
    Message.find({emitter: userId}).populate('emitter receiver', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!messages) return res.status(404).send({message:'No hay mensajes.'});
        
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages: messages
        });

    });
}

function getUnviewedMessagesCOMPLETOS(req, res){
    var userId = req.user.sub;
    var page =  1;
    var itemsPerPage = 2;
    if(req.params.page){
        page = req.params.page;
    }

    Message.find({receiver: userId, viewed:"false"}).populate('emitter', 'name surname _id nick image').paginate(page, itemsPerPage, (err, messages, total)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        if(!messages) return res.status(404).send({message:'No hay mensajes.'});
        
        return res.status(200).send({
            total: total,
            pages: Math.ceil(total/itemsPerPage),
            messages: messages
        });

    });
}

function getUnviewedMessages(req, res){
    var userId = req.user.sub;
    Message.count({receiver: userId, viewed:"false"}).exec((err, count)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        return res.status(200).send({
            'unviewed': count
        });

    });
}

//Actualiza todos los no leídos como leídos
function setViewedMessages(req, res){
    var userId = req.user.sub;
    Message.updateMany({receiver:userId, viewed: "false"}, {viewed:"true"}, (err, messagesUpdate)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        return res.status(200).send({messages: messagesUpdate});
    })
}

//Marcar todos los leídos como no leídos
function setAsUnViewedMessages(req, res){
    var userId = req.user.sub;
    Message.updateMany({receiver:userId, viewed: "true"}, {viewed:"false"}, (err, messagesUpdate)=>{
        if(err) return res.status(500).send({message:'Error en la petición'});
        return res.status(200).send({messages: messagesUpdate});
    })
}

module.exports = {
    probando,
    saveMessage,
    getReceivedMessages,
    getEmittedMessages,
    getUnviewedMessages,
    setViewedMessages,
    setAsUnViewedMessages
}