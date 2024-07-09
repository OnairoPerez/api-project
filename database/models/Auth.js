const {Schema, model} = require('mongoose');

//Esquema del documento
const AuthSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = model('Auth', AuthSchema);


