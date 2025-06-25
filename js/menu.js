document.addEventListener('DOMContentLoaded', () => {
    const userRole = sessionStorage.getItem('userRole');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('.nav-link');
    const logoutLink = document.getElementById('logoutLink');
    const sections = document.querySelectorAll('.container.mt-5.pt-5');

    // Si no hay rol, redirigir al login
    if (!userRole) {
        window.location.href = 'Login.html';
        return;
    }

    // Ocultar todas las secciones al inicio
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Función para ejecutar el renderizado de cada sección
    function executeSectionScript(sectionId) {
        switch (sectionId) {
            // En la función executeSectionScript, actualizamos el caso de empleados:
            case '#empleados-section':
                if (typeof renderizarEmpleados === 'function') {
                    renderizarEmpleados(document.getElementById('busqueda-empleado').value);

                    // Verificar si el usuario actual es admin para habilitar botones
                    const currentRole = sessionStorage.getItem('userRole');
                    const isAdmin = currentRole === 'Administrador';

                    document.getElementById('agregar-empleado').disabled = !isAdmin;
                    document.getElementById('modificar-empleado').disabled = !isAdmin;
                    document.getElementById('eliminar-empleado').disabled = !isAdmin;
                }
                break;

            case '#ventas-section':
                if (typeof renderizarVentas === 'function') {
                    renderizarVentas(document.getElementById('busqueda-venta').value);
                }
                break;
            case '#taller-section':
                if (typeof renderizarOrdenesTaller === 'function') {
                    renderizarOrdenesTaller(document.getElementById('busqueda-orden').value);
                }
                break;
            case '#vehiculos-section':
                if (typeof renderizarVehiculos === 'function') {
                    renderizarVehiculos(document.getElementById('busqueda-vehiculo').value);
                }
                break;
            case '#accesorios-section':
                if (typeof renderizarTabla === 'function') {
                    renderizarTabla(document.getElementById('filtro-ventas-accesorios').value);
                }
                break;
        }
    }

    // Filtrar enlaces de navegación y configurar eventos
    let firstAccessibleSectionId = null;

    navLinks.forEach(link => {
        const allowedRoles = link.getAttribute('data-role');
        const sectionId = link.getAttribute('href');

        if (allowedRoles && !allowedRoles.split(',').includes(userRole)) {
            link.parentElement.style.display = 'none';
        } else if (sectionId && sectionId.startsWith('#')) {
            link.parentElement.style.display = 'list-item';

            if (!firstAccessibleSectionId) {
                firstAccessibleSectionId = sectionId;
            }

            link.addEventListener('click', (event) => {
                event.preventDefault();

                // Remover 'active' de todos los enlaces
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');

                // Ocultar todas las secciones
                sections.forEach(sec => {
                    sec.style.display = 'none';
                });

                // Mostrar la sección correspondiente
                const targetSection = document.querySelector(sectionId);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    // Ejecutar el script de renderizado correspondiente
                    executeSectionScript(sectionId);
                }
            });
        }
    });

    // Manejar el cierre de sesión
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            sessionStorage.removeItem('userRole');
            window.location.href = 'Login.html';
        });
    }

    // Mostrar la primera sección accesible por defecto
    if (firstAccessibleSectionId) {
        const defaultLink = document.querySelector(`a[href="${firstAccessibleSectionId}"]`);
        if (defaultLink) {
            defaultLink.classList.add('active');
            const targetSection = document.querySelector(firstAccessibleSectionId);
            if (targetSection) {
                targetSection.style.display = 'block';
                // Ejecutar el script de renderizado correspondiente
                executeSectionScript(firstAccessibleSectionId);
            }
        }
    } else {
        alert('No tienes permisos para ver ninguna sección. Redirigiendo al login.');
        sessionStorage.removeItem('userRole');
        window.location.href = 'Login.html';
    }
});
