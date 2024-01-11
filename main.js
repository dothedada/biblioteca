const btnNuevoLibro = document.getElementById('nuevoLibro')
let btnNuevoLibroMain = document.querySelector('.nuevoLibroMain')
const modalLibro = document.getElementById('modalLibro')
const btnGuardarLibro = document.getElementById('guardarLibroNuevo')
const btnCerrarModal = document.getElementById('cerrarModal')
const displayLibros = document.getElementById('libreria')
const displayLibrosOrden = document.querySelectorAll('#ordenarBiblioteca input')
// elementos del formulario
const libroInformacion = document.querySelectorAll('#nuevoLibro input')
const libroDescripcion = document.querySelector('#nuevoLibro textarea')
const libroValidacion = document.querySelectorAll('#nuevoLibro .validacion')

// Creación del array que contiene la biblioteca
let indiceBiblioteca = localStorage.length
let indiceEdicion = '' // Cuando contiene un índice cambia el comportamiento de guardado
const biblioteca = []
const llaves = Object.keys(localStorage)
for(const llave of llaves) {
    if(!/^libro_/.test(llave)) continue
    biblioteca.unshift(JSON.parse(localStorage.getItem(llave)))
}

function Libro (titulo, autor, img, descripcion, extension, anno, url, leido) {
    this.indice = !indiceEdicion ? 
        `libro_${indiceBiblioteca}-${Math.floor(Math.random()*100000)}`
        : indiceEdicion
    this.titulo = titulo
    this.autor = autor
    this.extension = !extension ? '' : extension
    this.anno = !anno ? '' : anno
    this.leido = leido ?? false 
    this.descripcion = !descripcion ? '' : descripcion
    this.url = !url ? 
        `https://google.com/search?q=${titulo.replace(' ','+')}+${autor.replace(' ','+')}`
        : `http://${url.replace(/^http(s:|:)\/\//, '')}`
    this.img = !img ?
        `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/300/200`
        : `http://${img.replace(/^http(s:|:)\/\//, '')}`
}

function agregarEditarLibroLS(...informacion) {
    if(!indiceEdicion) {
        biblioteca.unshift(new Libro(...informacion))
        localStorage.setItem(biblioteca[0].indice, JSON.stringify(biblioteca[0]))
        indiceBiblioteca++
    } else {
        localStorage.setItem(indiceEdicion, JSON.stringify(new Libro(...informacion)))
    }
}

function buscarIndiceBiblioteca(indiceLibro) {
    return biblioteca.findIndex(elemento => elemento.indice === indiceLibro)
}

function crearFichaDOM(indice){
    // ficha
    const ficha = document.createElement('div')
    ficha.classList.add('ficha')
    ficha.setAttribute('data-leido', biblioteca[indice].leido)
    ficha.setAttribute('data-indice', biblioteca[indice].indice)
    //imagen
    const imagen = document.createElement('img')
    imagen.src = biblioteca[indice].img
    imagen.alt = `${biblioteca[indice].titulo} de ${biblioteca[indice].autor}`
    imagen.width = '300px'
    imagen.height = '200px'
    imagen.classList.add('ficha__imagen')
    // titulo y autora
    const autoria = document.createElement('div')
    autoria.classList.add('ficha__autoria')
    const titulo = document.createElement('h2')
    titulo.textContent = biblioteca[indice].titulo
    const autor = document.createElement('p')
    autor.textContent = biblioteca[indice].autor
    autoria.appendChild(titulo)
    autoria.appendChild(autor)

    // Información del libro
    const informacion = document.createElement('p')
    const extension = document.createElement('small')
    extension.textContent = biblioteca[indice].extension
    const separador = document.createElement('small')
    if(extension.textContent !== '') separador.textContent = ' páginas '
    const anno = document.createElement('small')
    anno.textContent = biblioteca[indice].anno
    if(extension.textContent !== '' && anno.textContent !== '') separador.textContent += ' | '
    informacion.appendChild(extension)
    informacion.appendChild(separador)
    informacion.appendChild(anno)

    // descripción del libro
    const sinopsis = document.createElement('div')
    sinopsis.classList.add('ficha__informacion')
    const descripcion = document.createElement('p')
    descripcion.textContent = biblioteca[indice].descripcion
    sinopsis.appendChild(descripcion)
    // Botones
    const acciones = document.createElement('div')
    acciones.classList.add('ficha__acciones')
    // Boton Ir
    const irBTN = document.createElement('a')
    irBTN.setAttribute('href', biblioteca[indice].url)
    irBTN.setAttribute('target', '_blank')
    const irSR = document.createElement('span')
    irSR.classList.add('sr-only')
    irSR.textContent = 'Ver el libro'
    const irSVG = document.createElement('span')
    irSVG.classList.add('material-symbols-outlined')
    irSVG.setAttribute('aria-hidden', 'true')
    irSVG.textContent = 'search'
    irBTN.appendChild(irSR)
    irBTN.appendChild(irSVG)
    // Boton lectura
    const lecturaBTN = document.createElement('button')
    const lecturaSR = document.createElement('span')
    lecturaSR.classList.add('sr-only')
    lecturaSR.textContent = 'Marcar como libro'
    const leerSpan = document.createElement('span')
    leerSpan.classList.add('ficha__leer')
    const leerSR = document.createElement('span')
    leerSR.classList.add('sr-only')
    leerSR.textContent = 'por leer'
    const leerSVG = document.createElement('span')
    leerSVG.classList.add('material-symbols-outlined')
    leerSVG.setAttribute('aria-hidden', 'true')
    leerSVG.textContent = 'book_5'
    const leidoSpan = document.createElement('span')
    leidoSpan.classList.add('ficha__leido')
    const leidoSR = document.createElement('span')
    leidoSR.classList.add('sr-only')
    leidoSR.textContent = 'leído'
    const leidoSVG = document.createElement('span')
    leidoSVG.classList.add('material-symbols-outlined')
    leidoSVG.setAttribute('aria-hidden', 'true')
    leidoSVG.textContent = 'menu_book'
    leerSpan.appendChild(leerSR)
    leerSpan.appendChild(leerSVG)
    leidoSpan.appendChild(leidoSR)
    leidoSpan.appendChild(leidoSVG)
    lecturaBTN.appendChild(lecturaSR)
    lecturaBTN.appendChild(leerSpan)
    lecturaBTN.appendChild(leidoSpan)
    lecturaBTN.addEventListener('click', function() {
        let haSidoLeido = this.closest('.ficha').getAttribute('data-leido')
        haSidoLeido = haSidoLeido === 'true' ? 'false' : 'true'
        this.closest('.ficha').setAttribute('data-leido', haSidoLeido)

        const indice = this.closest('.ficha').getAttribute('data-indice')
        biblioteca[buscarIndiceBiblioteca(indice)].leido = haSidoLeido
        localStorage.setItem(
            indice,
            JSON.stringify(biblioteca[buscarIndiceBiblioteca(indice)])
        )
    })
    // Boton editar
    const editarBTN = document.createElement('button')
    const editarSR = document.createElement('span')
    editarSR.classList.add('sr-only')
    editarSR.textContent = 'editar'
    const editarSVG = document.createElement('span')
    editarSVG.classList.add('material-symbols-outlined')
    editarSVG.setAttribute('aria-hidden', 'true')
    editarSVG.textContent = 'edit'
    editarBTN.appendChild(editarSR)
    editarBTN.appendChild(editarSVG)
    editarBTN.addEventListener('click', function() {
        const indice = this.closest('.ficha').getAttribute('data-indice')
        indiceEdicion = indice
        libroInformacion[0].value = biblioteca[buscarIndiceBiblioteca(indice)].titulo
        libroInformacion[1].value = biblioteca[buscarIndiceBiblioteca(indice)].autor
        libroInformacion[2].value = biblioteca[buscarIndiceBiblioteca(indice)].img
        libroDescripcion.value = biblioteca[buscarIndiceBiblioteca(indice)].descripcion
        libroInformacion[3].value = biblioteca[buscarIndiceBiblioteca(indice)].extension
        libroInformacion[4].value = biblioteca[buscarIndiceBiblioteca(indice)].anno
        libroInformacion[5].value = biblioteca[buscarIndiceBiblioteca(indice)].url
        const haSidoLeido = /true/.test(biblioteca[buscarIndiceBiblioteca(indice)].leido)
        libroInformacion[6].checked = haSidoLeido
        abrirModal()
    })
    // Boton Borrar
    const borrarBTN = document.createElement('button')
    const borrarSR = document.createElement('span')
    borrarSR.classList.add('sr-only')
    borrarSR.textContent = 'borrar'
    const borrarSVG = document.createElement('span')
    borrarSVG.classList.add('material-symbols-outlined')
    borrarSVG.setAttribute('aria-hidden', 'true')
    borrarSVG.textContent = 'delete'
    borrarBTN.appendChild(borrarSR)
    borrarBTN.appendChild(borrarSVG)
    borrarBTN.addEventListener('click', function() {
        const indice = this.closest('.ficha').getAttribute('data-indice')
        biblioteca.splice(buscarIndiceBiblioteca(indice), 1)
        localStorage.removeItem(indice)
        this.closest('.ficha').remove()
    })
    // Incorporación al DOM
    acciones.appendChild(irBTN)
    acciones.appendChild(lecturaBTN)
    acciones.appendChild(editarBTN)
    acciones.appendChild(borrarBTN)
    ficha.appendChild(imagen)
    autoria.appendChild(informacion)
    ficha.appendChild(autoria)
    ficha.appendChild(sinopsis)
    ficha.appendChild(acciones)
    displayLibros.insertBefore(ficha, displayLibros.firstElementChild)
}

function abrirModal () {
    for(const validacion of libroValidacion) {
        validacion.textContent = ''
    }
    if(!indiceEdicion) {
        for(let i = 0; i < 6; i++) libroInformacion[i].value = ''
        libroDescripcion.value = '' 
        libroInformacion[6].checked = false 
    }
    btnGuardarLibro.textContent = !indiceEdicion ? 'Guardar' : 'Guardar cambios'
    modalLibro.showModal() 
}

function validarFormulario() {
    let valido = true
    const regexURL = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
    for(const validacion of libroValidacion) {
        validacion.textContent = ''
    }
    for(let i = 0; i < 2; i++) {
        const a = i === 0 ? 2 : 5 // magicNumbersssss
        if(!libroInformacion[i].value) {
            libroValidacion[i].textContent = 'Este campo es obligatorio.'
            valido = false
        }
        if(libroInformacion[a].value && !regexURL.test(libroInformacion[a].value)) {
            libroValidacion[a].textContent = 'Ingresa una URL válida o deja el campo vacío'
            valido = false
        }
        if(!/^[0-9]+$/.test(libroInformacion[3+i].value)){
            if(libroInformacion[3+i].value === '') continue
            libroValidacion[3+i].textContent = 'Ingresa un número usando dígitos o deja el campo vacío'
            valido = false
        }
    }
    if(!valido) libroValidacion[6].textContent = 'Revisa que los campos se encuentren diligenciados correctamente'

    return valido
}

function ordenarBiblioteca() {
    const ordenarPor = Array.from(displayLibrosOrden)
        .find(elem => elem.checked)
    const asc = displayLibrosOrden[displayLibrosOrden.length - 1].checked
    if(ordenarPor.id === 'nombre'){
        biblioteca.sort((a, b) => {
            if(a.titulo.toLowerCase() < b.titulo.toLowerCase()) return asc ? 1 : -1
            if(a.titulo.toLowerCase() > b.titulo.toLowerCase()) return asc ? -1 : 1
            return 0
        })
    }
    if(ordenarPor.id === 'autor'){
        biblioteca.sort((a, b) => {
            if(a.autor.toLowerCase() < b.autor.toLowerCase()) return asc ? 1 : -1
            if(a.autor.toLowerCase() > b.autor.toLowerCase()) return asc ? -1 : 1
            return 0
        })
    }
    if(ordenarPor.id === 'anno'){
        biblioteca.sort((a, b) => asc ? +b.anno - +a.anno : +a.anno - b.anno)
    } 
    displayLibros.textContent = ''
    const btnNuevoMain = document.createElement('button')
    btnNuevoMain.classList.add('nuevoLibroMain')
    const btnNuevoMainSR = document.createElement('span')
    btnNuevoMainSR.classList.add('sr-only')
    btnNuevoMainSR.textContent = 'Agregar un libro'
    const btnNuevoMainSVG = document.createElement('span')
    btnNuevoMainSVG.classList.add('material-symbols-outlined')
    btnNuevoMainSVG.textContent = 'add_circle'
    btnNuevoMain.appendChild(btnNuevoMainSR)
    btnNuevoMain.appendChild(btnNuevoMainSVG)
    displayLibros.appendChild(btnNuevoMain)

    btnNuevoMain.addEventListener('click', abrirModal)

    biblioteca.forEach((_, index) => crearFichaDOM(index))
}
// precarga
if(biblioteca.length === 0){
    agregarEditarLibroLS(
        'Matadero 5', 
        'K. Vonnegut',
        'https://nidodelibros.com/wp-content/uploads/2023/02/9780440180296.jpeg',
        "Chronicles a soldier's time-jumping journey through war, trauma, and surreal alien experiences.",
        '255',
        '1969',
        'https://nidodelibros.com/producto/slaughterhouse-five/',
        'true'
    )
}
ordenarBiblioteca()

// asignación de botones principales
for(const orden of displayLibrosOrden) {
    orden.addEventListener('change', () => ordenarBiblioteca())
}
btnGuardarLibro.addEventListener('click', () => {
    if(!validarFormulario()) return
    agregarEditarLibroLS( // tomar info del formulario
        libroInformacion[0].value, // libro
        libroInformacion[1].value, // autora
        libroInformacion[2].value, // url portada
        libroDescripcion.value, // descripcion
        libroInformacion[3].value, // páginas
        libroInformacion[4].value, // fecha de escritura
        libroInformacion[5].value, // url del libro
        libroInformacion[6].checked // leído
    )
    if(!indiceEdicion){ // nuevo libro
        crearFichaDOM(0) 
    } else { // actualización de la biblioteca
        const indice = buscarIndiceBiblioteca(indiceEdicion)
        biblioteca[indice] = JSON.parse(localStorage.getItem(indiceEdicion))
        const fichaInfo = biblioteca[indice]
        const fichaEdicion = document.querySelector(`[data-indice="${indiceEdicion}"]`)
        fichaEdicion.querySelector('h2').textContent = fichaInfo.titulo
        fichaEdicion.querySelectorAll('p')[0].textContent = fichaInfo.autor
        fichaEdicion.querySelector('img').setAttribute('src', fichaInfo.img)
        fichaEdicion.querySelectorAll('p')[2].textContent = fichaInfo.descripcion
        fichaEdicion.querySelectorAll('small')[0].textContent = fichaInfo.extension
        if(fichaInfo.extension !== ''){
            fichaEdicion.querySelectorAll('small')[1].textContent = ' páginas'
        } else {
            fichaEdicion.querySelectorAll('small')[1].textContent = ''
        }
        fichaEdicion.querySelectorAll('small')[2].textContent = fichaInfo.anno
        if(fichaInfo.extension !== '' && fichaInfo.anno !== '') {
            fichaEdicion.querySelectorAll('small')[1].textContent += ' | '
        } 
        fichaEdicion.querySelector('a').setAttribute('href', fichaInfo.url)
        fichaEdicion.setAttribute('data-leido', fichaInfo.leido)
        indiceEdicion = ''
    }
    modalLibro.close()
})
btnNuevoLibro.addEventListener('click', abrirModal)
btnCerrarModal.addEventListener('click', () => {
    indiceEdicion = ''
    modalLibro.close()
})
