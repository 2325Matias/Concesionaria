document.addEventListener('DOMContentLoaded', () => {
    const empleadosSection = document.getElementById('empleados-section');
    const ventasSection = document.getElementById('ventas-section');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Ocultar las secciones al inicio
    empleadosSection.style.display = 'none';
    ventasSection.style.display = 'none';

    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Ocultar todas las secciones antes de mostrar la correcta
            empleadosSection.style.display = 'none';
            ventasSection.style.display = 'none';

            if (link.getAttribute('href') === '#empleados-section') {
                event.preventDefault();
                empleadosSection.style.display = 'block';
            } else if (link.getAttribute('href') === '#ventas-section') {
                event.preventDefault();
                ventasSection.style.display = 'block';
                renderizarVentas(); // Llama a la función para renderizar ventas cuando se hace clic
            }

            // Remover la clase 'active' de todos los enlaces y agregarla al actual
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // ... (código existente de la sección de empleados sin cambios significativos) ...

    const tablaEmpleadosBody = document.getElementById('tabla-empleados-body');
    const botonAgregar = document.getElementById('agregar-empleado');
    const botonModificar = document.getElementById('modificar-empleado');
    const botonEliminar = document.getElementById('eliminar-empleado');

    // Modales
    const modalEditarEmpleado = new bootstrap.Modal(document.getElementById('editarEmpleadoModal'));
    const modalAgregarEmpleado = new bootstrap.Modal(document.getElementById('agregarEmpleadoModal'));
    const modalNuevaVenta = new bootstrap.Modal(document.getElementById('nuevaVentaModal'));

    // Formularios dentro de los modales
    const formEditarEmpleado = document.getElementById('form-editar-empleado');
    const formAgregarEmpleado = document.getElementById('form-agregar-empleado');
    const formNuevaVenta = document.getElementById('form-nueva-venta');

    // Campos del modal Editar (Empleados)
    const inputEditarUsuario = document.getElementById('editar-usuario');
    const inputEditarCorreo = document.getElementById('editar-correo');
    const inputEditarContrasena = document.getElementById('editar-contrasena');
    const botonGuardarCambios = document.getElementById('guardar-cambios-empleado');

    // Campos del modal Agregar (Empleados)
    const inputAgregarUsuario = document.getElementById('agregar-usuario');
    const inputAgregarCorreo = document.getElementById('agregar-correo');
    const inputAgregarContrasena = document.getElementById('agregar-contrasena');
    const botonGuardarNuevoEmpleado = document.getElementById('guardar-nuevo-empleado');

    let empleadoSeleccionadoCheckbox = null;
    let empleadoSeleccionadoFila = null;
    let nextIdEmpleado = tablaEmpleadosBody.querySelectorAll('tr').length + 1;

    // Funciones y eventos de Empleados (sin cambios)
    function obtenerCheckboxesSeleccionados() {
        return Array.from(tablaEmpleadosBody.querySelectorAll('.select-empleado:checked'));
    }

    function llenarModalEditar(checkbox) {
        inputEditarUsuario.value = checkbox.dataset.usuario;
        inputEditarCorreo.value = checkbox.dataset.correo;
        inputEditarContrasena.value = checkbox.dataset.contrasena;
        empleadoSeleccionadoCheckbox = checkbox;
        empleadoSeleccionadoFila = checkbox.closest('tr');
    }

    botonAgregar.addEventListener('click', () => {
        formAgregarEmpleado.reset();
        modalAgregarEmpleado.show();
    });

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
            newCheckbox.dataset.id = nextIdEmpleado++;
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

    // --- Ventas Section Logic ---

    // Datos de ventas de ejemplo
    const salesData = [
        {
            id: 1,
            remito: 'V-001-2025',
            referencia: 'Venta de auto usado: Ford Fiesta 2018',
            clienteNombreCompleto: 'Juan Perez',
            clienteDNI: '12.345.678',
            clienteCorreo: 'juan.perez@example.com',
            clienteTelefono: '1122334455',
            permuta: 'No',
            vehiculoMarca: 'Ford',
            vehiculoModelo: 'Fiesta',
            vehiculoColor: 'Rojo',
            financiacion: 'No',
            planFinanciacion: '',
            metodoPago: 'Transferencia Bancaria',
            vendedorNombreCompleto: 'Ana Gomez',
            vendedorCorreo: 'ana.gomez@example.com',
            vendedorTelefono: '1198765432'
        },
        {
            id: 2,
            remito: 'V-002-2025',
            referencia: 'Venta de auto nuevo: Toyota Corolla 2025',
            clienteNombreCompleto: 'Maria Lopez',
            clienteDNI: '23.456.789',
            clienteCorreo: 'maria.lopez@example.com',
            clienteTelefono: '1155443322',
            permuta: 'Sí',
            vehiculoMarca: 'Toyota',
            vehiculoModelo: 'Corolla',
            vehiculoColor: 'Blanco',
            financiacion: 'Sí',
            planFinanciacion: 'Plan 70-30',
            metodoPago: 'Plan de Financiación',
            vendedorNombreCompleto: 'Pedro Ramirez',
            vendedorCorreo: 'pedro.ramirez@example.com',
            vendedorTelefono: '1166778899'
        }
    ];

    const tablaVentasBody = document.getElementById('tabla-ventas-body');
    const botonNuevaVenta = document.getElementById('nueva-venta');

    // Campos del modal de Nueva Venta/Editar Venta
    const modalTitleNuevaVenta = document.getElementById('nuevaVentaModalLabel'); // Título del modal
    const inputVentaIdOculto = document.getElementById('venta-id-oculto'); // Campo oculto para el ID
    const inputRemitoNuevaVenta = document.getElementById('remito-nueva-venta');
    const inputReferenciaNuevaVenta = document.getElementById('referencia-nueva-venta');
    const inputClienteNombreCompleto = document.getElementById('cliente-nombre-completo');
    const inputClienteDNI = document.getElementById('cliente-dni');
    const inputClienteCorreo = document.getElementById('cliente-correo');
    const inputClienteTelefono = document.getElementById('cliente-telefono');
    const radioPermutaSi = document.getElementById('permuta-si');
    const radioPermutaNo = document.getElementById('permuta-no');
    const inputVehiculoMarca = document.getElementById('vehiculo-marca');
    const inputVehiculoModelo = document.getElementById('vehiculo-modelo');
    const inputVehiculoColor = document.getElementById('vehiculo-color');
    const radioFinanciacionSi = document.getElementById('financiacion-si');
    const radioFinanciacionNo = document.getElementById('financiacion-no');
    const planFinanciacionDiv = document.getElementById('plan-financiacion-div');
    const radioPlan9010 = document.getElementById('plan-90-10');
    const radioPlan7030 = document.getElementById('plan-70-30');
    const selectMetodoPago = document.getElementById('metodo-pago');
    const inputVendedorNombreCompleto = document.getElementById('vendedor-nombre-completo');
    const inputVendedorCorreo = document.getElementById('vendedor-correo');
    const inputVendedorTelefono = document.getElementById('vendedor-telefono');

    // Solo necesitamos el botón de guardar cambios y cerrar
    const botonGuardarCambiosModal = document.getElementById('boton-guardar-cambios-modal');
    const botonCerrarModal = document.getElementById('boton-cerrar-modal');

    let nextIdVenta = salesData.length > 0 ? Math.max(...salesData.map(s => s.id)) + 1 : 1;

    // Función auxiliar para obtener los datos de una venta del formulario
    function getSaleDataFromForm() {
        const id = inputVentaIdOculto.value ? parseInt(inputVentaIdOculto.value) : null;
        const financiacion = document.querySelector('input[name="financiacion"]:checked').value;
        let planFinanciacion = '';
        if (financiacion === 'Sí') {
            const selectedPlan = document.querySelector('input[name="tipo-financiacion"]:checked');
            planFinanciacion = selectedPlan ? selectedPlan.value : 'No especificado';
        }

        return {
            id: id,
            remito: inputRemitoNuevaVenta.value.trim(),
            referencia: inputReferenciaNuevaVenta.value.trim(),
            clienteNombreCompleto: inputClienteNombreCompleto.value.trim(),
            clienteDNI: inputClienteDNI.value.trim(),
            clienteCorreo: inputClienteCorreo.value.trim(),
            clienteTelefono: inputClienteTelefono.value.trim(),
            permuta: document.querySelector('input[name="permuta"]:checked').value,
            vehiculoMarca: inputVehiculoMarca.value.trim(),
            vehiculoModelo: inputVehiculoModelo.value.trim(),
            vehiculoColor: inputVehiculoColor.value.trim(),
            financiacion: financiacion,
            planFinanciacion: planFinanciacion,
            metodoPago: selectMetodoPago.value,
            vendedorNombreCompleto: inputVendedorNombreCompleto.value.trim(),
            vendedorCorreo: inputVendedorCorreo.value.trim(),
            vendedorTelefono: inputVendedorTelefono.value.trim()
        };
    }

    // Función auxiliar para validar los campos del formulario
    function validateSaleForm(sale) {
        if (!sale.remito || !sale.referencia || !sale.clienteNombreCompleto || !sale.clienteDNI ||
            !sale.clienteCorreo || !sale.clienteTelefono || !sale.vehiculoMarca || !sale.vehiculoModelo ||
            !sale.vehiculoColor || !sale.metodoPago || !sale.vendedorNombreCompleto || !sale.vendedorCorreo ||
            !sale.vendedorTelefono) {
            alert('Por favor, completa todos los campos obligatorios.');
            return false;
        }
        return true;
    }

    // Función auxiliar para establecer la visibilidad de los campos (modo ver/editar)
    function setFormFieldsReadOnly(readOnly) {
        const fields = formNuevaVenta.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (field.type === 'radio') {
                field.disabled = readOnly;
            } else {
                field.readOnly = readOnly;
            }
        });
        if (readOnly) {
            selectMetodoPago.style.pointerEvents = 'none';
            selectMetodoPago.style.touchAction = 'none';
        } else {
            selectMetodoPago.style.pointerEvents = 'auto';
            selectMetodoPago.style.touchAction = 'auto';
        }
    }


    // Función para renderizar los datos de ventas en la tabla
    function renderizarVentas() {
        tablaVentasBody.innerHTML = ''; // Limpiar filas existentes
        salesData.forEach(sale => {
            const row = tablaVentasBody.insertRow();
            row.innerHTML = `
                <td>${sale.remito}</td>
                <td>${sale.clienteNombreCompleto}</td>
                <td>${sale.referencia}</td>
                <td>
                    <button class="btn btn-info btn-sm me-1 ver-detalles-venta" data-id="${sale.id}">Ver</button>
                    <button class="btn btn-warning btn-sm me-1 editar-venta" data-id="${sale.id}">Modificar</button>
                    <button class="btn btn-danger btn-sm eliminar-venta" data-id="${sale.id}">Eliminar</button>
                </td>
            `;
        });

        // Add event listeners to the "Ver" buttons
        document.querySelectorAll('.ver-detalles-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                const selectedSale = salesData.find(sale => sale.id === saleId);
                if (selectedSale) {
                    // Configurar el modal para el modo "Ver Detalles"
                    modalTitleNuevaVenta.textContent = 'Detalles de la Venta';
                    botonGuardarCambiosModal.style.display = 'none'; // Ocultar Guardar Cambios
                    botonCerrarModal.style.display = 'block'; // Mostrar Cerrar

                    // Llenar los campos del formulario con los datos de la venta
                    inputVentaIdOculto.value = selectedSale.id;
                    inputRemitoNuevaVenta.value = selectedSale.remito;
                    inputReferenciaNuevaVenta.value = selectedSale.referencia;
                    inputClienteNombreCompleto.value = selectedSale.clienteNombreCompleto;
                    inputClienteDNI.value = selectedSale.clienteDNI;
                    inputClienteCorreo.value = selectedSale.clienteCorreo;
                    inputClienteTelefono.value = selectedSale.clienteTelefono;

                    if (selectedSale.permuta === 'Sí') {
                        radioPermutaSi.checked = true;
                    } else {
                        radioPermutaNo.checked = true;
                    }

                    inputVehiculoMarca.value = selectedSale.vehiculoMarca;
                    inputVehiculoModelo.value = selectedSale.vehiculoModelo;
                    inputVehiculoColor.value = selectedSale.vehiculoColor;

                    if (selectedSale.financiacion === 'Sí') {
                        radioFinanciacionSi.checked = true;
                        planFinanciacionDiv.style.display = 'block';
                        if (selectedSale.planFinanciacion === 'Plan 90-10') {
                            radioPlan9010.checked = true;
                        } else if (selectedSale.planFinanciacion === 'Plan 70-30') {
                            radioPlan7030.checked = true;
                        } else {
                            radioPlan9010.checked = false;
                            radioPlan7030.checked = false;
                        }
                    } else {
                        radioFinanciacionNo.checked = true;
                        planFinanciacionDiv.style.display = 'none';
                        radioPlan9010.checked = false;
                        radioPlan7030.checked = false;
                    }
                    selectMetodoPago.value = selectedSale.metodoPago;
                    inputVendedorNombreCompleto.value = selectedSale.vendedorNombreCompleto;
                    inputVendedorCorreo.value = selectedSale.vendedorCorreo;
                    inputVendedorTelefono.value = selectedSale.vendedorTelefono;

                    setFormFieldsReadOnly(true); // Establecer campos como solo lectura
                    modalNuevaVenta.show();
                }
            });
        });

        // Add event listeners to the "Editar" buttons
        document.querySelectorAll('.editar-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                const selectedSale = salesData.find(sale => sale.id === saleId);
                if (selectedSale) {
                    // Configurar el modal para el modo "Editar"
                    modalTitleNuevaVenta.textContent = 'Modificar Venta Existente';
                    botonGuardarCambiosModal.style.display = 'block'; // Mostrar Guardar Cambios
                    botonCerrarModal.style.display = 'block'; // Mostrar Cerrar

                    // Llenar los campos del formulario con los datos de la venta seleccionada
                    inputVentaIdOculto.value = selectedSale.id;
                    inputRemitoNuevaVenta.value = selectedSale.remito;
                    inputReferenciaNuevaVenta.value = selectedSale.referencia;
                    inputClienteNombreCompleto.value = selectedSale.clienteNombreCompleto;
                    inputClienteDNI.value = selectedSale.clienteDNI;
                    inputClienteCorreo.value = selectedSale.clienteCorreo;
                    inputClienteTelefono.value = selectedSale.clienteTelefono;

                    if (selectedSale.permuta === 'Sí') {
                        radioPermutaSi.checked = true;
                    } else {
                        radioPermutaNo.checked = true;
                    }

                    inputVehiculoMarca.value = selectedSale.vehiculoMarca;
                    inputVehiculoModelo.value = selectedSale.vehiculoModelo;
                    inputVehiculoColor.value = selectedSale.vehiculoColor;

                    if (selectedSale.financiacion === 'Sí') {
                        radioFinanciacionSi.checked = true;
                        planFinanciacionDiv.style.display = 'block';
                        if (selectedSale.planFinanciacion === 'Plan 90-10') {
                            radioPlan9010.checked = true;
                        } else if (selectedSale.planFinanciacion === 'Plan 70-30') {
                            radioPlan7030.checked = true;
                        } else {
                            radioPlan9010.checked = false;
                            radioPlan7030.checked = false;
                        }
                    } else {
                        radioFinanciacionNo.checked = true;
                        planFinanciacionDiv.style.display = 'none';
                        radioPlan9010.checked = false;
                        radioPlan7030.checked = false;
                    }
                    selectMetodoPago.value = selectedSale.metodoPago;
                    inputVendedorNombreCompleto.value = selectedSale.vendedorNombreCompleto;
                    inputVendedorCorreo.value = selectedSale.vendedorCorreo;
                    inputVendedorTelefono.value = selectedSale.vendedorTelefono;

                    setFormFieldsReadOnly(false); // Hacer campos editables
                    modalNuevaVenta.show();
                }
            });
        });

        // Add event listeners to the "Eliminar" buttons
        document.querySelectorAll('.eliminar-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                if (confirm(`¿Estás seguro de que deseas eliminar la venta con Remito N° ${salesData.find(s => s.id === saleId).remito}?`)) {
                    const index = salesData.findIndex(sale => sale.id === saleId);
                    if (index > -1) {
                        salesData.splice(index, 1);
                    }
                    renderizarVentas();
                    alert('Venta eliminada con éxito.');
                }
            });
        });
    }

    // Lógica para mostrar/ocultar el plan de financiación
    const togglePlanFinanciacion = () => {
        if (radioFinanciacionSi.checked) {
            planFinanciacionDiv.style.display = 'block';
        } else {
            planFinanciacionDiv.style.display = 'none';
            if (radioPlan9010.checked) radioPlan9010.checked = false;
            if (radioPlan7030.checked) radioPlan7030.checked = false;
        }
    };

    radioFinanciacionSi.addEventListener('change', togglePlanFinanciacion);
    radioFinanciacionNo.addEventListener('change', togglePlanFinanciacion);


    // Evento al hacer clic en el botón "Nueva Venta"
    botonNuevaVenta.addEventListener('click', () => {
        formNuevaVenta.reset(); // Limpiar el formulario al abrir el modal
        radioFinanciacionNo.checked = true; // Asegurarse de que "No" esté seleccionado por defecto
        togglePlanFinanciacion(); // Ocultar el div de plan de financiación al abrir el modal

        // Configurar el modal para el modo "Nueva Venta"
        modalTitleNuevaVenta.textContent = 'Registrar Nueva Venta';
        botonGuardarCambiosModal.style.display = 'block'; // Mostrar Guardar Cambios
        botonCerrarModal.style.display = 'block'; // Mostrar Cerrar

        inputVentaIdOculto.value = ''; // Limpiar el ID oculto
        setFormFieldsReadOnly(false); // Hacer campos editables
        modalNuevaVenta.show();
    });

    // Evento al hacer clic en el botón "Guardar Cambios" (para agregar nuevas ventas o modificar existentes)
    botonGuardarCambiosModal.addEventListener('click', () => {
        const ventaActualizada = getSaleDataFromForm();

        if (!validateSaleForm(ventaActualizada)) {
            return; // Si la validación falla, detener la ejecución
        }

        if (ventaActualizada.id) { // Si hay un ID, estamos editando una venta existente
            const index = salesData.findIndex(sale => sale.id === ventaActualizada.id);
            if (index > -1) {
                Object.assign(salesData[index], ventaActualizada);
                alert('Venta modificada con éxito.');
            }
        } else { // Si no hay ID, es una nueva venta
            ventaActualizada.id = nextIdVenta++;
            salesData.push(ventaActualizada);
            alert('Nueva venta registrada con éxito.');
        }

        renderizarVentas(); // Volver a renderizar la tabla
        modalNuevaVenta.hide(); // Cerrar el modal
        formNuevaVenta.reset(); // Limpiar el formulario
    });


    // Establecer "Empleados" como activo por defecto y mostrarlo
    const empleadosNavLink = document.querySelector('a[href="#empleados-section"]');
    if (empleadosNavLink) {
        empleadosNavLink.classList.add('active');
        empleadosSection.style.display = 'block';
    }
});