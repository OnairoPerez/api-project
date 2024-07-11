const {Schema, model, Types} = require('mongoose');

//Esquema del documento
const AuthSchema = new Schema({
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true
    },
    user: {
        type: Types.ObjectId,
        require: true,
        ref: 'User'
    }
});

module.exports = model('Auth', AuthSchema);


