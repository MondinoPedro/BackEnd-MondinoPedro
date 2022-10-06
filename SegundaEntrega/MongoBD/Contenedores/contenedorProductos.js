const productos = require('../models/productos.model')

class ContenedorProd{
    constructor(){
        
    }

    async getAll(){
        const data = await productos.find()
        return data
    }
    
    async save(obj){
            const producto = new productos({
                title: obj.title,
                price: obj.price,
                thumbnail: obj.thumbnail,
                stock: obj.stock,
                code: obj.code,
                timestamp: Date.now().toLocaleString(),
            })
            await producto.save()
    }
    async getById(id){
        const data = await productos.find({_id: id})
        return data
    }

    async updateById(obj){
        await productos.updateOne({_id:obj.id},{$set:{
            title: obj.title,
            price: obj.price,
            thumbnail: obj.thumbnail,
            stock: obj.stock,
            code: obj.code,
            timestamp: Date.now().toLocaleString(),}})
    }

    async deleteById(id){
        await productos.deleteOne({_id:id})
    }

}
module.exports = ContenedorProd