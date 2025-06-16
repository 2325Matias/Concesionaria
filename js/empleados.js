document.addEventListener('DOMContentLoaded', () => {
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

    // Campos para el modal Editar Empleado
    const inputEditarUsuario = document.getElementById('editar-usuario');
    const inputEditarCorreo = document.getElementById('editar-correo');
    const inputEditarContrasena = document.getElementById('editar-contrasena');
    const selectEditarRol = document.getElementById('editar-rol');
    const botonGuardarCambios = document.getElementById('guardar-cambios-empleado');

    // Campos para el modal Agregar Empleado
    const inputAgregarUsuario = document.getElementById('agregar-usuario');
    const inputAgregarCorreo = document.getElementById('agregar-correo');
    const inputAgregarContrasena = document.getElementById('agregar-contrasena');
    const selectAgregarRol = document.getElementById('agregar-rol');
    const botonGuardarNuevoEmpleado = document.getElementById('guardar-nuevo-empleado');

    const inputBusquedaEmpleado = document.getElementById('busqueda-empleado');

    let empleadoSeleccionadoCheckbox = null;
    let empleadoSeleccionadoFila = null;

    const employeesData = Array.from(tablaEmpleadosBody.querySelectorAll('tr')).map(row => {
        const checkbox = row.querySelector('.select-empleado');
        return {
            id: parseInt(checkbox.dataset.id),
            usuario: checkbox.dataset.usuario,
            correo: checkbox.dataset.correo,
            contrasena: checkbox.dataset.contrasena,
            rol: checkbox.dataset.rol
        };
    });
    let nextIdEmpleado = employeesData.length > 0 ? Math.max(...employeesData.map(e => e.id)) + 1 : 1;

    // Función para renderizar la tabla de empleados
    window.renderizarEmpleados = function(filtro = '') { // Se hizo global para que menu.js la pueda llamar
        tablaEmpleadosBody.innerHTML = '';
        const textoFiltro = filtro.toLowerCase();

        const empleadosFiltrados = employeesData.filter(empleado => {
            return (
                empleado.usuario.toLowerCase().includes(textoFiltro) ||
                empleado.correo.toLowerCase().includes(textoFiltro)
            );
        });

        if (empleadosFiltrados.length === 0 && textoFiltro !== '') {
            const noResultsRow = tablaEmpleadosBody.insertRow();
            noResultsRow.innerHTML = `<td colspan="5" class="text-center">No se encontraron empleados que coincidan con la búsqueda.</td>`;
            return;
        }

        empleadosFiltrados.forEach(empleado => {
            const newRow = tablaEmpleadosBody.insertRow();
            const checkboxCell = newRow.insertCell();
            const usuarioCell = newRow.insertCell();
            const correoCell = newRow.insertCell();
            const contrasenaCell = newRow.insertCell();
            const rolCell = newRow.insertCell();

            const newCheckbox = document.createElement('input');
            newCheckbox.type = 'checkbox';
            newCheckbox.classList.add('form-check-input', 'me-2', 'select-empleado');
            newCheckbox.dataset.id = empleado.id;
            newCheckbox.dataset.usuario = empleado.usuario;
            newCheckbox.dataset.correo = empleado.correo;
            newCheckbox.dataset.contrasena = empleado.contrasena;
            newCheckbox.dataset.rol = empleado.rol;

            checkboxCell.appendChild(newCheckbox);
            usuarioCell.textContent = empleado.usuario;
            correoCell.textContent = empleado.correo;
            contrasenaCell.textContent = '****';
            rolCell.textContent = empleado.rol;
        });
    }

    function obtenerCheckboxesSeleccionados() {
        return Array.from(tablaEmpleadosBody.querySelectorAll('.select-empleado:checked'));
    }

    function llenarModalEditar(checkbox) {
        inputEditarUsuario.value = checkbox.dataset.usuario;
        inputEditarCorreo.value = checkbox.dataset.correo;
        inputEditarContrasena.value = checkbox.dataset.contrasena;
        selectEditarRol.value = checkbox.dataset.rol;
        empleadoSeleccionadoCheckbox = checkbox;
        empleadoSeleccionadoFila = checkbox.closest('tr');
    }

    botonAgregar.addEventListener('click', () => {
        formAgregarEmpleado.reset();
        selectAgregarRol.value = '';
        modalAgregarEmpleado.show();
    });

    botonGuardarNuevoEmpleado.addEventListener('click', () => {
        const nuevoUsuario = inputAgregarUsuario.value.trim();
        const nuevoCorreo = inputAgregarCorreo.value.trim();
        const nuevaContrasena = inputAgregarContrasena.value;
        const nuevoRol = selectAgregarRol.value;

        if (nuevoUsuario && nuevoCorreo && nuevaContrasena && nuevoRol) {
            const nuevoEmpleado = {
                id: nextIdEmpleado++,
                usuario: nuevoUsuario,
                correo: nuevoCorreo,
                contrasena: nuevaContrasena,
                rol: nuevoRol
            };
            employeesData.push(nuevoEmpleado);
            renderizarEmpleados(inputBusquedaEmpleado.value);

            modalAgregarEmpleado.hide();
            formAgregarEmpleado.reset();
            alert('Nuevo empleado agregado con éxito.');
        } else {
            alert('Por favor, completa todos los campos para agregar un nuevo empleado.');
        }
    });

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

    botonGuardarCambios.addEventListener('click', () => {
        if (empleadoSeleccionadoCheckbox && empleadoSeleccionadoFila) {
            const nuevoUsuario = inputEditarUsuario.value.trim();
            const nuevoCorreo = inputEditarCorreo.value.trim();
            const nuevaContrasena = inputEditarContrasena.value;
            const nuevoRol = selectEditarRol.value;

            if (!nuevoUsuario || !nuevoCorreo || !nuevaContrasena || !nuevoRol) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            empleadoSeleccionadoCheckbox.dataset.usuario = nuevoUsuario;
            empleadoSeleccionadoCheckbox.dataset.correo = nuevoCorreo;
            empleadoSeleccionadoCheckbox.dataset.contrasena = nuevaContrasena;
            empleadoSeleccionadoCheckbox.dataset.rol = nuevoRol;

            empleadoSeleccionadoFila.cells[1].textContent = nuevoUsuario;
            empleadoSeleccionadoFila.cells[2].textContent = nuevoCorreo;
            empleadoSeleccionadoFila.cells[3].textContent = '****';
            empleadoSeleccionadoFila.cells[4].textContent = nuevoRol;

            const empleadoId = parseInt(empleadoSeleccionadoCheckbox.dataset.id);
            const index = employeesData.findIndex(emp => emp.id === empleadoId);
            if (index > -1) {
                employeesData[index] = {
                    ...employeesData[index],
                    usuario: nuevoUsuario,
                    correo: nuevoCorreo,
                    contrasena: nuevaContrasena,
                    rol: nuevoRol
                };
            }

            modalEditarEmpleado.hide();
            empleadoSeleccionadoCheckbox = null;
            empleadoSeleccionadoFila = null;
            formEditarEmpleado.reset();
            alert('Empleado modificado con éxito.');
        }
    });

    botonEliminar.addEventListener('click', () => {
        const checkboxesSeleccionados = obtenerCheckboxesSeleccionados();

        if (checkboxesSeleccionados.length > 0) {
            if (confirm('¿Estás seguro de que deseas eliminar los empleados seleccionados?')) {
                checkboxesSeleccionados.forEach(checkbox => {
                    const empleadoId = parseInt(checkbox.dataset.id);
                    const index = employeesData.findIndex(emp => emp.id === empleadoId);
                    if (index > -1) {
                        employeesData.splice(index, 1);
                    }
                });
                renderizarEmpleados(inputBusquedaEmpleado.value);

                alert('Empleados eliminados con éxito.');
            }
        } else {
            alert('Por favor, selecciona al menos un empleado para eliminar.');
        }
    });

    inputBusquedaEmpleado.addEventListener('keyup', () => {
        renderizarEmpleados(inputBusquedaEmpleado.value);
    });

    // Renderizado inicial cuando employees.js es cargado
    renderizarEmpleados();
});