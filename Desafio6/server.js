const express = require('express')
const app = express()
const {Server: HttpServer} = require('http')
const {Server: IoServer } = require('socket.io')

const PORT= 4000 || process.env.PORT

const httpServer= new HttpServer(app)
const io = new IoServer(httpServer)

const handlebars = require('express-handlebars')

app.engine(
    'hbs',
    handlebars.engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/pages',
        partialsDir:__dirname + '/views/partials',
        
    })
)

app.use(express.json())
app.use(express.urlencoded({ extended : true }))
app.use(express.static('/views/public'))

app.set('view engine', 'hbs')
app.set('views', './views')

let productos = []

app.get('/', (req,res)=>{
    res.render('pages/index', {productos: productos})
    
})

app.post('/', (req,res)=>{
    const {nombre, precio, descripcion} = req.body
    productos.push({'nombre': nombre, 'precio': precio, 'descripcion': descripcion})
    res.redirect('/')
})


io.on('connect', (socket)=>{
    console.log('Usuario conectado...')
})

httpServer.listen(PORT, err =>{
    if (err) throw err
    console.log(`Escuchando el puerto ${PORT}`)
})