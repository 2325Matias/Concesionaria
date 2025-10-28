// Obtener usuarios del sistema desde localStorage
function getSystemUsers() {
    const storedUsers = localStorage.getItem('systemUsers');
    return storedUsers ? JSON.parse(storedUsers) : [];
}

// Guardar usuarios en localStorage
function saveSystemUsers(users) {
    localStorage.setItem('systemUsers', JSON.stringify(users));
}

// Renderizar la tabla de empleados
function renderizarEmpleados(filter = '') {
    const users = getSystemUsers();
    const tbody = document.getElementById('tabla-empleados-body');
    tbody.innerHTML = '';

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(filter.toLowerCase()) ||
        user.email.toLowerCase().includes(filter.toLowerCase())
    );

    filteredUsers.forEach(user => {
        const tr = document.createElement('tr');
        const imagenCell = user.imagenUrl ?
                           `<img src="${user.imagenUrl}" alt="${user.username}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">` :
                           'No hay imagen';
        tr.innerHTML = `
            <td><input type="checkbox" class="form-check-input me-2 select-empleado"
                 data-id="${user.id}" data-username="${user.username}"
                 data-email="${user.email}" data-role="${user.role}" data-imagenurl="${user.imagenUrl || ''}"></td>
            <td>${imagenCell}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>****</td>
            <td>${user.role}</td>
        `;
        tbody.appendChild(tr);
    });

    // Actualizar estado de botones según selección
    updateButtonStates();
}

// Actualizar estado de los botones (habilitar/deshabilitar)
function updateButtonStates() {
    const selected = document.querySelector('.select-empleado:checked');
    const currentRole = sessionStorage.getItem('userRole');
    const isAdmin = currentRole === 'Administrador';

    // Habilitar/deshabilitar según permisos
    document.getElementById('agregar-empleado').disabled = !isAdmin;
    document.getElementById('modificar-empleado').disabled = !isAdmin || !selected;
    document.getElementById('eliminar-empleado').disabled = !isAdmin || !selected;
}

// Obtener empleado por ID
function getEmployeeById(id) {
    const users = getSystemUsers();
    return users.find(user => user.id == id);
}

// Actualizar empleado existente
function updateEmployee(id, updatedData) {
    const users = getSystemUsers();
    const index = users.findIndex(user => user.id == id);

    if (index !== -1) {
        // Mantener la contraseña existente si no se proporciona una nueva
        if (!updatedData.password) {
            updatedData.password = users[index].password;
        }

        users[index] = { ...users[index], ...updatedData };
        saveSystemUsers(users);
        return true;
    }
    return false;
}

// Agregar nuevo empleado
function addNewEmployee(employeeData) {
    const users = getSystemUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newEmployee = {
        id: newId,
        username: employeeData.username,
        email: employeeData.email,
        password: employeeData.password || 'temp123', // Contraseña temporal por defecto
        role: employeeData.role,
        nombre: employeeData.nombre || employeeData.username,
        imagenUrl: employeeData.imagenUrl || '' // Add image URL
    };
    users.push(newEmployee);
    saveSystemUsers(users);
    return newEmployee;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar inicialmente
    renderizarEmpleados();

    const agregarEmpleadoModal = new bootstrap.Modal(document.getElementById('agregarEmpleadoModal'));
    const editarEmpleadoModal = new bootstrap.Modal(document.getElementById('editarEmpleadoModal'));

    const formAgregarEmpleado = document.getElementById('form-agregar-empleado');
    const formEditarEmpleado = document.getElementById('form-editar-empleado');

    const inputAgregarImagenEmpleadoFile = document.getElementById('agregar-imagen-empleado-input-file');
    const previewAgregarImagenEmpleado = document.getElementById('agregar-imagen-empleado-preview');
    const previewAgregarImagenEmpleadoContainer = document.getElementById('agregar-imagen-empleado-preview-container');

    const inputEditarImagenEmpleadoFile = document.getElementById('editar-imagen-empleado-input-file');
    const previewEditarImagenEmpleado = document.getElementById('editar-imagen-empleado-preview');
    const previewEditarImagenEmpleadoContainer = document.getElementById('editar-imagen-empleado-preview-container');

    // Handle image preview for add employee
    inputAgregarImagenEmpleadoFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewAgregarImagenEmpleado.src = e.target.result;
                previewAgregarImagenEmpleadoContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewAgregarImagenEmpleado.src = '#';
            previewAgregarImagenEmpleadoContainer.style.display = 'none';
        }
    });

    // Handle image preview for edit employee
    inputEditarImagenEmpleadoFile.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewEditarImagenEmpleado.src = e.target.result;
                previewEditarImagenEmpleadoContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        } else {
            previewEditarImagenEmpleado.src = '#';
            previewEditarImagenEmpleadoContainer.style.display = 'none';
        }
    });

    // Botón Agregar Empleado
    document.getElementById('agregar-empleado').addEventListener('click', function() {
        formAgregarEmpleado.reset();
        previewAgregarImagenEmpleado.src = '#';
        previewAgregarImagenEmpleadoContainer.style.display = 'none';
        agregarEmpleadoModal.show();
    });

    // Botón Guardar Nuevo Empleado
    document.getElementById('guardar-nuevo-empleado').addEventListener('click', function() {
        const username = document.getElementById('agregar-usuario').value;
        const email = document.getElementById('agregar-correo').value;
        const password = document.getElementById('agregar-contrasena').value;
        const role = document.getElementById('agregar-rol').value;
        const imagenUrl = previewAgregarImagenEmpleado.src !== '#' ? previewAgregarImagenEmpleado.src : '';

        if (username && email && password && role) {
            addNewEmployee({ username, email, password, role, imagenUrl });
            renderizarEmpleados();
            agregarEmpleadoModal.hide();
        } else {
            alert('Por favor complete todos los campos requeridos');
        }
    });

    // Botón Modificar Empleado
    document.getElementById('modificar-empleado').addEventListener('click', function() {
        const selected = document.querySelector('.select-empleado:checked');
        if (selected) {
            const employeeId = selected.dataset.id;
            const employee = getEmployeeById(employeeId);

            if (employee) {
                document.getElementById('editar-usuario').value = employee.username;
                document.getElementById('editar-correo').value = employee.email;
                // No cargar la contraseña por seguridad
                document.getElementById('editar-contrasena').value = '';
                document.getElementById('editar-rol').value = employee.role;

                // Cargar imagen para edición
                if (employee.imagenUrl) {
                    previewEditarImagenEmpleado.src = employee.imagenUrl;
                    previewEditarImagenEmpleadoContainer.style.display = 'block';
                } else {
                    previewEditarImagenEmpleado.src = '#';
                    previewEditarImagenEmpleadoContainer.style.display = 'none';
                }
                inputEditarImagenEmpleadoFile.value = ''; // Clear file input for new selection

                // Store employee ID in a data attribute on the save button for easy retrieval
                document.getElementById('guardar-cambios-empleado').dataset.id = employeeId;
                editarEmpleadoModal.show();
            }
        } else {
            alert('Por favor seleccione un empleado para modificar.');
        }
    });

    // Botón Guardar Cambios de Empleado
    document.getElementById('guardar-cambios-empleado').addEventListener('click', function() {
        const employeeId = this.dataset.id;
        const updatedData = {
            username: document.getElementById('editar-usuario').value,
            email: document.getElementById('editar-correo').value,
            password: document.getElementById('editar-contrasena').value, // This will be empty if not changed
            role: document.getElementById('editar-rol').value,
            imagenUrl: previewEditarImagenEmpleado.src !== '#' ? previewEditarImagenEmpleado.src : '' // Get updated image URL
        };

        if (updatedData.username && updatedData.email && updatedData.role) {
            if (updateEmployee(employeeId, updatedData)) {
                renderizarEmpleados();
                editarEmpleadoModal.hide();
            } else {
                alert('Error al actualizar empleado');
            }
        } else {
            alert('Por favor complete todos los campos requeridos');
        }
    });

    // Botón Eliminar
    document.getElementById('eliminar-empleado').addEventListener('click', function() {
        const selected = document.querySelector('.select-empleado:checked');
        if (selected) {
            if (confirm('¿Está seguro de eliminar este empleado?')) {
                const employeeId = parseInt(selected.dataset.id);
                const users = getSystemUsers();
                const filteredUsers = users.filter(user => user.id !== employeeId);
                saveSystemUsers(filteredUsers);
                renderizarEmpleados();
            }
        }
    });

    // Filtro de búsqueda de empleados
    document.getElementById('busqueda-empleado').addEventListener('keyup', function() {
        renderizarEmpleados(this.value);
    });

    // Manejar la selección de checkboxes para habilitar/deshabilitar botones
    document.getElementById('tabla-empleados-body').addEventListener('change', function(event) {
        if (event.target.classList.contains('select-empleado')) {
            // Desmarcar otros checkboxes para permitir solo una selección
            document.querySelectorAll('.select-empleado').forEach(cb => {
                if (cb !== event.target) {
                    cb.checked = false;
                }
            });
            updateButtonStates();
        }
    });

    // Asegurar que los botones estén deshabilitados si no hay selección al cargar
    updateButtonStates();
});