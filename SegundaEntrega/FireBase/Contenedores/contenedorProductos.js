var admin = require("firebase-admin");
const db = admin.firestore()
class ContenedorProd{
    constructor(){
        
    }
    
    async getAllProd(){
        const queryRes = await db.collection("productos").get()
        return queryRes.docs

    }
    
    async saveProduct(obj){
        const queryRes = await db.collection("productos").orderBy("timestamp", "desc").limit(1).get()
        queryRes.docs.map(prod=>{
            if(queryRes.docs.length === 0){
                try {
                    let id = 1
                    const doc = db.collection("productos").doc(`${id}`)
                    doc.create({
                        title: obj.title,
                        price: obj.price,
                        thumbnail: obj.thumbnail,
                        stock: obj.stock,
                        code: obj.code,
                        timestamp: obj.timestamp,
                    })  
                } catch (error) {
                console.log(error)
                }
            }else{
                try {
                    let id = parseInt(prod.id) + 1
                    const doc = db.collection("productos").doc(`${id}`)
                    doc.create({
                        title: obj.title,
                        price: obj.price,
                        thumbnail: obj.thumbnail,
                        stock: obj.stock,
                        code: obj.code,
                        timestamp: obj.timestamp,
                    })  
                } catch (error) {
                console.log(error)
                }
            }
        })
   
          
        
    }
    async updateById(obj, id){
        const doc = db.collection("productos").doc(`${id}`)
        await doc.update({
            title: obj.title,
            price: obj.price,
            thumbnail: obj.thumbnail,
            stock: obj.stock,
            code: obj.code,
            timestamp: obj.timestamp,
        })
    }


    async deleteById(id){
        const doc = db.collection("productos").doc(`${id}`)
        await doc.delete()
        console.log(`Item eliminado correctamente.`)
    }   
    

    async getById(id){
        const queryRes= await db.collection("productos").get()
        let productoCorrecto = null
        queryRes.docs.map(prod=>{
            if(prod.id===id){
                productoCorrecto= prod.data()
            }
        })
        return productoCorrecto
    }
    
}
module.exports = ContenedorProd