document.addEventListener('DOMContentLoaded', () => {
    const empleadosSection = document.getElementById('empleados-section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Ocultar la sección de empleados al inicio
    empleadosSection.style.display = 'none';

    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Si se hace clic en el enlace "Empleados", mostrar la sección
            if (link.getAttribute('href') === '#empleados-section') {
                event.preventDefault(); // Evitar el comportamiento predeterminado del enlace
                empleadosSection.style.display = 'block';
            } else {
                // Si se hace clic en otro enlace, ocultar la sección de empleados
                empleadosSection.style.display = 'none';
            }

            // Remover la clase 'active' de todos los enlaces y agregarla al actual
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    const tablaEmpleadosBody = document.getElementById('tabla-empleados-body');
    const botonAgregar = document.getElementById('agregar-empleado');
    const botonModificar = document.getElementById('modificar-empleado');
    const botonEliminar = document.getElementById('eliminar-empleado');

    // Modales
    const modalEditarEmpleado = new bootstrap.Modal(document.getElementById('editarEmpleadoModal'));
    const modalAgregarEmpleado = new bootstrap.Modal(document.getElementById('agregarEmpleadoModal'));

    // Formularios dentro de los modales
    const formEditarEmpleado = document.getElementById('form-editar-empleado');
    const formAgregarEmpleado = document.getElementById('form-agregar-empleado');

    // Campos del modal Editar
    const inputEditarUsuario = document.getElementById('editar-usuario');
    const inputEditarCorreo = document.getElementById('editar-correo');
    const inputEditarContrasena = document.getElementById('editar-contrasena');
    const botonGuardarCambios = document.getElementById('guardar-cambios-empleado');

    // Campos del modal Agregar
    const inputAgregarUsuario = document.getElementById('agregar-usuario');
    const inputAgregarCorreo = document.getElementById('agregar-correo');
    const inputAgregarContrasena = document.getElementById('agregar-contrasena');
    const botonGuardarNuevoEmpleado = document.getElementById('guardar-nuevo-empleado');

    let empleadoSeleccionadoCheckbox = null;
    let empleadoSeleccionadoFila = null;
    let nextId = tablaEmpleadosBody.querySelectorAll('tr').length + 1; // Simple ID para nuevos empleados

    // Función para obtener los checkboxes de empleados seleccionados
    function obtenerCheckboxesSeleccionados() {
        return Array.from(tablaEmpleadosBody.querySelectorAll('.select-empleado:checked'));
    }

    // Función para llenar el modal Editar con los datos del empleado
    function llenarModalEditar(checkbox) {
        inputEditarUsuario.value = checkbox.dataset.usuario;
        inputEditarCorreo.value = checkbox.dataset.correo;
        inputEditarContrasena.value = checkbox.dataset.contrasena;
        empleadoSeleccionadoCheckbox = checkbox;
        empleadoSeleccionadoFila = checkbox.closest('tr');
    }

    // Evento al hacer clic en el botón Agregar
    botonAgregar.addEventListener('click', () => {
        formAgregarEmpleado.reset(); // Limpiar el formulario al abrir el modal
        modalAgregarEmpleado.show();
    });

    // Evento al hacer clic en el botón Guardar Nuevo Empleado
    botonGuardarNuevoEmpleado.addEventListener('click', () => {
        const nuevoUsuario = inputAgregarUsuario.value.trim();
        const nuevoCorreo = inputAgregarCorreo.value.trim();
        const nuevaContrasena = inputAgregarContrasena.value;

        if (nuevoUsuario && nuevoCorreo && nuevaContrasena) {
            const newRow = tablaEmpleadosBody.insertRow();
            const checkboxCell = newRow.insertCell();
            const usuarioCell = newRow.insertCell();
            const correoCell = newRow.insertCell();
            const contrasenaCell = newRow.insertCell();

            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.classList.add('form-check-input', 'me-2', 'select-empleado');
            newCheckbox.dataset.id = nextId++;
            newCheckbox.dataset.usuario = nuevoUsuario;
            newCheckbox.dataset.correo = nuevoCorreo;
            newCheckbox.dataset.contrasena = nuevaContrasena;

            checkboxCell.appendChild(newCheckbox);
            usuarioCell.textContent = nuevoUsuario;
            correoCell.textContent = nuevoCorreo;
            contrasenaCell.textContent = '****';

            modalAgregarEmpleado.hide();
            formAgregarEmpleado.reset();
            alert('Nuevo empleado agregado con éxito.');
        } else {
            alert('Por favor, completa todos los campos para agregar un nuevo empleado.');
        }
    });

    // Evento al hacer clic en el botón Modificar
    botonModificar.addEventListener('click', () => {
        const checkboxesSeleccionados = obtenerCheckboxesSeleccionados();

        if (checkboxesSeleccionados.length === 1) {
            llenarModalEditar(checkboxesSeleccionados[0]);
            modalEditarEmpleado.show();
        } else if (checkboxesSeleccionados.length > 1) {
            alert('Por favor, selecciona solo un empleado para modificar.');
        } else {
            alert('Por favor, selecciona un empleado para modificar.');
        }
    });

    // Evento al hacer clic en el botón Guardar Cambios en el modal Editar
    botonGuardarCambios.addEventListener('click', () => {
        if (empleadoSeleccionadoCheckbox && empleadoSeleccionadoFila) {
            const nuevoUsuario = inputEditarUsuario.value.trim();
            const nuevoCorreo = inputEditarCorreo.value.trim();
            const nuevaContrasena = inputEditarContrasena.value;

            empleadoSeleccionadoCheckbox.dataset.usuario = nuevoUsuario;
            empleadoSeleccionadoCheckbox.dataset.correo = nuevoCorreo;
            empleadoSeleccionadoCheckbox.dataset.contrasena = nuevaContrasena;

            empleadoSeleccionadoFila.cells[1].textContent = nuevoUsuario;
            empleadoSeleccionadoFila.cells[2].textContent = nuevoCorreo;
            empleadoSeleccionadoFila.cells[3].textContent = '****';

            modalEditarEmpleado.hide();
            empleadoSeleccionadoCheckbox = null;
            empleadoSeleccionadoFila = null;
            formEditarEmpleado.reset();
            alert('Empleado modificado con éxito.');
        }
    });

    // Evento al hacer clic en el botón Eliminar
    botonEliminar.addEventListener('click', () => {
        const checkboxesSeleccionados = obtenerCheckboxesSeleccionados();

        if (checkboxesSeleccionados.length > 0) {
            if (confirm('¿Estás seguro de que deseas eliminar los empleados seleccionados?')) {
                checkboxesSeleccionados.forEach(checkbox => {
                    checkbox.closest('tr').remove();
                });
                alert('Empleados eliminados con éxito.');
            }
        } else {
            alert('Por favor, selecciona al menos un empleado para eliminar.');
        }
    });
});