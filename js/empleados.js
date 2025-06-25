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
        tr.innerHTML = `
            <td><input type="checkbox" class="form-check-input me-2 select-empleado" 
                 data-id="${user.id}" data-username="${user.username}" 
                 data-email="${user.email}" data-role="${user.role}"></td>
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
        nombre: employeeData.nombre || employeeData.username
    };
    
    users.push(newEmployee);
    saveSystemUsers(users);
    return newEmployee;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Renderizar inicialmente
    renderizarEmpleados();
    
    // Búsqueda
    document.getElementById('busqueda-empleado').addEventListener('input', function(e) {
        renderizarEmpleados(e.target.value);
    });
    
    // Selección de empleados
    document.getElementById('tabla-empleados-body').addEventListener('change', function(e) {
        if (e.target.classList.contains('select-empleado')) {
            updateButtonStates();
        }
    });
    
    // Botón Agregar
    document.getElementById('agregar-empleado').addEventListener('click', function() {
        // Limpiar formulario
        document.getElementById('agregar-usuario').value = '';
        document.getElementById('agregar-correo').value = '';
        document.getElementById('agregar-contrasena').value = '';
        document.getElementById('agregar-rol').value = '';
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('agregarEmpleadoModal'));
        modal.show();
    });
    
    // Botón Modificar
    document.getElementById('modificar-empleado').addEventListener('click', function() {
        const selected = document.querySelector('.select-empleado:checked');
        if (selected) {
            const employee = {
                username: selected.dataset.username,
                email: selected.dataset.email,
                role: selected.dataset.role,
                id: selected.dataset.id
            };
            
            // Llenar formulario
            document.getElementById('editar-usuario').value = employee.username;
            document.getElementById('editar-correo').value = employee.email;
            document.getElementById('editar-contrasena').value = '';
            document.getElementById('editar-rol').value = employee.role;
            
            // Mostrar modal
            const modal = new bootstrap.Modal(document.getElementById('editarEmpleadoModal'));
            modal.show();
        }
    });
    
    // Guardar nuevo empleado (Modal Agregar)
    document.getElementById('guardar-nuevo-empleado').addEventListener('click', function() {
        const newEmployee = {
            username: document.getElementById('agregar-usuario').value,
            email: document.getElementById('agregar-correo').value,
            password: document.getElementById('agregar-contrasena').value,
            role: document.getElementById('agregar-rol').value
        };
        
        if (newEmployee.username && newEmployee.email && newEmployee.role) {
            addNewEmployee(newEmployee);
            renderizarEmpleados();
            
            // Cerrar modal
            bootstrap.Modal.getInstance(document.getElementById('agregarEmpleadoModal')).hide();
        } else {
            alert('Por favor complete todos los campos requeridos');
        }
    });
    
    // Guardar cambios (Modal Editar)
    document.getElementById('guardar-cambios-empleado').addEventListener('click', function() {
        const selected = document.querySelector('.select-empleado:checked');
        if (selected) {
            const updatedData = {
                username: document.getElementById('editar-usuario').value,
                email: document.getElementById('editar-correo').value,
                password: document.getElementById('editar-contrasena').value,
                role: document.getElementById('editar-rol').value
            };
            
            if (updatedData.username && updatedData.email && updatedData.role) {
                if (updateEmployee(selected.dataset.id, updatedData)) {
                    renderizarEmpleados();
                    
                    // Cerrar modal
                    bootstrap.Modal.getInstance(document.getElementById('editarEmpleadoModal')).hide();
                } else {
                    alert('Error al actualizar empleado');
                }
            } else {
                alert('Por favor complete todos los campos requeridos');
            }
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
});
