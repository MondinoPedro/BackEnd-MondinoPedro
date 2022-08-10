const express = require('express')
const app = express()

const port = process.env.PORT || 4000

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.set('view engine', 'ejs')
app.set('views', './views')

let productos = []

app.get('/', (req, res)=>{
    res.render('pages/index', {productoAgregado:null})
})

app.post('/', (req, res)=>{
    const {nombre, precio, descripcion} = req.body
    productos.push({nombre: nombre, precio:precio, descripcion:descripcion})
    res.redirect('/productos')
})


app.get('/productos', (req,res)=>{
    res.render('pages/index', {productoAgregado: true, productos:productos})
})

app.post('/productos', (req,res)=>{
    res.redirect('/')
})

app.listen(port, err =>{
    if (err) throw new Error (`Error en el servidor escuchado ${err}`)
    console.log(`Servidor escuchando al puerto: ${port}`)
})