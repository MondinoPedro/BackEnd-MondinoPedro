const express = require('express')
const {Router} = express
const bodyParser = require('body-parser')

var Admin = require("firebase-admin");
var serviceAccount = require("./coder-backend-53434-firebase-adminsdk-dk7r5-d43b55493b.json");

Admin.initializeApp({
  credential: Admin.credential.cert(serviceAccount)
});




const {Server: HttpServer} = require('http')
const {Server: IoServer} = require('socket.io')

const ContenedorProd = require('./Contenedores/contenedorProductos')
const contenedorProductos = new ContenedorProd

const ContenedorCart = require('./Contenedores/contenedorCarritos')
const contenedorCarritos = new  ContenedorCart

const app = express()

const httpServer = new HttpServer(app)
const io = new IoServer(httpServer)

let admin = true


const routerProductos = Router()
const routerCarrito = Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))


io.on('connect', socket=>{
    console.log('Usuario conectado!')
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
    contenedorProductos.getAllProd().then(data=>{
        const productos=[]
        data.map(prod=>{
            productos.push(prod.data())
        })
        io.on('connect', socket=>{
            socket.emit('envio-listaProd', productos)
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
            contenedorProductos.saveProduct({title: name, price: parseInt(price), thumbnail: thumbnail, stock: parseInt(stock), code: code, timestamp: Date.now().toLocaleString()})
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
    contenedorProductos.getById(id).then(prod=>{
        if (prod===null){
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
    .catch(err=>{console.log(err)})
})

       




routerProductos.put('/:id', (req,res)=>{
    if(admin === true){
        let id = req.params.id
        const { title, price, thumbnail, stock, code } = req.body
        contenedorProductos.updateById({title: title, price: parseInt(price), thumbnail: thumbnail, stock: parseInt(stock), code: code, timestamp: Date.now().toLocaleString()}, id)
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
        contenedorProductos.deleteById(id)
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
    contenedorCarritos.getAllCarts().then(data=>{
        io.on('connect', socket =>{
            socket.emit('envio-listaCart', data)
        }) 
    res.sendFile(__dirname + '/public/listado/listadoCart.html')
    }) 
    
})

routerCarrito.post('/', (req,res)=>{
    let productos = []
    contenedorCarritos.save({timestamp: Date.now().toLocaleString(), productos: productos})
    res.send('<h1>Carrito creado correctamente! </h1>')
})

routerCarrito.delete('/:id', (req,res)=>{
    let id = req.params.id
    contenedorCarritos.deleteById(id)
})

routerCarrito.get('/:id/productos', async (req,res)=>{
    let id = req.params.id
    contenedorCarritos.getById(id).then(cart=>{
            if(cart===null){
            res.send(`<h3>El carrito de id: ${id} no existe! </h3>`)
            }else{
            let productos= cart.data.productos.map(prod => {
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
                <h3>Carrito: ${cart.id}</h3>
                <h3>TimestampCarrito: ${cart.data.timestamp}</h3>
                <h3>Productos: </h3>
                ${productos}
                <br>
                <form class="input-container" method="POST">
                <input type="string" name="idProd" placeholder="Id del producto a agregar"/>
                    <input type="submit" value="Agregar producto">
                </form> 
            
                `)
            }
        })
        
    
        
})

routerCarrito.post('/:id/productos', (req,res)=>{
    contenedorProductos.getById(req.body.idProd).then(producto=>{
            contenedorCarritos.getById(req.params.id).then(carrito=>{
                    contenedorCarritos.saveProduct(carrito, producto)
                    res.send(`<h3>Producto de id:</h3> ${req.body.idProd} <h3>Agregado correctamente al carrito de id:</h3> ${req.params.id}`)
                })
        
    })
})

routerCarrito.delete('/:id/productos/:idProd', (req,res)=>{
        const {id, idProd} = req.params
        contenedorProductos.getById(idProd).then(prodDel=>{
                contenedorCarritos.delProduct(id, prodDel)
        })
    	
})    



app.use('/api/carritos', routerCarrito)
app.use('/api/productos', routerProductos)


httpServer.listen(8080, err =>{
    if (err){
        console.log(err)
    }
    else{
        console.log('Echuchando en el puerto 8080')
    }
})