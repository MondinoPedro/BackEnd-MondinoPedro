const express = require('express')
const app = express()

const PORT= 4000 || process.env.PORT

const handlebars = require('express-handlebars')

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/pages',
        partialsDir:__dirname + '/views/partials'
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended : true }))

app.set('view engine', 'hbs')
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