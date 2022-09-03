const { Router } = require('express')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const PORT= process.env.PORT || 8080

const {Server: HttpServer, Server } = require('http')
const {Server: IoServer} = require('socket.io')

const httpServer = new HttpServer(app)
const io = new IoServer(httpServer)


app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static('public'))


let admin = false

const Contenedor = require("./contenedor");
const contenedorProd = new Contenedor('./productos.txt')
const contenedorCart = new Contenedor('./carritos.txt')

const routerProductos = Router()
const routerCarrito = Router()


io.on('connect', socket=>{

    console.log('Usuario conectado')
})

app.get('/', (req,res)=>{
    res.send(`<h1>Rutas implememntadas:</h1>
    /api/productos <br>
    /api/productos:id <br>
    /api/productos/agregar <br>
    /api/carritos <br>
    /api/carritos/:id <br>
    /api/carritos/:id/productos<br>
    /api/carritos/:id/productos/:idProd`)
})

/*CONFIGURACION DEL ROUTERPRODUCTOS*/

routerProductos.get('/', (req, res)=>{
    contenedorProd.getAll().then(data=>{
        io.on('connect', socket =>{
            socket.emit('envio-listaProd', data)
        }) 
    res.sendFile(__dirname + '/public/listado/listadoProd.html')
    })   
    
})

routerProductos.get('/agregar', (req,res)=>{
       res.sendFile(__dirname + '/public/form/indexForm.html') 

    
})

routerProductos.post('/agregar', (req, res)=>{
        if (admin === true){
            const { name, price, thumbnail, stock, code } = req.body
            contenedorProd.save({title: name, price: parseInt(price), thumbnail: thumbnail, stock: parseInt(stock), code: code, timestamp: Date.now().toLocaleString()})
            res.send('<h1>Producto agregado correctamente! </h1>')
        }else{
            res.send(`{
            Error: 1,
            Ruta: 'http://localhost:8080/api/productos/agregar',
            Metodo: 'POST'
        }`)
        }
    
})

routerProductos.get('/:id', (req, res)=>{
    let id = req.params.id
    contenedorProd.getById(id).then(prod=>{
        if (prod === null){
            res.send("<h2>No se econtro el producto!</h2>")
        }
        else{
            res.send(`
                <h2>Producto encontrado: </h2>
                <b>Nombre:</b> ${prod.title}
                <b> - Precio: $</b>${prod.price}
                <b> - Codigo:</b> ${prod.code}
                <b> - Stock: </b>${prod.stock}
                <b> - Timestamp: </b>${prod.timestamp}
                <b> - Url:</b> ${prod.thumbnail}
            `)
        }
        
    })
    
} )


routerProductos.put('/:id', (req,res)=>{
    if(admin === true){
        let id = req.params.id
        const { title, price, thumbnail, stock, code } = req.body
        contenedorProd.updateById({title: title, price: parseInt(price), thumbnail: thumbnail, stock: parseInt(stock), code: code, timestamp: Date.now().toLocaleString(), id: parseInt(id)})
    }
    else{
            res.send(`{
            Error: 1,
            Ruta: 'http://localhost:8080/api/productos/:id',
            Metodo: 'PUT'
        }`)
    }
})


routerProductos.delete('/:id', (req,res)=>{
    if(admin === true){
        let id = req.params.id
        contenedorProd.deleteById(id)
    }    
    else{
        res.send(`{
            Error: 1,
            Ruta: 'http://localhost:8080/api/productos/:id',
            Metodo: 'DELETE'
        }`)
    }
})

/*CONFIGURACION DEL ROUTERCARRITO */


routerCarrito.get('/', (req, res)=>{
    contenedorCart.getAll().then(data=>{
        io.on('connect', socket =>{
            socket.emit('envio-listaCart', data)
        }) 
    res.sendFile(__dirname + '/public/listado/listadoCart.html')
    })   
    
})

routerCarrito.post('/', (req,res)=>{
    let productos = []
    contenedorCart.save({timestamp: Date.now().toLocaleString(), productos: productos})
    res.send('<h1>Carrito creado correctamente! </h1>')
})

routerCarrito.delete('/:id', (req,res)=>{
    let id = req.params.id
    contenedorCart.deleteById(id)
})

routerCarrito.get('/:id/productos', async (req,res)=>{
    let id = req.params.id
    contenedorCart.getById(id).then(data=>{
        if(data===null){
            res.send(`<h3>El carrito de id: ${id} no existe! </h3>`)
        }else{
            let productos= data.productos.map(prod => {
                return `<br>
                    <b>Nombre:</b> ${prod.title}
                    <b> - Precio: $</b>${prod.price}
                    <b> - Codigo:</b> ${prod.code}
                    <b> - Stock: </b>${prod.stock}
                    <b> - TimestampProducto: </b>${prod.timestamp}
                    <b> - Url:</b> ${prod.thumbnail}<br>
                `
            })
            res.send(`
                <h3>Carrito: ${data.id}</h3>
                <h3>TimestampCarrito: ${data.timestamp}</h3>
                <h3>Productos: </h3>
                ${productos}
                <form class="input-container" method="POST">
                <input type="number" name="idProd" placeholder="Id del producto a agregar"/>
                    <input type="submit" value="Agregar producto">
                </form> 
            
                `)
        }
    })
        
    })

routerCarrito.post('/:id/productos', (req,res)=>{
    const {idProd} = req.body
    const {id} = req.params
    contenedorCart.getById(id).then(cart=>{
        contenedorProd.getById(idProd).then(prod=>{
            if(prod === null){
                res.send(`<h3>No se puede agregar el producto porque no existe un producto con id: ${idProd}</h3>`)
            }else{
                contenedorCart.addProduct(id, prod)
                res.send(`<h3>Producto de id: ${idProd} agregado correctamente al carrito de id: ${id}</h3>`)
                
            }   
        })
    })

})

routerCarrito.delete('/:id/productos/:idProd', (req,res)=>{
    const {id, idProd} = req.params
    let exists = false
    contenedorCart.getById(id).then(cart=>{
        cart.productos.forEach(prod => {
            if (prod.id === parseInt(idProd)){
                exists = true
                contenedorCart.delProduct(id, prod)
            }
        });
        if(exists){
            console.log(`El producto de id: ${idProd} fue eliminado correctamente! `)
        }else{
            console.log(`El producto de id: ${idProd} no se encuentra en el carrito o ya fue eliminado! `)
        }
    })   
})


app.use('/api/carritos', routerCarrito)
app.use('/api/productos', routerProductos)

httpServer.listen(PORT, err =>{
    if (err) throw err
    console.log(`Escuchando el puerto ${PORT}`)
})