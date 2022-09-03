const server = io()

server.on('Enviar-Productos', data=>{
    console.log(data)
})
server.on('connect', ()=>{
    console.log('Usuario conectado')
})