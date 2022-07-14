
class usuario {
    constructor(nombre, apellido, libros, mascotas) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.libros = libros;
        this.mascotas = mascotas;
    }

    getFullName(){
        console.log(`El nombre del usuario es: ${this.nombre}.
        `)
    }

    addMascota(nuevaMascota){
        console.log(`El array de mascotas previo a añadir la nueva mascota es: ${this.mascotas}.
        `)
        this.mascotas.push(nuevaMascota)
        console.log(`El array de mascotas actualizado es: ${this.mascotas}.
        `)
    }

    addBook(nombre, autor){
        const libro1 = {
            nombreLibro: nombre,
            autorLibro: autor,
        }
        this.libros.push(libro1)
    }

    getBook(){
        const booksNames = []

        for (let i = 0; i < this.libros.length; i++) {
            booksNames.push(this.libros[i].nombreLibro)
        }
        if (this.libros.length === 0){
            console.log(`No hay libros dentro del array. 
            `)
        }
        else{
            console.log(booksNames)  
        }
    }
}

const usu1 = new usuario("Pedro", "Mondino", [], ["Paco", " Ciro", " Pampa"])

usu1.getFullName()

usu1.addMascota(" Chape")

usu1.addBook("El Principito", "Antoine de Saint-Exupéry")

usu1.addBook("Piter Pan", "James Matthew Barrie")

usu1.getBook()