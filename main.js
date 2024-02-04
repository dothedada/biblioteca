// Añadir nuevos elementos en la librería
// Editar elementos en la librería
// borrar elementos en la libreria
//
// Renderizar elementos en el DOM
// Conectar formulario y ficahas del DOM con
const lib = (() => {
    const shelf = []

    const index = () => localStorage.length

    const load = () => {
        const librosID = Object.keys(localStorage)

        for (const libro of librosID) {
            if (!/^libro_/.test(libro)) continue
            shelf.unshift(JSON.parse(localStorage.getItem(libro)))
        }
    }
    load()

    const add = libro => {
        shelf.unshift(libro)
    } 

    return { index, load }
})()

class Book {
    index = `libro_${lib.index()}-${Math.floor(Math.random()*10000)}`

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

        const { index, ...book } = this
        localStorage.setItem(index, JSON.stringify(book))
    }

    edit (editedBook_OBJ) {
        for (const attribute in editedBook_OBJ) {
            if(!(attribute in this)) continue
            this[attribute] = editedBook_OBJ[attribute]
        }
        const { index, ...book } = this
        localStorage.setItem(index, JSON.stringify(book))
    }

    remove () {
        localStorage.removeItem(this.index)
    }
}

const book1 = new Book(
    "Matadero 5",
    "K. Vonnegut",
    "http://nidodelibros.com/wp-content/uploads/2023/02/9780440180296.jpeg",
    "Chronicles a soldier's time-jumping journey through war, trauma, and surreal alien experiences.",
    "255",
    "1969",
    "http://nidodelibros.com/producto/slaughterhouse-five/",
    "true"
)
const book2 = new Book(
    "Richard Sennett",
    "El Artesano",
    "http://www.anagrama-ed.es/uploads/media/portadas/0001/26/52fd64b30c776d826b4b640a46dfff9c971a7ab7.jpeg",
    "El artesano de Sennett aboga por la excelencia, conexión con el trabajo y el valor del proceso en la era moderna.",
    "360",
    "2008",
    "http://www.anagrama-ed.es/libro/compactos/el-artesano/9788433960917/CM_768",
    "true"
)
