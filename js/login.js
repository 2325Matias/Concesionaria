document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('loginError');

    // Obtener empleados de localStorage o usar datos por defecto
    function getUsers() {
        const storedUsers = localStorage.getItem('systemUsers');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        } else {
            // Datos iniciales (solo se usarán la primera vez)
            const defaultUsers = [
                { 
                    id: 1, 
                    email: 'admin@premium.quality.com', 
                    password: 'admin123', 
                    username: 'admin',
                    role: 'Administrador',
                    nombre: 'Admin Principal'
                },
                { 
                    id: 2, 
                    email: 'mecanico@premium.quality.com', 
                    password: 'mec123', 
                    username: 'mecanico1',
                    role: 'Mecánico',
                    nombre: 'Juan Mecánico'
                },
                { 
                    id: 3, 
                    email: 'recepcion@premium.quality.com', 
                    password: 'recepcion123', 
                    username: 'recepcion1',
                    role: 'Recepcionista',
                    nombre: 'María Recepcionista'
                },
                { 
                    id: 4, 
                    email: 'vendedor@premium.quality.com', 
                    password: 'ventas123', 
                    username: 'vendedor1',
                    role: 'Vendedor',
                    nombre: 'Carlos Vendedor'
                }
            ];
            localStorage.setItem('systemUsers', JSON.stringify(defaultUsers));
            return defaultUsers;
        }
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value;
        const password = passwordInput.value;

        const users = getUsers();
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            // Almacenar info mínima del usuario en sesión
            sessionStorage.setItem('userRole', foundUser.role);
            sessionStorage.setItem('userId', foundUser.id);
            sessionStorage.setItem('userName', foundUser.nombre);
            
            window.location.href = 'Menu.html';
        } else {
            loginError.style.display = 'block';
        }
    });
});
