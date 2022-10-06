const carritos = require('../models/carritos.model')


class ContenedorCart{
    constructor(){
        
    }

    async getAll(){
        const data = await carritos.find()
        return data
    }

    async save(obj){
        const carrito = new carritos({
            timestamp: obj.timestamp,
            productos: obj.productos        
        })
        await carrito.save()
    }

    async deleteById(id){
        await carritos.deleteOne({_id:id})
    }

    async getById(id){
        const data= await carritos.find({_id:id})
        return data
    }

    async saveProduct(carrito, producto){
        await carritos.updateOne({_id:carrito._id}, {$addToSet:{productos:producto}})
       
        
    }

    async delProduct(id, produDel){
        const carritoAMod= await carritos.find({_id:id})
        carritoAMod.forEach(cart=>{
            let exist = false
            for (let i = 0; i < cart.productos.length; i++) {
                if (cart.productos[i].title === produDel.title){
                    cart.productos.splice(i,1)
                    cart.save()
                    exist=true
                }
            }
            if (exist===true){
                console.log('Producto eliminado correctamente!')
            }else{
                console.log('El producto no se encuentra en el carrito!')
            }
        })
    }

}
module.exports = ContenedorCart