const server = io()

server.on('connect', ()=>{
    console.log('Usuario conectado')
})