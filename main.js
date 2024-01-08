const btnNuevoLibro = document.getElementById('nuevoLibro')
const modalLibro = document.getElementById('modalLibro')
const btnGuardarLibro = document.getElementById('guardarLibroNuevo')
const btnCerrarModal = document.getElementById('cerrarModal')
const displayLibros = document.getElementById('libreria')

const nuevoLibro = document.querySelectorAll('#nuevoLibro input')
const nuevoLibroDescripcion = document.querySelector('#nuevoLibro textarea')

btnGuardarLibro.addEventListener('click', () => {
    agregarLibro(
        nuevoLibro[0].value, // libro
        nuevoLibro[1].value, // autora
        nuevoLibro[2].value, // url portada
        nuevoLibroDescripcion.value, // descripcion
        nuevoLibro[3].value, // páginas
        nuevoLibro[4].value, // fecha de escritura
        nuevoLibro[5].value, // url del libro
        nuevoLibro[6].checked // leído
    )
    console.log(biblioteca)
    modalLibro.close()
    crearFicha(0)
})

const biblioteca = []
let index = 0

class Libro {
    constructor (titulo, autor, img, descripcion, extension, anno, url, leido) {
        this.indice = index
        this.titulo = titulo
        this.autor = autor
        this.extension = !extension ? '???' : extension
        this.anno = !anno ? '???' : anno
        this.leido = leido ?? false 
        this.descripcion = !descripcion ? '...' : descripcion
        this.url = !url ? `https://google.com/search?q=${titulo}` : `http://${url}`
        this.img = !img ? `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/300/200` : `https://${img}`
    }
}

function agregarLibro(...informacion) {
    biblioteca.unshift(new Libro(...informacion))
    index++
}

function buscarIndiceLibro(indice) {
    return biblioteca.findIndex(elemento => elemento.indice === +indice)
}

function crearFicha(indice){
    const ficha = document.createElement('div')
    ficha.classList.add('ficha')
    ficha.setAttribute('data-leido', biblioteca[indice].leido)
    ficha.setAttribute('data-indice', biblioteca[indice].indice)
    ficha.setAttribute('tabindex', '0')

    const imagen = document.createElement('img')
    imagen.src = biblioteca[indice].img
    imagen.alt = `${biblioteca[indice].titulo} de ${biblioteca[indice].autor}`
    imagen.width = '300px'
    imagen.height = '200px'
    imagen.classList.add('ficha__imagen')

    const autoria = document.createElement('div')
    autoria.classList.add('ficha__autoria')
    const titulo = document.createElement('h2')
    titulo.textContent = biblioteca[indice].titulo
    const autor = document.createElement('p')
    autor.textContent = biblioteca[indice].autor
    autoria.appendChild(titulo)
    autoria.appendChild(autor)

    const informacion = document.createElement('p')
    const extension = document.createElement('small')
    extension.textContent = `${biblioteca[indice].extension} páginas`
    const anno = document.createElement('small')
    anno.textContent = biblioteca[indice].anno
    const separador = document.createTextNode(' · ')
    informacion.appendChild(extension)
    informacion.appendChild(separador)
    informacion.appendChild(anno)

    const sinopsis = document.createElement('div')
    sinopsis.classList.add('ficha__informacion')
    const descripcion = document.createElement('p')
    descripcion.textContent = biblioteca[indice].descripcion
    sinopsis.appendChild(descripcion)

    const acciones = document.createElement('div')
    acciones.classList.add('ficha__acciones')

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
        biblioteca[buscarIndiceLibro(indice)].leido = haSidoLeido
    })

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
        biblioteca.splice(buscarIndiceLibro(indice), 1)
        this.closest('.ficha').remove()
    })
    
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



agregarLibro(
    'El artesano',
    'Richard Sennet',
    '',
    'El artesano de Sennett aboga por la excelencia, conexión con el trabajo y el valor del proceso en la era moderna.',
    460,
    2012,
    '',
    'true'
)

agregarLibro(
    'La insoportable levedad del ser',
    'Milan Kundera',
    'img2.rtve.es/v/4836164/?w=1600',
    'Kundera explora la vida, el amor y la insignificancia existencial en un mundo de decisiones y consecuencias ligeras.',
    230,
    1987,
    '',
    'false'
)
crearFicha(0)
crearFicha(1)
console.log(biblioteca)
// comportamiento del modal
btnNuevoLibro.addEventListener('click', () => {
   modalLibro.showModal() 
})

btnCerrarModal.addEventListener('click', () => {
    modalLibro.close()
})

// cerral modal al hacer clic por fuera del modal
modalLibro.addEventListener("click", e => {
    const modalDimensiones = modalLibro.getBoundingClientRect()
    if (
        e.clientX < modalDimensiones.left ||
        e.clientX > modalDimensiones.right ||
        e.clientY < modalDimensiones.top ||
        e.clientY > modalDimensiones.bottom
    ) {
        modalLibro.close()
    }
})

