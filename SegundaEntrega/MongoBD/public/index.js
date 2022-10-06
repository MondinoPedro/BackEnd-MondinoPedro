const server = io().connect()




const renderProd = (productos) =>{
    let listado = document.getElementById('lista') 
    if (productos.length > 0){
           let html = productos.map(prod => {
        return `<li>
            <b>Nombre:</b> ${prod.title}
            <b> - Precio: $</b>${prod.price}
            <b> - Codigo:</b> ${prod.code}
            <b> - Stock: </b>${prod.stock}
            <b> - Timestamp: </b>${prod.timestamp}
            <b> - Url:</b> ${prod.thumbnail}
            </li><br>`
    })
    listado.innerHTML = html.join(' ')  
        
    }
    else{
        let html = `<h2>No hay productos en la lista!</h2>`
        listado.innerHTML = html
    }
    
};

const renderCart = (carritos) =>{
    let listado = document.getElementById('lista') 
    if (carritos.length > 0){ 
     let html = carritos.map(cart=>{
           if (cart.productos.length < 1){
            return `
            <h3>Carrito: ${cart._id}</h3>.
            <b>Productos:</b> El carrito no contiene productos.
            <br>`
           }else{
            let producto = cart.productos.map(prod=>{
                return `<li>
                <b>Nombre:</b> ${prod.title}
                <b> - Precio: $</b>${prod.price}
                <b> - Codigo:</b> ${prod.code}
                <b> - Stock: </b>${prod.stock}
                <b> - Timestamp: </b>${prod.timestamp}
                <b> - Url:</b> ${prod.thumbnail}
                </li><br>`
            })
            return `<h3>CARRITO: ${cart._id}</h3>
                    <b>Productos: </b><br><br>
                    ${producto}`
           }
     })
     listado.innerHTML = html.join(' ')   
    }
    
    else{
        let html = `<h2>No hay carritos!</h2>`
        listado.innerHTML = html
    }
    
}
     
        


server.on('envio-listaProd', data=>{
    renderProd(data)
})

server.on('envio-listaCart', data=>{
    renderCart(data)
})

server.on('connect', async ()=>{
    console.log('conectado')
})
