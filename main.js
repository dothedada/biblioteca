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
    }
    const remove = reference => {
        const arrIndex = shelf.findIndex(book => book.bookID === reference)
        shelf.splice(arrIndex, 1)
    }
    const arrange = (order, property) => {
        if (property === 'order') return shelf.reverse()
        shelf.sort((a, b) => {
            if (order) return a[property].localeCompare(b[property])
            return b[property].localeCompare(a[property])
        })
    }

    return { index, add, update, remove, arrange, shelf}
})()

class Book {
    bookID = `ref_${lib.index()}-${Math.floor(Math.random()*10000)}`

    constructor (title, author, img, description, extension, year, url, read) {
        this.title = title
        this.author = author
        this.img = img ? img : `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/300/200`
        this.description = description ? description : '...' 
        this.extension = extension ? extension : '' 
        this.year = year ? year : ''
        this.url = url ? url : `https://google.com/search?q=${title.replace(' ','+')}+${author.replace(' ','+')}`
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

// Ordenar los libros
for (const barBTN of document.querySelectorAll('#orderLibrary > label')) {
    barBTN.addEventListener('click', () => {
        console.log(document.querySelector('#order').checked)
        lib.arrange(document.querySelector('#order').checked, barBTN.getAttribute('for'))
    })
}

const modalBehavior = (() => {
    const modal = document.querySelector('#modalLibro')

    // Abrir Modal new
    for (const newBookBTN of document.querySelectorAll('.newBook')) {
        newBookBTN.addEventListener('click', () => {
            // cargar campo invisible con el id del libro
            // modal.querySelector('#bookID').setAttribute('value', 'carajillo')
            modal.showModal()
        })
    }
    
    // form Validation
    const validation = event => {
        const isValid = event.target.checkValidity()
        if (!isValid) {
            event.target.previousElementSibling.classList.remove('hidden')
            event.target.setAttribute('aria-invalid', !isValid)
        } else {
            event.target.previousElementSibling.classList.add('hidden')
            event.target.removeAttribute('aria-invalid')
        }
        console.log(document.querySelectorAll('[aria-invalid]').length)
    }
    for (const field of modal.querySelectorAll('input:not([type="checkbox"])')) {
        field.addEventListener('blur', validation)
        field.addEventListener('change', validation)
    }

    // Agregar o editar libro
    document.querySelector('#save').addEventListener('click', () => {
        if(document.querySelectorAll('[aria-invalid]').length) return

        if (!modal.querySelector('#bookID').value) {
            new Book(
                document.querySelector('#titulo').value,
                document.querySelector('#autora').value,
                document.querySelector('#imagen').value,
                document.querySelector('#sinopsis').value,
                document.querySelector('#extension').value,
                document.querySelector('#anno').value,
                document.querySelector('#web').value,
                document.querySelector('#leido').checked
            )
        } else {
            console.log('libro viejo')
        }
        modal.close()
    })

    document.querySelector('#cerrarModal').addEventListener('click', () => {
        modal.close()
    })
})()



// Habilitar el modal para la creación o carga de un nuevo libro

// Lib
// Crear las fichas a partir de la libreria
// habilitar funcionalidad de edicion
//
// const book1 = new Book(
//     "Matadero 5",
//     "test_K. Vonnegut",
//     "http://nidodelibros.com/wp-content/uploads/2023/02/9780440180296.jpeg",
//     "Chronicles a soldier's time-jumping journey through war, trauma, and surreal alien experiences.",
//     "255",
//     "1969",
//     "http://nidodelibros.com/producto/slaughterhouse-five/",
//     "true"
// )
// const book2 = new Book(
//     "La insoportable levedad del Ser",
//     "Milan Kundera",
//     "https://revistasantiago.cl/cms/wp-content/uploads/2023/07/kundera.webp",
//     "",
//     "360",
//     "1989",
//     "",
//     "false"
// )

console.table(lib.shelf)
