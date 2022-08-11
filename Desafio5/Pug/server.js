const express = require('express')
const app = express()

const PORT= 4000 || process.env.PORT

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.set('view engine', 'pug')
app.set('views', './views')

let productos = []

app.get('/', (req,res)=>{
    res.render('pages/index', {productoAgregado: null})
    
})

app.post('/', (req,res)=>{
    const {nombre, precio, descripcion} = req.body
    productos.push({'nombre': nombre, 'precio': precio, 'descripcion': descripcion})
    res.redirect('/productos')
})

app.get('/productos', (req,res)=> {
    res.render('pages/index', {productos:productos, productoAgregado: true})
})

app.post('/productos', (req,res)=>{
    res.redirect('/')
})

app.listen(PORT, err =>{
    if (err) throw err
    console.log(`Escuchando el puerto ${PORT}`)
})