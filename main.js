const btnNuevoLibro = document.getElementById('nuevoLibro')
const modalLibro = document.getElementById('modalLibro')
const btnCerrarModal = document.getElementById('cerrarModal')
const displayLibros = document.getElementById('libreria')

const biblioteca = []

function Libro(titulo, autor, extension, anno, leido, descripcion, url, img) {
    this.id = Math.floor(Math.random()*1000)
    this.titulo = titulo
    this.autor = autor
    this.extension = !extension ? '???' : extension
    this.anno = !anno ? '???' : anno
    this.leido = leido ?? false 
    this.descripcion = !descripcion ? '...' : descripcion
    this.url = !url ? `https://google.com/search?q=${titulo}` : `http://${url}`
    this.img = !img ? `https://picsum.photos/id/${this.id}/300/200` : `https://${img}`
}

// adecuar los titulos para la búsqueda en goolge
//
function crearFicha(indice){
    const ficha = document.createElement('div')
    ficha.classList.add('ficha')

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
    acciones.textContent = 'acciones 123 4567'

    const irWeb = document.createElement('button')
    const irWebSR = document.createElement('span')
    irWebSR.classList.add('sr-only')
    irWebSR.textContent = 'Ver el libro'

    const borrar = document.createElement('button')
    const borrarSR = document.createElement('span')
    borrarSR.classList.add('sr-only')
    borrarSR.textContent = 'Borrar'

    const contenedorSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    contenedorSVG.setAttribute('width', '24')
    contenedorSVG.setAttribute('height', '24')
    contenedorSVG.setAttribute('viewBox', '0 0 24 24')
    contenedorSVG.setAttribute('aria-hidden', 'true')

    const irWebPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    irWebPath.setAttribute('fill', 'currentColor')
    irWebPath.setAttribute('d', 'M16.36 14c.08-.66.14-1.32.14-2c0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2c0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2c0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2c0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2')

    const borrarPath= document.createElementNS('http://www.w3.org/2000/svg', 'path')
    irWebPath.setAttribute('fill', 'currentColor')
    irWebPath.setAttribute('d', 'M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z')

    contenedorSVG.appendChild(irWebPath)
    irWeb.appendChild(irWebSR)
    irWeb.appendChild(contenedorSVG)
    acciones.appendChild(irWeb)

    ficha.appendChild(imagen)
    autoria.appendChild(informacion)
    ficha.appendChild(autoria)
    ficha.appendChild(sinopsis)
    ficha.appendChild(acciones)

    displayLibros.appendChild(ficha)

}

function agregarLibro(...informacion) {
    biblioteca.unshift(new Libro(...informacion))
}

agregarLibro(
    'El artesano',
    'Richard Sennet',
    460,
    2012,
    true,
    'El artesano de Sennett aboga por la excelencia, conexión con el trabajo y el valor del proceso en la era moderna.',
    '',
    '')

agregarLibro(
    'La insoportable levedad del ser',
    'Milan Kundera',
    230,
    1987,
    true,
    'Kundera explora la vida, el amor y la insignificancia existencial en un mundo de decisiones y consecuencias ligeras.',
    '',
    'img2.rtve.es/v/4836164/?w=1600'
)

console.log(biblioteca[1].img)
// comportamiento del modal
btnNuevoLibro.addEventListener('click', () => {
   modalLibro.showModal() 
})

btnCerrarModal.addEventListener('click', () => {
    modalLibro.close()
})

crearFicha(0)

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

