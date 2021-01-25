//30.12.2020
//BeatrixSwain
'use strict'
var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'D4nt33s4zr43lY4m44B34tr1xSw41n_43v3r';
exports.createToken = function(user){
    var payload = {
        sub:user._id,
        name:user.name,
        surname:user.surname,
        nick:user.nick,
        email:user.email,
        rol:user.role,
        image:user.image,
        iat:moment().unix(),
        iat:moment().add(30, 'days').unix()
    };

    return jwt.encode(payload, secret);
};