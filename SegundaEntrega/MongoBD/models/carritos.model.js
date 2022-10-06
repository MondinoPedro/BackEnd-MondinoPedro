const mongoose = require('mongoose')


const CarritosSchema = new mongoose.Schema({
    timestamp:{
        type: String,
        required: true,
        trim: true,
        max: 50
    },
    productos:{
        type: Array,
    }
})

module.exports = mongoose.model('Carritos', CarritosSchema)