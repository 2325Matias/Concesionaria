document.addEventListener('DOMContentLoaded', () => {
    // Datos iniciales de vehículos
    const vehiculosData = [
        {
            id: 1,
            tipo: 'Nuevo',
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2024,
            color: 'Blanco',
            kilometraje: 0,
            precio: 25000,
            estado: 'Disponible',
            patente: 'ABC123',
            motor: '1.8L 4 Cilindros',
            transmision: 'Automática',
            descripcion: 'Versión XEI full equipada con pantalla táctil y asientos de cuero'
        },
        {
            id: 2,
            tipo: 'Usado',
            marca: 'Ford',
            modelo: 'Fiesta',
            año: 2020,
            color: 'Rojo',
            kilometraje: 35000,
            precio: 15000,
            estado: 'Reservado',
            patente: 'DEF456',
            motor: '1.6L 4 Cilindros',
            transmision: 'Manual',
            descripcion: 'Excelente estado general, mantenimiento al día'
        }
    ];

    const tablaVehiculosBody = document.getElementById('tabla-vehiculos-body');
    const botonNuevoVehiculo = document.getElementById('nuevo-vehiculo');
    const inputBusquedaVehiculo = document.getElementById('busqueda-vehiculo');
    const modalNuevoVehiculo = new bootstrap.Modal(document.getElementById('nuevoVehiculoModal'));

    // Elementos del modal
    const modalTitleNuevoVehiculo = document.getElementById('nuevoVehiculoModalLabel');
    const inputVehiculoIdOculto = document.getElementById('vehiculo-id-oculto');
    const radioTipoNuevo = document.getElementById('tipo-nuevo');
    const radioTipoUsado = document.getElementById('tipo-usado');
    const inputMarca = document.getElementById('marca');
    const inputModelo = document.getElementById('modelo');
    const inputAnio = document.getElementById('anio');
    const inputColor = document.getElementById('color');
    const inputKilometraje = document.getElementById('kilometraje');
    const inputPrecio = document.getElementById('precio');
    const selectEstado = document.getElementById('estado-vehiculo');
    const inputPatente = document.getElementById('patente');
    const inputMotor = document.getElementById('motor');
    const inputTransmision = document.getElementById('transmision');
    const inputDescripcion = document.getElementById('descripcion');
    const botonGuardarVehiculo = document.getElementById('guardar-vehiculo');
    const botonCerrarModalVehiculo = document.getElementById('boton-cerrar-modal-vehiculo');
    const formNuevoVehiculo = document.getElementById('form-nuevo-vehiculo');

    let nextIdVehiculo = vehiculosData.length > 0 ? Math.max(...vehiculosData.map(v => v.id)) + 1 : 1;

    function getVehiculoDataFromForm() {
        const id = inputVehiculoIdOculto.value ? parseInt(inputVehiculoIdOculto.value) : null;
        const tipo = radioTipoNuevo.checked ? 'Nuevo' : 'Usado';
        
        return {
            id: id,
            tipo: tipo,
            marca: inputMarca.value.trim(),
            modelo: inputModelo.value.trim(),
            año: parseInt(inputAnio.value),
            color: inputColor.value.trim(),
            kilometraje: parseInt(inputKilometraje.value) || 0,
            precio: parseFloat(inputPrecio.value),
            estado: selectEstado.value,
            patente: inputPatente.value.trim(),
            motor: inputMotor.value.trim(),
            transmision: inputTransmision.value.trim(),
            descripcion: inputDescripcion.value.trim()
        };
    }

    function validateVehiculoForm(vehiculo) {
        if (!vehiculo.marca || !vehiculo.modelo || !vehiculo.año || 
            !vehiculo.color || !vehiculo.precio || !vehiculo.estado) {
            alert('Por favor, completa todos los campos obligatorios.');
            return false;
        }
        return true;
    }

    function setFormFieldsReadOnly(readOnly) {
        const fields = formNuevoVehiculo.querySelectorAll('input, textarea, select');
        fields.forEach(field => {
            if (field.type === 'radio') {
                field.disabled = readOnly;
            } else {
                field.readOnly = readOnly;
            }
        });
        
        if (readOnly) {
            selectEstado.style.pointerEvents = 'none';
            selectEstado.style.touchAction = 'none';
        } else {
            selectEstado.style.pointerEvents = 'auto';
            selectEstado.style.touchAction = 'auto';
        }
    }

    function renderizarVehiculos(filtro = '') {
        tablaVehiculosBody.innerHTML = '';
        const textoFiltro = filtro.toLowerCase();

        const vehiculosFiltrados = vehiculosData.filter(vehiculo => {
            return (
                vehiculo.marca.toLowerCase().includes(textoFiltro) ||
                vehiculo.modelo.toLowerCase().includes(textoFiltro) ||
                vehiculo.año.toString().includes(textoFiltro) ||
                vehiculo.patente.toLowerCase().includes(textoFiltro)
            );
        });

        if (vehiculosFiltrados.length === 0 && textoFiltro !== '') {
            const noResultsRow = tablaVehiculosBody.insertRow();
            noResultsRow.innerHTML = `<td colspan="10" class="text-center">No se encontraron vehículos que coincidan con la búsqueda.</td>`;
            return;
        }

        vehiculosFiltrados.forEach(vehiculo => {
            const kilometrajeDisplay = vehiculo.tipo === 'Nuevo' ? '0 km' : `${vehiculo.kilometraje.toLocaleString()} km`;
            
            const row = tablaVehiculosBody.insertRow();
            row.innerHTML = `
                <td>${vehiculo.tipo}</td>
                <td>${vehiculo.marca}</td>
                <td>${vehiculo.modelo}</td>
                <td>${vehiculo.año}</td>
                <td>${vehiculo.color}</td>
                <td>${kilometrajeDisplay}</td>
                <td>$${vehiculo.precio.toLocaleString()}</td>
                <td>${vehiculo.estado}</td>
                <td>${vehiculo.patente}</td>
                <td class="text-center">
                    <button class="btn btn-info btn-sm me-1 ver-detalles-vehiculo" data-id="${vehiculo.id}">Ver</button>
                    <button class="btn btn-warning btn-sm me-1 editar-vehiculo" data-id="${vehiculo.id}">Modificar</button>
                    <button class="btn btn-danger btn-sm eliminar-vehiculo" data-id="${vehiculo.id}">Eliminar</button>
                </td>
            `;
        });

        // Agregar event listeners a los botones
        document.querySelectorAll('.ver-detalles-vehiculo').forEach(button => {
            button.addEventListener('click', (event) => {
                const vehiculoId = parseInt(event.target.dataset.id);
                const vehiculo = vehiculosData.find(v => v.id === vehiculoId);
                if (vehiculo) {
                    modalTitleNuevoVehiculo.textContent = 'Detalles del Vehículo';
                    botonGuardarVehiculo.style.display = 'none';
                    botonCerrarModalVehiculo.style.display = 'block';

                    llenarFormularioVehiculo(vehiculo);
                    setFormFieldsReadOnly(true);
                    modalNuevoVehiculo.show();
                }
            });
        });

        document.querySelectorAll('.editar-vehiculo').forEach(button => {
            button.addEventListener('click', (event) => {
                const vehiculoId = parseInt(event.target.dataset.id);
                const vehiculo = vehiculosData.find(v => v.id === vehiculoId);
                if (vehiculo) {
                    modalTitleNuevoVehiculo.textContent = 'Modificar Vehículo';
                    botonGuardarVehiculo.style.display = 'block';
                    botonCerrarModalVehiculo.style.display = 'block';

                    llenarFormularioVehiculo(vehiculo);
                    setFormFieldsReadOnly(false);
                    modalNuevoVehiculo.show();
                }
            });
        });

        document.querySelectorAll('.eliminar-vehiculo').forEach(button => {
            button.addEventListener('click', (event) => {
                const vehiculoId = parseInt(event.target.dataset.id);
                const vehiculo = vehiculosData.find(v => v.id === vehiculoId);
                if (vehiculo && confirm(`¿Estás seguro de que deseas eliminar el vehículo ${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.patente})?`)) {
                    const index = vehiculosData.findIndex(v => v.id === vehiculoId);
                    if (index > -1) {
                        vehiculosData.splice(index, 1);
                    }
                    renderizarVehiculos(inputBusquedaVehiculo.value);
                    alert('Vehículo eliminado con éxito.');
                }
            });
        });
    }

    function llenarFormularioVehiculo(vehiculo) {
        inputVehiculoIdOculto.value = vehiculo.id;
        
        if (vehiculo.tipo === 'Nuevo') {
            radioTipoNuevo.checked = true;
        } else {
            radioTipoUsado.checked = true;
        }
        
        inputMarca.value = vehiculo.marca;
        inputModelo.value = vehiculo.modelo;
        inputAnio.value = vehiculo.año;
        inputColor.value = vehiculo.color;
        inputKilometraje.value = vehiculo.kilometraje;
        inputPrecio.value = vehiculo.precio;
        selectEstado.value = vehiculo.estado;
        inputPatente.value = vehiculo.patente;
        inputMotor.value = vehiculo.motor;
        inputTransmision.value = vehiculo.transmision;
        inputDescripcion.value = vehiculo.descripcion;
    }

    botonNuevoVehiculo.addEventListener('click', () => {
        formNuevoVehiculo.reset();
        radioTipoNuevo.checked = true;
        modalTitleNuevoVehiculo.textContent = 'Agregar Nuevo Vehículo';
        botonGuardarVehiculo.style.display = 'block';
        botonCerrarModalVehiculo.style.display = 'block';
        inputVehiculoIdOculto.value = '';
        setFormFieldsReadOnly(false);
        modalNuevoVehiculo.show();
    });

    botonGuardarVehiculo.addEventListener('click', () => {
        const vehiculo = getVehiculoDataFromForm();

        if (!validateVehiculoForm(vehiculo)) {
            return;
        }

        if (vehiculo.id) {
            const index = vehiculosData.findIndex(v => v.id === vehiculo.id);
            if (index > -1) {
                Object.assign(vehiculosData[index], vehiculo);
                alert('Vehículo modificado con éxito.');
            }
        } else {
            vehiculo.id = nextIdVehiculo++;
            vehiculosData.push(vehiculo);
            alert('Nuevo vehículo agregado con éxito.');
        }

        renderizarVehiculos(inputBusquedaVehiculo.value);
        modalNuevoVehiculo.hide();
    });

    inputBusquedaVehiculo.addEventListener('keyup', () => {
        renderizarVehiculos(inputBusquedaVehiculo.value);
    });

    // Renderizar vehículos al cargar la página
    renderizarVehiculos();
});

