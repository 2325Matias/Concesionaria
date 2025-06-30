document.addEventListener('DOMContentLoaded', () => {
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
    const inputBusquedaVenta = document.getElementById('busqueda-venta');
    const modalNuevaVenta = new bootstrap.Modal(document.getElementById('nuevaVentaModal'));

    // Campos para el modal Nueva/Editar Venta
    const modalTitleNuevaVenta = document.getElementById('nuevaVentaModalLabel');
    const inputVentaIdOculto = document.getElementById('venta-id-oculto');
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

    const botonGuardarCambiosModal = document.getElementById('boton-guardar-cambios-modal');
    const botonCerrarModal = document.getElementById('boton-cerrar-modal');
    const formNuevaVenta = document.getElementById('form-nueva-venta');

    let nextIdVenta = salesData.length > 0 ? Math.max(...salesData.map(s => s.id)) + 1 : 1;

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

    window.renderizarVentas = function(filtro = '') { // Se hizo global para que menu.js la pueda llamar
        tablaVentasBody.innerHTML = '';
        const textoFiltro = filtro.toLowerCase();

        const ventasFiltradas = salesData.filter(sale => {
            return (
                sale.remito.toLowerCase().includes(textoFiltro) ||
                sale.clienteNombreCompleto.toLowerCase().includes(textoFiltro)
            );
        });

        if (ventasFiltradas.length === 0 && textoFiltro !== '') {
            const noResultsRow = tablaVentasBody.insertRow();
            noResultsRow.innerHTML = `<td colspan="4" class="text-center">No se encontraron ventas que coincidan con la búsqueda.</td>`;
            return;
        }

        ventasFiltradas.forEach(sale => {
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

        document.querySelectorAll('.ver-detalles-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                const selectedSale = salesData.find(sale => sale.id === saleId);
                if (selectedSale) {
                    modalTitleNuevaVenta.textContent = 'Detalles de la Venta';
                    botonGuardarCambiosModal.style.display = 'none';
                    botonCerrarModal.style.display = 'block';

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

                    setFormFieldsReadOnly(true);
                    modalNuevaVenta.show();
                }
            });
        });

        document.querySelectorAll('.editar-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                const selectedSale = salesData.find(sale => sale.id === saleId);
                if (selectedSale) {
                    modalTitleNuevaVenta.textContent = 'Modificar Venta Existente';
                    botonGuardarCambiosModal.style.display = 'block';
                    botonCerrarModal.style.display = 'block';

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

                    setFormFieldsReadOnly(false);
                    modalNuevaVenta.show();
                }
            });
        });

        document.querySelectorAll('.eliminar-venta').forEach(button => {
            button.addEventListener('click', (event) => {
                const saleId = parseInt(event.target.dataset.id);
                if (confirm(`¿Estás seguro de que deseas eliminar la venta con Remito N° ${salesData.find(s => s.id === saleId).remito}?`)) {
                    const index = salesData.findIndex(sale => sale.id === saleId);
                    if (index > -1) {
                        salesData.splice(index, 1);
                    }
                    renderizarVentas(inputBusquedaVenta.value);
                    alert('Venta eliminada con éxito.');
                }
            });
        });
    }

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

    botonNuevaVenta.addEventListener('click', () => {
        formNuevaVenta.reset();
        radioFinanciacionNo.checked = true;
        togglePlanFinanciacion();

        modalTitleNuevaVenta.textContent = 'Registrar Nueva Venta';
        botonGuardarCambiosModal.style.display = 'block';
        botonCerrarModal.style.display = 'block';

        inputVentaIdOculto.value = '';
        setFormFieldsReadOnly(false);
        modalNuevaVenta.show();
    });

    botonGuardarCambiosModal.addEventListener('click', () => {
        const ventaActualizada = getSaleDataFromForm();

        if (!validateSaleForm(ventaActualizada)) {
            return;
        }

        if (ventaActualizada.id) {
            const index = salesData.findIndex(sale => sale.id === ventaActualizada.id);
            if (index > -1) {
                Object.assign(salesData[index], ventaActualizada);
                alert('Venta modificada con éxito.');
            }
        } else {
            ventaActualizada.id = nextIdVenta++;
            salesData.push(ventaActualizada);
            alert('Nueva venta registrada con éxito.');
        }

        renderizarVentas(inputBusquedaVenta.value);
        modalNuevaVenta.hide();
        formNuevaVenta.reset();
    });

    inputBusquedaVenta.addEventListener('keyup', () => {
        renderizarVentas(inputBusquedaVenta.value);
    });

    // Renderizado inicial cuando sales.js es cargado (si la sección de ventas está visible por defecto)
    // Podrías querer quitar esto si la sección de ventas no es la vista predeterminada al cargar la página
    // renderizarVentas();
});