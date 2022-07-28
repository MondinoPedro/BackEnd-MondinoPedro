const express = require('express')
const app = express()

const Contenedor = require("./contenedor");

const contenedor = new Contenedor('./productos.txt')


app.get('/productos', (req, res) => {
    const data = contenedor.getAll()
        data.then(val => {
            res.send(`Nuestra lista de productos es la siguiente:

            `  + val) 
        })
})

app.get('/productoRandom', (req, res) => {
    let produRandom = contenedor.getRandom()
        produRandom.then(val => {
            res.send(`Producto Random:

            `  + JSON.stringify([val], null, 2)) 
        })
})


const PORT = 8080

const server = app.listen(PORT, ()=>{
    console.log(`El servidor se encuentra activo en el puerto: ${PORT}`)
})