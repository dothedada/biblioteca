const btnNuevoLibro = document.getElementById('nuevoLibro')
const modalLibro = document.getElementById('modalLibro')
const btnCerrarModal = document.getElementById('cerrarModal')


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

