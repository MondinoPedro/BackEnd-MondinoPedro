var admin = require("firebase-admin");
const db = admin.firestore()
class ContenedorCart{
    constructor(){
        
    }
    
    async save(obj){
        const queryRes = await db.collection("carritos").orderBy("timestamp", "desc").limit(1).get()
            if(queryRes.docs.length === 0){
                try {
                    let id = 1
                    const doc = db.collection("carritos").doc(`${id}`)
                    doc.create({
                        timestamp: obj.timestamp,
                        productos: obj.productos
                    })  
                    console.log("creado")
                } catch (error) {
                console.log(error)
                }
            }else{
                queryRes.docs.map(cart=>{
                try {
                    let id = parseInt(cart.id) + 1
                    const doc = db.collection("carritos").doc(`${id}`)
                    doc.create({
                        timestamp: obj.timestamp,
                        productos: obj.productos
                    })  
                } catch (error) {
                console.log(error)
                }
            })
        }
    }


    async deleteById(id){
        const doc = db.collection("carritos").doc(`${id}`)
        await doc.delete()
        console.log(`Carrito eliminado correctamente!`)
    }   
    
    async getById(id){
        const queryRes= await db.collection("carritos").get()
        let carritoCorrecto = null
        queryRes.docs.map(cart=>{
            if(cart.id===id){
                carritoCorrecto= {id: cart.id, data: cart.data()}
            }
        })
        return carritoCorrecto
    }

    async getAllCarts(){
        
        const queryRead = await db.collection('carritos').get()
        const carritos=[]
        queryRead.docs.map(cart=>{
            carritos.push({id: cart.id, data: cart.data()})
        })
        return carritos
    }


    async saveProduct(carrito, producto){
        const doc = db.collection("carritos").doc(`${carrito.id}`)
        let arrayAgregar=carrito.data.productos
        arrayAgregar.push(producto)
        await doc.update({
            timestamp: carrito.data.timestamp,
            productos: arrayAgregar
        })
    }

    async delProduct(id, prodDel){
        const queryRes = db.collection("carritos").doc(`${id}`).get()
        queryRes.then(carrito=>{
            let arrayFilter =carrito.data().productos
            let arrayNuevo= arrayFilter.filter(prod=>prod.title !== prodDel.title)
            const doc =  db.collection("carritos").doc(`${id}`)
            doc.update({
                timestamp: carrito.data().timestamp,
                productos: arrayNuevo
            })
            console.log('Producto eliminado correctamente!')
        })
    }
    
}
module.exports = ContenedorCart