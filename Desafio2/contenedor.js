

const fs = require('fs')

class Contenedor {
    constructor(rutaArch){
        this.rutaArch = rutaArch
    
    }
    async save(nuevoProducto) {
        try{
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)
            if(dataParse.length){
                nuevoProducto.id = dataParse.length + 1
                await fs.promises.writeFile(this.rutaArch, JSON.stringify( [...dataParse, nuevoProducto ], null, 2))
            }
            else{
                nuevoProducto.id = 1
                await fs.promises.writeFile(this.rutaArch, JSON.stringify([ nuevoProducto ], null, 2))
            }
            console.log(`El producto se guardo con el id: ${dataParse.length + 1}`)
        }
        catch(err){
            console.log(err)
        }
    }

    async getById(id){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')  
            let dataParse = JSON.parse(data)
            let idCorrecto = false
            let productoCorrecto = {}
            for (let i = 0; i < dataParse.length; i++) {
                if (id === dataParse[i].id) {
                    productoCorrecto = dataParse[i]
                    idCorrecto = true
                }
            }
            if (idCorrecto){
                console.log(productoCorrecto)
            }
            else{
                console.log(null)
            }
        } 
        catch (err){
            console.log(err)
        }
    }

    async getAll(){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let allData=(JSON.parse(data)) 
            console.log(allData)
        } catch (err) {
            console.log(err)
        }
        
    }

    async deleteById(id){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)
            let nuevoArrayProductos = dataParse.filter( producto => producto.id !== id)
            await fs.promises.writeFile(this.rutaArch, JSON.stringify([ nuevoArrayProductos], null, 2))
        } catch (err) {
            console.log(err)
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.rutaArch, "[]")
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = Contenedor