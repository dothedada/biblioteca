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
    const dialogDimensions = modalLibro.getBoundingClientRect()
    if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
    ) {
        modalLibro.close()
    }
})

console.log('patito')
