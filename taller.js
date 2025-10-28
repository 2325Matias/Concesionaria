document.addEventListener('DOMContentLoaded', () => {
    // Datos de ejemplo para órdenes de taller
    const workshopOrdersData = [
        {
            id: 1,
            nOrden: 'OT-001-2025',
            problemaReportado: 'Cambio de aceite y filtro',
            clienteNombreCompleto: 'Carlos Gomez',
            clienteDNI: '34.567.890',
            clienteCorreo: 'carlos.gomez@example.com',
            clienteTelefono: '1133445566',
            vehiculoMarca: 'Renault',
            vehiculoModelo: 'Clio',
            vehiculoPatente: 'ABC123',
            vehiculoKilometraje: 85000,
            turno: '2025-07-10', // Added turno
            estadoOrden: 'Completado',
            observacionesMecanico: 'Se realizó el cambio de aceite y filtro. Neumáticos revisados, presión correcta.',
            mecanicoAsignado: 'Roberto Pérez'
        },
        {
            id: 2,
            nOrden: 'OT-002-2025',
            problemaReportado: 'Revisión de frenos, ruido al frenar',
            clienteNombreCompleto: 'Laura Fernández',
            clienteDNI: '45.678.901',
            clienteCorreo: 'laura.fernandez@example.com',
            clienteTelefono: '1177889900',
            vehiculoMarca: 'Fiat',
            vehiculoModelo: 'Cronos',
            vehiculoPatente: 'DEF456',
            vehiculoKilometraje: 30000,
            turno: '2025-07-15', // Added turno
            estadoOrden: 'En Proceso',
            observacionesMecanico: 'Pastillas de freno delanteras desgastadas. Se solicitó reemplazo.',
            mecanicoAsignado: 'Marta Díaz'
        }
    ];

    const tablaOrdenesBody = document.getElementById('tabla-ordenes-body');
    const botonNuevaOrden = document.getElementById('nueva-orden');
    const inputBusquedaOrden = document.getElementById('busqueda-orden');
    const modalNuevaOrden = new bootstrap.Modal(document.getElementById('nuevaOrdenModal'));

    // Campos para el modal Nueva/Editar Orden de Taller
    const modalTitleNuevaOrden = document.getElementById('nuevaOrdenModalLabel');
    const inputOrdenIdOculto = document.getElementById('orden-id-oculto');
    const inputNOrdenTaller = document.getElementById('n-orden-taller');
    const inputProblemaReportado = document.getElementById('problema-reportado');

    const inputTallerClienteNombreCompleto = document.getElementById('taller-cliente-nombre-completo');
    const inputTallerClienteDNI = document.getElementById('taller-cliente-dni');
    const inputTallerClienteCorreo = document.getElementById('taller-cliente-correo');
    const inputTallerClienteTelefono = document.getElementById('taller-cliente-telefono');

    const inputTallerVehiculoMarca = document.getElementById('taller-vehiculo-marca');
    const inputTallerVehiculoModelo = document.getElementById('taller-vehiculo-modelo');
    const inputTallerVehiculoPatente = document.getElementById('taller-vehiculo-patente');
    const inputTallerVehiculoKilometraje = document.getElementById('taller-vehiculo-kilometraje');

    const inputTurnoOrden = document.getElementById('turno-orden'); // New: Get the turno input
    const selectEstadoOrden = document.getElementById('estado-orden');
    const inputObservacionesMecanico = document.getElementById('observaciones-mecanico');
    const inputMecanicoAsignado = document.getElementById('mecanico-asignado');

    const botonGuardarCambiosOrden = document.getElementById('boton-guardar-cambios-orden');
    const botonCerrarOrdenModal = document.getElementById('boton-cerrar-orden-modal');
    const formNuevaOrden = document.getElementById('form-nueva-orden');

    let nextIdOrden = workshopOrdersData.length > 0 ? Math.max(...workshopOrdersData.map(o => o.id)) + 1 : 1;

    function getWorkshopOrderDataFromForm() {
        const id = inputOrdenIdOculto.value ? parseInt(inputOrdenIdOculto.value) : null;
        return {
            id: id,
            nOrden: inputNOrdenTaller.value.trim(),
            problemaReportado: inputProblemaReportado.value.trim(),
            clienteNombreCompleto: inputTallerClienteNombreCompleto.value.trim(),
            clienteDNI: inputTallerClienteDNI.value.trim(),
            clienteCorreo: inputTallerClienteCorreo.value.trim(),
            clienteTelefono: inputTallerClienteTelefono.value.trim(),
            vehiculoMarca: inputTallerVehiculoMarca.value.trim(),
            vehiculoModelo: inputTallerVehiculoModelo.value.trim(),
            vehiculoPatente: inputTallerVehiculoPatente.value.trim(),
            vehiculoKilometraje: inputTallerVehiculoKilometraje.value ? parseInt(inputTallerVehiculoKilometraje.value) : null,
            turno: inputTurnoOrden.value, // New: Get turno value
            estadoOrden: selectEstadoOrden.value,
            observacionesMecanico: inputObservacionesMecanico.value.trim(),
            mecanicoAsignado: inputMecanicoAsignado.value.trim()
        };
    }

    function validateWorkshopOrderForm(order) {
        if (!order.nOrden || !order.problemaReportado || !order.clienteNombreCompleto || !order.clienteDNI ||
            !order.clienteCorreo || !order.clienteTelefono || !order.vehiculoMarca || !order.vehiculoModelo ||
            !order.vehiculoPatente || !order.estadoOrden || !order.turno) { // Added !order.turno
            alert('Por favor, completa todos los campos obligatorios para la orden de taller, incluyendo el día del turno.'); // Updated alert message
            return false;
        }
        return true;
    }

    function setFormFieldsReadOnlyWorkshop(readOnly) {
        const fields = formNuevaOrden.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            field.readOnly = readOnly;
            if (field.tagName === 'SELECT') {
                field.style.pointerEvents = readOnly ? 'none' : 'auto';
                field.style.touchAction = readOnly ? 'none' : 'auto';
            }
        });
    }

    window.renderizarOrdenesTaller = function(filtro = '') {
        tablaOrdenesBody.innerHTML = '';
        const textoFiltro = filtro.toLowerCase();

        const ordenesFiltradas = workshopOrdersData.filter(order => {
            return (
                order.nOrden.toLowerCase().includes(textoFiltro) ||
                order.clienteNombreCompleto.toLowerCase().includes(textoFiltro) ||
                order.vehiculoPatente.toLowerCase().includes(textoFiltro)
            );
        });

        if (ordenesFiltradas.length === 0 && textoFiltro !== '') {
            const noResultsRow = tablaOrdenesBody.insertRow();
            noResultsRow.innerHTML = `<td colspan="6" class="text-center">No se encontraron órdenes de taller que coincidan con la búsqueda.</td>`; // Changed colspan to 6
            return;
        }

        ordenesFiltradas.forEach(order => {
            const row = tablaOrdenesBody.insertRow();
            row.innerHTML = `
                <td>${order.nOrden}</td>
                <td>${order.clienteNombreCompleto}</td>
                <td>${order.vehiculoMarca} ${order.vehiculoModelo} (${order.vehiculoPatente})</td>
                <td>${order.estadoOrden}</td>
                <td>${order.turno}</td> <td>
                    <button class="btn btn-info btn-sm me-1 ver-detalles-orden" data-id="${order.id}">Ver</button>
                    <button class="btn btn-warning btn-sm me-1 editar-orden" data-id="${order.id}">Modificar</button>
                    <button class="btn btn-danger btn-sm eliminar-orden" data-id="${order.id}">Eliminar</button>
                </td>
            `;
        });

        document.querySelectorAll('.ver-detalles-orden').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = parseInt(event.target.dataset.id);
                const selectedOrder = workshopOrdersData.find(order => order.id === orderId);
                if (selectedOrder) {
                    modalTitleNuevaOrden.textContent = 'Detalles de la Orden de Taller';
                    botonGuardarCambiosOrden.style.display = 'none';
                    botonCerrarOrdenModal.style.display = 'block';

                    inputOrdenIdOculto.value = selectedOrder.id;
                    inputNOrdenTaller.value = selectedOrder.nOrden;
                    inputProblemaReportado.value = selectedOrder.problemaReportado;
                    inputTallerClienteNombreCompleto.value = selectedOrder.clienteNombreCompleto;
                    inputTallerClienteDNI.value = selectedOrder.clienteDNI;
                    inputTallerClienteCorreo.value = selectedOrder.clienteCorreo;
                    inputTallerClienteTelefono.value = selectedOrder.clienteTelefono;
                    inputTallerVehiculoMarca.value = selectedOrder.vehiculoMarca;
                    inputTallerVehiculoModelo.value = selectedOrder.vehiculoModelo;
                    inputTallerVehiculoPatente.value = selectedOrder.vehiculoPatente;
                    inputTallerVehiculoKilometraje.value = selectedOrder.vehiculoKilometraje;
                    inputTurnoOrden.value = selectedOrder.turno; // New: Set turno value
                    selectEstadoOrden.value = selectedOrder.estadoOrden;
                    inputObservacionesMecanico.value = selectedOrder.observacionesMecanico;
                    inputMecanicoAsignado.value = selectedOrder.mecanicoAsignado;

                    setFormFieldsReadOnlyWorkshop(true);
                    modalNuevaOrden.show();
                }
            });
        });

        document.querySelectorAll('.editar-orden').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = parseInt(event.target.dataset.id);
                const selectedOrder = workshopOrdersData.find(order => order.id === orderId);
                if (selectedOrder) {
                    modalTitleNuevaOrden.textContent = 'Modificar Orden de Taller Existente';
                    botonGuardarCambiosOrden.style.display = 'block';
                    botonCerrarOrdenModal.style.display = 'block';

                    inputOrdenIdOculto.value = selectedOrder.id;
                    inputNOrdenTaller.value = selectedOrder.nOrden;
                    inputProblemaReportado.value = selectedOrder.problemaReportado;
                    inputTallerClienteNombreCompleto.value = selectedOrder.clienteNombreCompleto;
                    inputTallerClienteDNI.value = selectedOrder.clienteDNI;
                    inputTallerClienteCorreo.value = selectedOrder.clienteCorreo;
                    inputTallerClienteTelefono.value = selectedOrder.clienteTelefono;
                    inputTallerVehiculoMarca.value = selectedOrder.vehiculoMarca;
                    inputTallerVehiculoModelo.value = selectedOrder.vehiculoModelo;
                    inputTallerVehiculoPatente.value = selectedOrder.vehiculoPatente;
                    inputTallerVehiculoKilometraje.value = selectedOrder.vehiculoKilometraje;
                    inputTurnoOrden.value = selectedOrder.turno; // New: Set turno value
                    selectEstadoOrden.value = selectedOrder.estadoOrden;
                    inputObservacionesMecanico.value = selectedOrder.observacionesMecanico;
                    inputMecanicoAsignado.value = selectedOrder.mecanicoAsignado;

                    setFormFieldsReadOnlyWorkshop(false);
                    modalNuevaOrden.show();
                }
            });
        });

        document.querySelectorAll('.eliminar-orden').forEach(button => {
            button.addEventListener('click', (event) => {
                const orderId = parseInt(event.target.dataset.id);
                if (confirm(`¿Estás seguro de que deseas eliminar la orden N° ${workshopOrdersData.find(o => o.id === orderId).nOrden}?`)) {
                    const index = workshopOrdersData.findIndex(order => order.id === orderId);
                    if (index > -1) {
                        workshopOrdersData.splice(index, 1);
                    }
                    renderizarOrdenesTaller(inputBusquedaOrden.value);
                    alert('Orden de taller eliminada con éxito.');
                }
            });
        });
    }

    botonNuevaOrden.addEventListener('click', () => {
        formNuevaOrden.reset();
        selectEstadoOrden.value = ''; // Limpiar select
        inputTurnoOrden.value = ''; // New: Clear turno input
        modalTitleNuevaOrden.textContent = 'Registrar Nueva Orden de Taller';
        botonGuardarCambiosOrden.style.display = 'block';
        botonCerrarOrdenModal.style.display = 'block';

        inputOrdenIdOculto.value = '';
        setFormFieldsReadOnlyWorkshop(false);
        modalNuevaOrden.show();
    });

    botonGuardarCambiosOrden.addEventListener('click', () => {
        const ordenActualizada = getWorkshopOrderDataFromForm();

        if (!validateWorkshopOrderForm(ordenActualizada)) {
            return;
        }

        if (ordenActualizada.id) {
            const index = workshopOrdersData.findIndex(order => order.id === ordenActualizada.id);
            if (index > -1) {
                Object.assign(workshopOrdersData[index], ordenActualizada);
                alert('Orden de taller modificada con éxito.');
            }
        } else {
            ordenActualizada.id = nextIdOrden++;
            workshopOrdersData.push(ordenActualizada);
            alert('Nueva orden de taller registrada con éxito.');
        }

        renderizarOrdenesTaller(inputBusquedaOrden.value);
        modalNuevaOrden.hide();
        formNuevaOrden.reset();
    });

    inputBusquedaOrden.addEventListener('keyup', () => {
        renderizarOrdenesTaller(inputBusquedaOrden.value);
    });

    // Renderizado inicial (puedes descomentar si quieres que se muestre por defecto al cargar la página)
    // renderizarOrdenesTaller();
});