const { Schema, model, Types } = require('mongoose');

//Esquema del documento
const ProductSchema = new Schema({
    web_id: {
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    img: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    purchased: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    category: {
        type: Types.ObjectId,
        ref: 'Categories',
        require: true
    },
    brand: {
        type: Types.ObjectId,
        ref: 'Brand',
        require: true
    }
});

module.exports = model('Product', ProductSchema);