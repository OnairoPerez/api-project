const {Schema, model} = require('mongoose');

//Esquema del documento
const CategorySchema = new Schema({
    name: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    value: {
        type: String,
        require: true
    }
});

module.exports = model('Categories', CategorySchema);