const lib = (() => {
    const shelf = []

    const librosID = Object.keys(localStorage)
    for (const libro of librosID) {
        if (!/^ref_/.test(libro)) continue
        shelf.unshift(JSON.parse(localStorage.getItem(libro)))
    }

    const index = () => localStorage.length
    const add = libro => shelf.unshift(libro)
    const update = (reference, updatedBook) => {
        const arrIndex = shelf.findIndex(book => book.bookID === reference)
        shelf[arrIndex] = updatedBook
        console.table(shelf)
    }
    const remove = reference => {
        const arrIndex = shelf.findIndex(book => book.bookID === reference)
        shelf.splice(arrIndex, 1)
    }
    const arrange = (by, order) => {
        if (by === 'title') shelf.sort((a, b) => {
            return a.title.localeCompare(b.title)
        })
        if (by === 'author') shelf.sort((a, b) => {
            return a.author.localeCompare(b.author)
        })
        if (by === 'year') shelf.sort((a, b) => {
            return +a.year - b.year
        })

        if(order)shelf.reverse()
    }

    return { index, add, update, remove, arrange, shelf}
})()

class Book {
    bookID = `ref_${lib.index()}-${Math.floor(Math.random()*10000)}`

    constructor (title, author, img, description, extension, year, url, read) {
        this.title = title
        this.author = author
        this.img = !img ?
            `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/300/200`
            : `http://${img.replace(/^http(s:|:)\/\//, '')}`
        this.description = !description ? '...' : description
        this.extension = !extension ? '' : extension
        this.year = !year ? '' : year
        this.url = !url ? 
            `https://google.com/search?q=${title.replace(' ','+')}+${author.replace(' ','+')}`
            : `http://${url.replace(/^http(s:|:)\/\//, '')}`
        this.read = read || false 

        localStorage.setItem(this.bookID, JSON.stringify(this))
        lib.add(this)
    }

    edit (editedBook_OBJ) {
        for (const attribute in editedBook_OBJ) {
            if(!(attribute in this)) continue
            this[attribute] = editedBook_OBJ[attribute]
        }
        localStorage.setItem(this.bookID, JSON.stringify(this))
        lib.update(this.bookID, this)
    }

    delete () {
        localStorage.removeItem(this.bookID)
        lib.remove(this.bookID)
    }
}

// Navbar
// Habilitar modal para la creación de nuevos libros
// habilitar la ordenada de los libros


// Habilitar el modal para la creación o carga de un nuevo libro

// Lib
// Crear las fichas a partir de la libreria
// habilitar funcionalidad de edicion
//
const book1 = new Book(
    "Matadero 5",
    "test_K. Vonnegut",
    "http://nidodelibros.com/wp-content/uploads/2023/02/9780440180296.jpeg",
    "Chronicles a soldier's time-jumping journey through war, trauma, and surreal alien experiences.",
    "255",
    "1969",
    "http://nidodelibros.com/producto/slaughterhouse-five/",
    "true"
)
const book2 = new Book(
    "El Artesano",
    "test_Richard Sennett",
    "http://www.anagrama-ed.es/uploads/media/portadas/0001/26/52fd64b30c776d826b4b640a46dfff9c971a7ab7.jpeg",
    "El artesano de Sennett aboga por la excelencia, conexión con el trabajo y el valor del proceso en la era moderna.",
    "360",
    "2008",
    "http://www.anagrama-ed.es/libro/compactos/el-artesano/9788433960917/CM_768",
    "true"
)

console.table(lib.shelf)
