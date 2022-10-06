const mongoose = require('mongoose')

const ProductosSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        max: 50,
        unique:true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,

    },
    thumbnail: {
        type: String,
        required: true,
        trim: true,
        max: 50
    },
    stock:{
        type: Number,
        required: true,
        trim: true,
    },
    code:{
        type: String,
        required: true,
        trim: true,
        max:50,
        unique: true,
    }, 
    timestamp:{
        type: String,
        required: true,
        trim: true,
        max: 50
    },
    
})

module.exports = mongoose.model('Productos', ProductosSchema)