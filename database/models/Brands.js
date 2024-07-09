const { Schema, model } = require('mongoose');

//Esquema del documento
const Brand = new Schema({
    name: {
        type: String,
        require: true
    }
});

module.exports = model('Brand', Brand);