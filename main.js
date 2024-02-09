const lib = (() => {
    const shelf = []

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

    return { add, update, remove, arrange, find, shelf}
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
            this.id = `ref_${localStorage.length}-${Math.floor(Math.random()*10000)}`
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

const createBookCard = (book, edit = false) => {
    const library = document.querySelector('#libreria')
    const card = document.createElement('div')
    card.classList.add('ficha')
    card.setAttribute('data-read', book.read)
    card.setAttribute('data-id', book.id)

    // Display information
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
    authorship.append(title, author, bookData)
    const bookResume = document.createElement('p')
    bookResume.classList.add('ficha__informacion')
    bookResume.textContent = book.description

    // Buttons
    const buttons = document.createElement('div')
    buttons.classList.add('ficha__acciones')

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
    searchGoogleBTN.append(searchGoogleBTN_SR, searchGoogleBTN_SVG)

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
    readBTN.append(read_SR, read_SVG, toRead_SR, toRead_SVG)

    const editBTN = document.createElement('button')
    const edit_SR = document.createElement('span')
    edit_SR.classList.add('sr-only')
    edit_SR.textContent = 'Editar la información de este libro'
    const edit_SVG = document.createElement('span')
    edit_SVG.setAttribute('aria-hidden', true)
    edit_SVG.classList.add('material-symbols-outlined')
    edit_SVG.textContent = 'edit'
    editBTN.append(edit_SR, edit_SVG)

    const deleteBTN = document.createElement('button')
    const delete_SR = document.createElement('span')
    delete_SR.classList.add('sr-only')
    delete_SR.textContent = 'Borrar este libro'
    const delete_SVG = document.createElement('span')
    delete_SVG.setAttribute('aria-hidden', true)
    delete_SVG.classList.add('material-symbols-outlined')
    delete_SVG.textContent = 'delete'
    deleteBTN.append(delete_SR, delete_SVG)
    buttons.append(searchGoogleBTN, readBTN, editBTN, deleteBTN)

    // Assembly display
    card.append(img, authorship, bookResume, buttons)
    if (!edit) {
        library.insertBefore(card, library.querySelector('.newBook'))
    } else {
        library.insertBefore(card, library.querySelector(`[data-id=${edit}]`))
        card.nextElementSibling.remove()

    }

    // Buttons actions
    const bookOBJ = lib.find(buttons.parentElement.getAttribute('data-id'))
    readBTN.addEventListener('click', function() {
        let isRead = this.closest('.ficha').getAttribute('data-read')
        isRead = isRead === 'true' ? false : true
        bookOBJ.edit({ read: isRead })
        this.closest('.ficha').setAttribute('data-read', isRead)
    })
    editBTN.addEventListener('click', function() {
        document.querySelector('#bookID').value = bookOBJ.id
        document.querySelector('#titulo').value = bookOBJ.title
        document.querySelector('#autora').value = bookOBJ.author
        document.querySelector('#imagen').value = bookOBJ.img
        document.querySelector('#sinopsis').value = bookOBJ.description
        document.querySelector('#extension').value = bookOBJ.extension
        document.querySelector('#anno').value = bookOBJ.year
        document.querySelector('#web').value = bookOBJ.url
        document.querySelector('#leido').checked = bookOBJ.read 
        document.querySelector('#modalLibro').showModal()
    })
    deleteBTN.addEventListener('click', function() {
        if (window.confirm(`¿Realmente quieres eliminar ${bookOBJ.title} de la biblioteca?`)) {
            lib.find(this.closest('.ficha').getAttribute('data-id')).delete()
            this.closest('.ficha').remove()
        }
    })
}

const loadBooks = (() => {
    const booksIDs = Object.keys(localStorage).filter(e => e.includes('ref'))

    if (!booksIDs.length) {
        new Book(
            "Matadero 5",
            "test_K. Vonnegut",
            "http://nidodelibros.com/wp-content/uploads/2023/02/9780440180296.jpeg",
            "Chronicles a soldier's time-jumping journey through war, trauma, and surreal alien experiences.",
            "255",
            "1969",
            "http://nidodelibros.com/producto/slaughterhouse-five/",
            true
        )
        createBookCard(lib.shelf[0])
    }

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
        createBookCard(lib.shelf[0])
    }
})()

// Ordenar los libros
for (const barBTN of document.querySelectorAll('#orderLibrary > label')) {
    barBTN.addEventListener('click', () => {
        lib.arrange(document.querySelector('#order').checked, barBTN.getAttribute('for'))
        document.querySelectorAll('[data-id]').forEach(book => book.remove())
        lib.shelf.forEach(book => createBookCard(book))
    })
}

const modalBehavior = (() => {
    const modal = document.querySelector('#modalLibro')

    // Open Modal for new book
    for (const newBookBTN of document.querySelectorAll('.newBook')) {
        newBookBTN.addEventListener('click', () => {
            for (const input of modal.querySelectorAll('input')) {
                input.value = ''
            }
            modal.querySelector('#sinopsis').value = ''
            modal.querySelector('#leido').checked = false
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
    }
    for (const field of modal.querySelectorAll('input:not([type="checkbox"])')) {
        field.addEventListener('blur', validation)
        field.addEventListener('change', validation)
    }

    // Agregar o editar libro
    document.querySelector('#save').addEventListener('click', () => {
        if(document.querySelectorAll('[aria-invalid]').length) return
        const bookID = modal.querySelector('#bookID').value

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
            createBookCard(lib.shelf[0])
        } else {
            lib.find(bookID).edit({
                title : document.querySelector('#titulo').value,
                author : document.querySelector('#autora').value,
                img : document.querySelector('#imagen').value,
                description : document.querySelector('#sinopsis').value,
                extension : document.querySelector('#extension').value, 
                year : document.querySelector('#anno').value,
                url : document.querySelector('#web').value,
                read : document.querySelector('#leido').checked 
            })
            createBookCard(lib.shelf[lib.shelf.findIndex(b => b.id === bookID)], bookID)
        }
        modal.close()
    })

    document.querySelector('#cerrarModal').addEventListener('click', () => {
        document.querySelector('#bookID').value = ''
        modal.close()
    })
})()
