const btnNuevoLibro = document.getElementById('nuevoLibro')
const btnNuevoLibroMain = document.querySelector('.nuevoLibroMain')
const modalLibro = document.getElementById('modalLibro')
const btnGuardarLibro = document.getElementById('guardarLibroNuevo')
const btnCerrarModal = document.getElementById('cerrarModal')
const displayLibros = document.getElementById('libreria')
// elementos del formulario
const libroInformacion = document.querySelectorAll('#nuevoLibro input')
const libroDescripcion = document.querySelector('#nuevoLibro textarea')
const libroValidacion = document.querySelectorAll('#nuevoLibro .validacion')
// Creación del array que contiene la biblioteca
// a partir de los libros guardados en el localStorage
let indiceBiblioteca = localStorage.length
let indiceEdicion = ''
const biblioteca = []
const llaves = Object.keys(localStorage)
for(const llave of llaves) {
    if(!/^libro_/.test(llave)) continue
    biblioteca.unshift(JSON.parse(localStorage.getItem(llave)))
}

// 2. Validacion formulario
// 3. habilitar el panel de ordenar libros
// 4. crear botón de conejitos para "pre-poblar" la tabla en el demo
// 5. exportar el JSON del local storage
// 6. crear la opcion de cargar el archivo de biblioteca

function Libro (titulo, autor, img, descripcion, extension, anno, url, leido) {
    // EL random del indice es para reducir las posibilidad de conflictos
    // con las llaves de los objetos en el localStorage
    this.indice = !indiceEdicion ? 
        `libro_${indiceBiblioteca}-${Math.floor(Math.random()*100000)}`
        : indiceEdicion
    this.titulo = titulo
    this.autor = autor
    this.extension = !extension ? '???' : extension
    this.anno = !anno ? '???' : anno
    this.leido = leido ?? false 
    this.descripcion = !descripcion ? '...' : descripcion
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
    extension.textContent = `${biblioteca[indice].extension} páginas`
    const anno = document.createElement('small')
    anno.textContent = biblioteca[indice].anno
    const separador = document.createTextNode(' · ')
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
        // precarga de info en formulario
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

biblioteca.forEach((_, index) => crearFichaDOM(index))
console.log(!/^[0-9]+$/.test('a'))
function validarFormulario() {
    let valido = true
    const regexURL = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/)
    for(const validacion of libroValidacion) {
        validacion.textContent = ''
    }
    for(let i = 0; i < 2; i++) {
        if(!libroInformacion[i].value) {
            libroValidacion[i].textContent = 'Este campo es obligatorio.'
            valido = false
        }
        if(!/^[0-9]+$/.test(libroInformacion[3 + i].value)){
            console.log(libroInformacion[3 + i].value)
            if(libroInformacion[3+i].value === '') continue
            libroValidacion[3+i].textContent = 'Ingresa un número usando dígitos'
            valido = false
        }
    }
    if(libroInformacion[2].value && !regexURL.test(libroInformacion[2].value)) {
        libroValidacion[2].textContent = 'Ingresa una URL válida o deja el campo vacío'
        valido = false
    }
    if(libroInformacion[5].value && !regexURL.test(libroInformacion[5].value)) {
        libroValidacion[5].textContent = 'Ingresa una URL válida o deja el campo vacío'
        valido = false
    }
    if(!valido) libroValidacion[6].textContent = 'Revisa que los campos se encuentren diligenciados correctamente'


        // libroInformacion[1].value, // autora
        // libroInformacion[2].value, // url portada
        // libroDescripcion.value, // descripcion
        // libroInformacion[3].value, // páginas
        // libroInformacion[4].value, // fecha de escritura
        // libroInformacion[5].value, // url del libro
        // libroInformacion[6].checked // leído

    return valido
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
        fichaEdicion.querySelectorAll('small')[1].textContent = fichaInfo.anno
        fichaEdicion.querySelector('a').setAttribute('href', fichaInfo.url)
        fichaEdicion.setAttribute('data-leido', fichaInfo.leido)
        indiceEdicion = ''
    }
    modalLibro.close()
})

// comportamiento del modal
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

btnNuevoLibro.addEventListener('click', abrirModal)
btnNuevoLibroMain.addEventListener('click', abrirModal)
btnCerrarModal.addEventListener('click', () => {
    indiceEdicion = ''
    modalLibro.close()
})

// cerral modal al hacer clic por fuera del modal
// modalLibro.addEventListener("click", e => {
//     const modalDimensiones = modalLibro.getBoundingClientRect()
//     if (
//         e.clientX < modalDimensiones.left ||
//         e.clientX > modalDimensiones.right ||
//         e.clientY < modalDimensiones.top ||
//         e.clientY > modalDimensiones.bottom
//     ) {
//         modalLibro.close()
//     }
// })

