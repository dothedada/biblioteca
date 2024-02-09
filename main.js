const lib = (() => {
    const shelf = []

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
    const find = id => shelf[shelf.findIndex(book => book.id === id)]

    return { index, add, update, remove, arrange, find, shelf}
})()

class Book {
    constructor (title, author, img, description, extension, year, url, read, id = false) {
        this.title = title
        this.author = author
        this.img = img ? img : `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/300/200`
        this.description = description ? description : '...' 
        this.extension = extension ? extension : '' 
        this.year = year ? year : ''
        this.url = url ? url : `https://google.com/search?q=${title.replace(' ','+')}+${author.replace(' ','+')}`
        this.read = read || false 
        if (!id) {
            this.id = `ref_${lib.index()}-${Math.floor(Math.random()*10000)}`
            localStorage.setItem(this.id, JSON.stringify(this))
        } else {
            this.id = id
        }

        lib.add(this)
    }

    edit (editedBook_OBJ) {
        for (const attribute in editedBook_OBJ) {
            if(!(attribute in this)) continue
            this[attribute] = editedBook_OBJ[attribute]
        }
        localStorage.setItem(this.id, JSON.stringify(this))
        lib.update(this.id, this)
    }

    delete () {
        localStorage.removeItem(this.id)
        lib.remove(this.id)
    }
}

const libInit = (() => {
    const booksIDs = Object.keys(localStorage)
    for (const bookID of booksIDs) {
        if (!/^ref_/.test(bookID)) continue
        const bookObject = JSON.parse(localStorage.getItem(bookID))
        new Book(
            bookObject.title, 
            bookObject.author, 
            bookObject.img,
            bookObject.description,
            bookObject.extension,
            bookObject.year, 
            bookObject.url,
            bookObject.read,
            bookID
        )
    }
    // lib.shelf.sort((a,b) => a.bookID.localeCompare(b.bookID))
    //     .splice(lib.shelf.findIndex(e => !e))
})()

// Ordenar los libros
for (const barBTN of document.querySelectorAll('#orderLibrary > label')) {
    barBTN.addEventListener('click', () => {
        console.log(document.querySelector('#order').checked)
        lib.arrange(document.querySelector('#order').checked, barBTN.getAttribute('for'))
    })
}


const createBookCard = book => {
    const library = document.querySelector('#libreria')

    const card = document.createElement('div')
    card.classList.add('ficha')
    card.setAttribute('data-read', book.read)
    card.setAttribute('data-id', book.id)

    const img = document.createElement('img')
    img.src = book.img
    img.alt = `Imagen de ${book.title}, escrito por ${book.author}`
    img.classList.add('ficha__imagen')

    const authorship = document.createElement('div')
    authorship.classList.add('ficha__autoria')
    const title = document.createElement('h2')
    title.textContent = book.title
    const author = document.createElement('p')
    author.textContent = book.author
    const bookData = document.createElement('small')
    if (book.extension) bookData.textContent += `${book.extension} páginas`
    if (book.extension && book.year) bookData.textContent += ' | '
    if (book.year) bookData.textContent += book.year
    authorship.appendChild(title)
    authorship.appendChild(author)
    authorship.appendChild(bookData)

    const bookResume = document.createElement('p')
    bookResume.classList.add('ficha__informacion')
    bookResume.textContent = book.description

    const buttons = document.createElement('div')
    buttons.classList.add('ficha__acciones')
    // Search Button
    const searchGoogleBTN = document.createElement('a')
    searchGoogleBTN.href = book.url
    searchGoogleBTN.target ='_blank'
    const searchGoogleBTN_SR = document.createElement('span')
    searchGoogleBTN_SR.classList.add('sr-only')
    searchGoogleBTN_SR.textContent = `Buscar ${book.title} en Google`
    const searchGoogleBTN_SVG = document.createElement('span')
    searchGoogleBTN_SVG.setAttribute('aria-hidden', true)
    searchGoogleBTN_SVG.classList.add('material-symbols-outlined')
    searchGoogleBTN_SVG.textContent = 'search'
    searchGoogleBTN.appendChild(searchGoogleBTN_SR)
    searchGoogleBTN.appendChild(searchGoogleBTN_SVG)
    buttons.appendChild(searchGoogleBTN)
    // Read button
    const readBTN = document.createElement('button')
    const read_SR = document.createElement('span')
    read_SR.classList.add('sr-only')
    read_SR.classList.add('ficha__leer')
    read_SR.textContent = 'marcar como libro por leer'
    const read_SVG = document.createElement('span')
    read_SVG.setAttribute('aria-hidden', true)
    read_SVG.classList.add('material-symbols-outlined')
    read_SVG.classList.add('ficha__leer')
    read_SVG.textContent = 'book_5'
    const toRead_SR = document.createElement('span')
    toRead_SR.classList.add('sr-only')
    toRead_SR.classList.add('ficha__leido')
    toRead_SR.textContent = 'marcar como libro leido'
    const toRead_SVG = document.createElement('span')
    toRead_SVG.setAttribute('aria-hidden', true)
    toRead_SVG.classList.add('material-symbols-outlined')
    toRead_SVG.classList.add('ficha__leido')
    toRead_SVG.textContent = 'menu_book'
    readBTN.appendChild(read_SR)
    readBTN.appendChild(read_SVG)
    readBTN.appendChild(toRead_SR)
    readBTN.appendChild(toRead_SVG)
    readBTN.addEventListener('click', function () {
        const bookID = this.closest('.ficha').getAttribute('data-id')
        let isRead = this.closest('.ficha').getAttribute('data-read')
        isRead = isRead === 'true' ? 'false' : 'true'
        lib.find(bookID).edit({ read: isRead })
        this.closest('.ficha').setAttribute('data-read', isRead)
    })
    buttons.appendChild(readBTN)
    // Edit button
    // delete button



    card.appendChild(img)
    card.appendChild(authorship)
    card.appendChild(bookResume)
    card.appendChild(buttons)

    library.appendChild(card)



}

for (const libro of lib.shelf) {
    console.log(libro.title)
    createBookCard(libro)
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
//     true
// )
// const book2 = new Book(
//     "La insoportable levedad del Ser",
//     "Milan Kundera",
//     "https://revistasantiago.cl/cms/wp-content/uploads/2023/07/kundera.webp",
//     "",
//     "360",
//     "1989",
//     "",
//     false
// )
