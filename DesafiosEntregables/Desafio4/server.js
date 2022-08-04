const { Router } = require('express')
const express = require('express')

const app = express()
const PORT= process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static('public'))

const Contenedor = require("./contenedor");
const contenedor = new Contenedor('./productos.txt')

const routerProductos = Router()

routerProductos.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/indexForm.html')
})

routerProductos.post('/', (req, res)=>{
    const { name, price, thumbnail } = req.body
    contenedor.save({title: name, price: parseInt(price), thumbnail: thumbnail})
    res.send(`Producto guardado con exito!`)
})

routerProductos.get('/:id', (req, res)=>{
    let id = req.params.id
    contenedor.getById(id).then(data=>{
        if (data === null){
            res.send("No se econtro el producto!")
        }
        else{
           res.send(JSON.stringify([data], null, 2))
        }
        
    })
    
} )


routerProductos.put('/:id', (req,res)=>{
    let id = req.params.id
    let { title, price, thumbnail} = req.body
    contenedor.updateById({title: title, price: price, thumbnail: thumbnail , id: parseInt(id)})
})


routerProductos.delete('/:id', (req,res)=>{
    let id = req.params.id
    contenedor.deleteById(id)
})


app.use('/api/productos', routerProductos)

app.listen(PORT, err =>{
    if (err) throw err
    console.log(`Escuchando el puerto ${PORT}`)
})