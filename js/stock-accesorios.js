// js/stock-accesorios.js
document.addEventListener('DOMContentLoaded', function() {
    const tablaStockBody = document.getElementById('tabla-stock-accesorios-body');
    const btnNuevoAccesorio = document.getElementById('nuevo-accesorio');
    const inputFiltroStock = document.getElementById('filtro-stock-accesorios');
    const btnGuardarAccesorio = document.getElementById('guardar-accesorio');

    // Nuevos elementos para la imagen
    const inputImagenAccesorioFile = document.getElementById('imagen-accesorio-input-file');
    const imagenAccesorioPreview = document.getElementById('imagen-accesorio-preview');
    const imagenAccesorioPreviewContainer = document.getElementById('imagen-accesorio-preview-container');

    // Elementos del modal (Agregados para control del título y botones)
    const nuevoAccesorioModalTitle = document.getElementById('nuevoAccesorioModalLabel'); // Asumiendo un ID para el título del modal
    const formNuevoAccesorio = document.getElementById('form-nuevo-accesorio');

    // Datos de ejemplo para el stock de accesorios
    let stockAccesorios = [
        {
            id: 1,
            codigo: "ACC-CUB-001",
            nombre: "Cubierta 185/65 R15 Pirelli",
            cantidad: 50,
            precioUnitario: 30000,
            imagenUrl: '' // Ejemplo de URL de imagen
        },
        {
            id: 2,
            codigo: "ACC-ACE-001",
            nombre: "Aceite Motor Sintético 5W30 Castrol",
            cantidad: 100,
            precioUnitario: 4500,
            imagenUrl: '' // Ejemplo de URL de imagen
        },
        {
            id: 3,
            codigo: "ACC-PAST-001",
            nombre: "Pastillas de Freno Delanteras (Juego)",
            cantidad: 20,
            precioUnitario: 8000,
            imagenUrl: '' // No hay imagen por defecto
        }
    ];

    // Instancia del modal
    let nuevoAccesorioModalInstance = new bootstrap.Modal(document.getElementById('nuevoAccesorioModal'));

    // Función para renderizar la tabla de stock
    window.renderizarTablaStock = function(datos) {
        tablaStockBody.innerHTML = '';
        datos.forEach(accesorio => {
            const imagenCell = accesorio.imagenUrl ?
                               `<img src="${accesorio.imagenUrl}" alt="${accesorio.nombre}" style="width: 50px; height: auto; border-radius: 5px;">` :
                               'No hay imagen';

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${accesorio.codigo}</td>
                <td>${accesorio.nombre}</td>
                <td>${accesorio.cantidad}</td>
                <td>$${accesorio.precioUnitario.toLocaleString()}</td>
                <td>${imagenCell}</td>
                <td>
                    <button class="btn btn-sm btn-warning btn-editar-accesorio" data-id="${accesorio.id}">Editar</button>
                    <button class="btn btn-sm btn-danger btn-eliminar-accesorio" data-id="${accesorio.id}">Eliminar</button>
                </td>
            `;
            tablaStockBody.appendChild(fila);
        });

        // Asignar event listeners a los botones de editar y eliminar
        document.querySelectorAll('.btn-editar-accesorio').forEach(button => {
            button.addEventListener('click', editarAccesorio);
        });

        document.querySelectorAll('.btn-eliminar-accesorio').forEach(button => {
            button.addEventListener('click', eliminarAccesorio);
        });
    }

    // Función para editar un accesorio
    function editarAccesorio() {
        const id = parseInt(this.getAttribute('data-id'));
        const accesorio = stockAccesorios.find(a => a.id === id);

        if (!accesorio) return;

        document.getElementById('accesorio-id-oculto').value = accesorio.id;
        document.getElementById('codigo-accesorio').value = accesorio.codigo;
        document.getElementById('nombre-accesorio').value = accesorio.nombre;
        document.getElementById('cantidad-accesorio').value = accesorio.cantidad;
        document.getElementById('precio-unitario-accesorio').value = accesorio.precioUnitario;

        // Cargar imagen para edición
        if (accesorio.imagenUrl) {
            imagenAccesorioPreview.src = accesorio.imagenUrl;
            imagenAccesorioPreviewContainer.style.display = 'block';
        } else {
            imagenAccesorioPreview.src = '#';
            imagenAccesorioPreviewContainer.style.display = 'none';
        }
        inputImagenAccesorioFile.value = ''; // Limpiar el input de archivo

        nuevoAccesorioModalTitle.textContent = 'Modificar Accesorio Existente'; // Establece el título para editar
        btnGuardarAccesorio.style.display = 'block'; // Asegura que el botón guardar sea visible
        setFormFieldsReadOnly(false, formNuevoAccesorio); // Hace los campos editables

        nuevoAccesorioModalInstance.show();
    }

    // Función para guardar un accesorio (nuevo o editado)
    function guardarAccesorio() {
        const form = document.getElementById('form-nuevo-accesorio');
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        let currentImageUrl = '';
        if (inputImagenAccesorioFile.files.length > 0) {
            // Si se seleccionó un nuevo archivo, usar su Data URL para la vista previa
            currentImageUrl = imagenAccesorioPreview.src; // La Data URL ya estará en el src de la vista previa
        } else {
            // Si no se seleccionó un nuevo archivo, intentar mantener la imagen existente del accesorio
            const id = document.getElementById('accesorio-id-oculto').value
                ? parseInt(document.getElementById('accesorio-id-oculto').value)
                : null;
            const existingAccesorio = stockAccesorios.find(a => a.id === id);
            if (existingAccesorio) {
                currentImageUrl = existingAccesorio.imagenUrl;
            }
        }

        const accesorio = {
            id: document.getElementById('accesorio-id-oculto').value
                ? parseInt(document.getElementById('accesorio-id-oculto').value)
                : Math.max(...stockAccesorios.map(a => a.id), 0) + 1,
            codigo: document.getElementById('codigo-accesorio').value,
            nombre: document.getElementById('nombre-accesorio').value,
            cantidad: parseInt(document.getElementById('cantidad-accesorio').value),
            precioUnitario: parseFloat(document.getElementById('precio-unitario-accesorio').value),
            imagenUrl: currentImageUrl // Almacenar la URL de la imagen
        };

        if (inputImagenAccesorioFile.files.length > 0) {
            alert('Advertencia: La imagen seleccionada para el accesorio solo se mostrará temporalmente. Para guardarla de forma permanente, se requiere un servidor de backend.');
        }

        const index = stockAccesorios.findIndex(a => a.id === accesorio.id);
        if (index !== -1) {
            stockAccesorios[index] = accesorio;
        } else {
            stockAccesorios.push(accesorio);
        }

        nuevoAccesorioModalInstance.hide();
        renderizarTablaStock(stockAccesorios);
    }

    // Función para eliminar un accesorio
    function eliminarAccesorio() {
        const id = parseInt(this.getAttribute('data-id'));
        if (confirm('¿Está seguro que desea eliminar este accesorio del stock?')) {
            stockAccesorios = stockAccesorios.filter(a => a.id !== id);
            renderizarTablaStock(stockAccesorios);
        }
    }

    // Event listener para el botón "Nuevo Accesorio"
    btnNuevoAccesorio.addEventListener('click', function() {
        formNuevoAccesorio.reset();
        document.getElementById('accesorio-id-oculto').value = '';
        // Limpiar y ocultar la vista previa de la imagen para una nueva entrada
        imagenAccesorioPreview.src = '#';
        imagenAccesorioPreviewContainer.style.display = 'none';
        inputImagenAccesorioFile.value = ''; // Limpiar el input de archivo

        nuevoAccesorioModalTitle.textContent = 'Registrar Nuevo Accesorio'; // Establece el título para nuevo
        btnGuardarAccesorio.style.display = 'block'; // Asegura que el botón guardar sea visible
        setFormFieldsReadOnly(false, formNuevoAccesorio); // Hace los campos editables

        nuevoAccesorioModalInstance.show();
    });

    // Event listener para el botón "Guardar" del modal
    btnGuardarAccesorio.addEventListener('click', guardarAccesorio);

    // Event listener para el input de filtro
    inputFiltroStock.addEventListener('keyup', function() {
        const filtro = inputFiltroStock.value.toLowerCase();
        const datosFiltrados = stockAccesorios.filter(accesorio =>
            accesorio.codigo.toLowerCase().includes(filtro) ||
            accesorio.nombre.toLowerCase().includes(filtro)
        );
        renderizarTablaStock(datosFiltrados);
    });

    // Event listener para el input de tipo file para mostrar la vista previa
    inputImagenAccesorioFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagenAccesorioPreview.src = e.target.result; // Esto crea una Data URL temporal
                imagenAccesorioPreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file); // Lee el archivo como una Data URL
        } else {
            imagenAccesorioPreview.src = '#';
            imagenAccesorioPreviewContainer.style.display = 'none';
        }
    });

    // Function to set form fields read-only or editable (reused from ventas.js logic)
    function setFormFieldsReadOnly(readOnly, formElement) {
        const fields = formElement.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            if (field.type === 'file') { // Excluye inputs de tipo file de ser solo lectura de la misma manera
                field.disabled = readOnly;
            } else if (field.type === 'checkbox' || field.type === 'radio') {
                field.disabled = readOnly;
            }
            else {
                field.readOnly = readOnly;
            }
        });
        // Manejo especial para elementos select si necesitan una deshabilitación visual diferente
        formElement.querySelectorAll('select').forEach(selectField => {
            if (readOnly) {
                selectField.style.pointerEvents = 'none';
                selectField.style.touchAction = 'none';
            } else {
                selectField.style.pointerEvents = 'auto';
                selectField.style.touchAction = 'auto';
            }
        });
    }

    // Mover la inicialización a una función global
    window.initStockAccesorios = function() {
        renderizarTablaStock(stockAccesorios);
        // Puedes añadir aquí otras inicializaciones si fueran necesarias
    };

    // Llama a la función de inicialización cuando el DOM esté cargado
    // Esto asegura que la tabla se renderice incluso si no se accede a través del menú
    initStockAccesorios();
});