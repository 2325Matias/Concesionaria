// js/accesorios.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const tablaBody = document.getElementById('tabla-accesorios-body');
    const btnNuevaVenta = document.getElementById('nueva-venta-accesorios');
    const inputBusqueda = document.getElementById('filtro-ventas-accesorios');
    const btnGuardar = document.getElementById('guardar-venta-accesorios');
    
    // Datos de ejemplo
    let ventasAccesorios = [
        {
            id: 1,
            remito: "REM-ACC-001",
            cliente: "Juan Pérez",
            telefono: "1122334455",
            producto: "cubiertas",
            descripcion: "4 cubiertas 185/65 R15",
            precio: 120000,
            fecha: "15/05/2023"
        },
        {
            id: 2,
            remito: "REM-ACC-002",
            cliente: "María Gómez",
            telefono: "1144556677",
            producto: "aceite_motor",
            descripcion: "Aceite sintético 5W30 + filtro",
            precio: 8500,
            fecha: "18/05/2023"
        }
    ];

    // ** DECLARA LA INSTANCIA DEL MODAL FUERA DE LA FUNCIÓN PARA REUTILIZARLA **
    let nuevaVentaAccesoriosModalInstance;

    // Inicializar
    window.initVentasAccesorios = function() { // Make it global
        renderizarTabla(ventasAccesorios);
        setupEventListeners();
        // ** INICIALIZA LA INSTANCIA DEL MODAL UNA SOLA VEZ AQUÍ **
        nuevaVentaAccesoriosModalInstance = new bootstrap.Modal(document.getElementById('nuevaVentaAccesoriosModal'));
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Nueva venta
        btnNuevaVenta.addEventListener('click', function() {
            document.getElementById('form-nueva-venta-accesorios').reset();
            document.getElementById('venta-accesorios-id').value = '';
            document.getElementById('fecha-venta-accesorios').valueAsDate = new Date();
            
            // ** USA LA INSTANCIA YA CREADA PARA MOSTRAR EL MODAL **
            nuevaVentaAccesoriosModalInstance.show();
        });

        // Filtrado automático al escribir
        inputBusqueda.addEventListener('input', filtrarVentas);

        // Guardar venta
        btnGuardar.addEventListener('click', guardarVenta);
    }

    // Renderizar tabla
    window.renderizarTabla = function(datos) { // Made global to be callable from menu.js
        tablaBody.innerHTML = '';
        
        datos.forEach(venta => {
            const fila = document.createElement('tr');
            
            // Mapear nombre de producto
            const productos = {
                "cubiertas": "Cubiertas",
                "aceite_motor": "Aceite Motor", 
                "aceite_caja": "Aceite Caja",
                "pastillas": "Pastillas Freno",
                "otros": "Otros"
            };
            const nombreProducto = productos[venta.producto] || "Otros";
            
            fila.innerHTML = `
                <td>${venta.remito}</td>
                <td>${venta.cliente}</td>
                <td>${nombreProducto}</td>
                <td>${venta.descripcion}</td>
                <td>$${venta.precio.toLocaleString()}</td>
                <td>${venta.fecha}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-ver-detalles" data-id="${venta.id}">Ver</button>
                    <button class="btn btn-sm btn-warning btn-editar" data-id="${venta.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar" data-id="${venta.id}">Eliminar</button>
                </td>
            `;
            
            tablaBody.appendChild(fila);
        });
        
        // Event listeners para botones de acción
        document.querySelectorAll('.btn-ver-detalles').forEach(btn => {
            btn.addEventListener('click', verDetalles);
        });
        
        document.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', editarVenta);
        });
        
        document.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', eliminarVenta);
        });
    }

    // Filtrar ventas automáticamente al escribir
    function filtrarVentas() {
        const termino = inputBusqueda.value.toLowerCase();
        
        if (!termino) {
            renderizarTabla(ventasAccesorios);
            return;
        }
        
        const resultados = ventasAccesorios.filter(venta => 
            venta.cliente.toLowerCase().includes(termino) || 
            venta.remito.toLowerCase().includes(termino)
        );
        
        renderizarTabla(resultados);
    }

    // Ver detalles en modal
    function verDetalles() {
        const id = parseInt(this.getAttribute('data-id'));
        const venta = ventasAccesorios.find(v => v.id === id);
        
        if (venta) {
            const productos = {
                "cubiertas": "Cubiertas",
                "aceite_motor": "Aceite de Motor", 
                "aceite_caja": "Aceite de Caja",
                "pastillas": "Pastillas de Freno",
                "otros": "Otros"
            };
            const nombreProducto = productos[venta.producto] || "Otros";
            
            document.getElementById('detalles-venta-body').innerHTML = `
                <div class="row">
                    <div class="col-6 fw-bold">N° Remito:</div>
                    <div class="col-6">${venta.remito}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Cliente:</div>
                    <div class="col-6">${venta.cliente}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Teléfono:</div>
                    <div class="col-6">${venta.telefono}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Producto:</div>
                    <div class="col-6">${nombreProducto}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Descripción:</div>
                    <div class="col-6">${venta.descripcion}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Precio:</div>
                    <div class="col-6">$${venta.precio.toLocaleString()}</div>
                </div>
                <div class="row mt-2">
                    <div class="col-6 fw-bold">Fecha:</div>
                    <div class="col-6">${venta.fecha}</div>
                </div>
            `;
            
            // Para el modal de detalles, también es buena práctica crear la instancia solo una vez
            // O si solo se usa una vez como aquí, puedes obtener la instancia directamente.
            // Si el modal de detalles también te da problemas, aplica la misma lógica.
            const detallesVentaModal = new bootstrap.Modal(document.getElementById('detallesVentaModal'));
            detallesVentaModal.show();
        }
    }

    // Editar venta
    function editarVenta() {
        const id = parseInt(this.getAttribute('data-id'));
        const venta = ventasAccesorios.find(v => v.id === id);
        
        if (!venta) return;
        
        // Llenar formulario
        document.getElementById('venta-accesorios-id').value = venta.id;
        document.getElementById('numero-remito-accesorios').value = venta.remito;
        document.getElementById('cliente-nombre-accesorios').value = venta.cliente;
        document.getElementById('cliente-telefono-accesorios').value = venta.telefono;
        document.getElementById('producto-accesorios').value = venta.producto;
        document.getElementById('descripcion-accesorios').value = venta.descripcion;
        document.getElementById('precio-accesorios').value = venta.precio;
        
        // Formatear fecha
        const [day, month, year] = venta.fecha.split('/');
        document.getElementById('fecha-venta-accesorios').value = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        // ** USA LA INSTANCIA YA CREADA PARA MOSTRAR EL MODAL **
        nuevaVentaAccesoriosModalInstance.show();
    }

    // Guardar venta (nueva o edición)
    function guardarVenta() {
        const form = document.getElementById('form-nueva-venta-accesorios');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        
        const venta = {
            id: document.getElementById('venta-accesorios-id').value 
                ? parseInt(document.getElementById('venta-accesorios-id').value) 
                : Math.max(...ventasAccesorios.map(v => v.id), 0) + 1,
            remito: document.getElementById('numero-remito-accesorios').value,
            cliente: document.getElementById('cliente-nombre-accesorios').value,
            telefono: document.getElementById('cliente-telefono-accesorios').value,
            producto: document.getElementById('producto-accesorios').value,
            descripcion: document.getElementById('descripcion-accesorios').value,
            precio: parseFloat(document.getElementById('precio-accesorios').value),
            fecha: formatFecha(document.getElementById('fecha-venta-accesorios').value)
        };
        
        // Actualizar o agregar
        const index = ventasAccesorios.findIndex(v => v.id === venta.id);
        if (index !== -1) {
            ventasAccesorios[index] = venta;
        } else {
            ventasAccesorios.push(venta);
        }
        
        // ** USA LA INSTANCIA YA CREADA PARA ESCONDER EL MODAL **
        nuevaVentaAccesoriosModalInstance.hide();
        renderizarTabla(ventasAccesorios);
    }

    // Eliminar venta
    function eliminarVenta() {
        const id = parseInt(this.getAttribute('data-id'));
        
        if (confirm('¿Está seguro que desea eliminar esta venta?')) {
            ventasAccesorios = ventasAccesorios.filter(v => v.id !== id);
            renderizarTabla(ventasAccesorios);
        }
    }

    // Formatear fecha
    function formatFecha(fechaStr) {
        const fecha = new Date(fechaStr);
        return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    }
});