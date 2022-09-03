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
            if (nuevoProducto.title === undefined){
                console.log(`El Carrito se guardo con el id: ${dataParse.length + 1}`)
            }else{
                console.log(`El Producto se guardo con el id: ${dataParse.length + 1}`)
            }
            
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
                if (parseInt(id) === dataParse[i].id) {
                    productoCorrecto = dataParse[i]
                    idCorrecto = true
                }
            }
            if (idCorrecto){
                return productoCorrecto
            }
            else{
                return null
            }
        } 
        catch (err){
            console.log(err)
        }
    }

    async updateById(obj){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8') 
            let dataParse = await JSON.parse(data) 
            let prodEncontrado = false
            for (let i = 0; i < dataParse.length; i++) {
                if( dataParse[i].id === parseInt(obj.id) ){
                    dataParse[i]=obj
                    prodEncontrado = true
                }   
            }
            if (prodEncontrado === true){
                await fs.promises.writeFile(this.rutaArch, JSON.stringify([ ...dataParse], null, 2))
                console.log(`Producto de id = ${obj.id} actualizado correctamente. `)
            }
            else{
                console.log("Producto no encontrado, no existe!")
            }
            
        } catch (err) {
            console.log(err)
        }
        
    }

    async getAll(){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            return data
            
        } catch (err) {
            console.log(err)
        }
        
    }

    async getRandom(){
        try{
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)

            function getRandomInt(max) {
                return Math.floor(Math.random() * max);
              }
              
            let numMax = dataParse.length
            let numRandom = getRandomInt(numMax)
            return this.getById(numRandom + 1)
        }
        catch(err){
            console.log(err)
        }
    }

    async addProduct(id, producto){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)
            console.log(dataParse)
            for (let i = 0; i < dataParse.length; i++) {
                if( dataParse[i].id === parseInt(id) ){
                    dataParse[i].productos.push(producto)
                    
                }   
            }
            await fs.promises.writeFile(this.rutaArch, JSON.stringify( dataParse, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    async delProduct(id, producto){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)
            for (let i = 0; i < dataParse.length; i++) {
                if( dataParse[i].id === parseInt(id) ){
                    dataParse[i].productos = dataParse[i].productos.filter(prod => prod.id !== producto.id)
                    
                }   
            }
            await fs.promises.writeFile(this.rutaArch, JSON.stringify( dataParse, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    async deleteById(id){
        try {
            let data = await fs.promises.readFile(this.rutaArch, 'utf-8')
            let dataParse = JSON.parse(data)
            let exists = false
            let title = undefined
            for (let i = 0; i < dataParse.length; i++) {
                title = dataParse[i].title
                if (dataParse[i].id === parseInt(id)){
                    exists = true
                    title = dataParse[i].title
                }    
            }
            if (exists === true){
               let nuevoArrayProductos = dataParse.filter( producto => producto.id !== parseInt(id))
                await fs.promises.writeFile(this.rutaArch, JSON.stringify([ ...nuevoArrayProductos], null, 2))
                if (title === undefined){
                    console.log(`Carrito de id = ${id} eliminado correctamente. `) 
                }else{
                    console.log(`Producto de id = ${id} eliminado correctamente. `) 
                }
                
            }
            else {
                if (title === undefined){
                    console.log(`El carrito de id = ${id} ya fue eliminado o no existe. `)
                }else{
                    console.log(`El producto de id = ${id} ya fue eliminado o no existe. `)
                }
                
            }
            
            
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