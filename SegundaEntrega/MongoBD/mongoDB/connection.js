const mongoose = require('mongoose')

//mongodb+srv://PedroMondino:141216Pepe@cluster0.rgnja9t.mongodb.net/test
//mongodb+srv://PedroMondino:141216Pepe@cluster0.rgnja9t.mongodb.net/?retryWrites=true&w=majority
const connectDB = async () =>{
    try {
        const url = process.env.MONGODB_CONNECT
        await mongoose.connect(url ,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Database Connected!')
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB