document.addEventListener('DOMContentLoaded', () => {
    const userRole = sessionStorage.getItem('userRole');
    const mainNav = document.getElementById('mainNav');
    const navLinks = mainNav.querySelectorAll('.nav-link');
    const logoutLink = document.getElementById('logoutLink');
    const sections = document.querySelectorAll('.container.mt-5.pt-5');

    // Elementos específicos de la sección de accesorios
    const btnVentasAccesorios = document.getElementById('btn-ventas-accesorios');
    const btnStockAccesorios = document.getElementById('btn-stock-accesorios');
    const ventasAccesoriosContent = document.getElementById('ventas-accesorios-content');
    const stockAccesoriosContent = document.getElementById('stock-accesorios-content');

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
            case '#empleados-section':
                if (typeof renderizarEmpleados === 'function') {
                    renderizarEmpleados(document.getElementById('busqueda-empleado').value);

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
                // Por defecto a Ventas Accesorios cuando se carga la sección
                showAccesoriosContent('ventas');
                break;
        }
    }

    // Función para alternar el contenido de accesorios
    function showAccesoriosContent(view) {
        if (view === 'ventas') {
            ventasAccesoriosContent.style.display = 'block';
            stockAccesoriosContent.style.display = 'none';
            btnVentasAccesorios.classList.add('active');
            btnStockAccesorios.classList.remove('active');
            // Inicializar o volver a renderizar ventas
            if (typeof initVentasAccesorios === 'function') {
                initVentasAccesorios();
            } else if (typeof renderizarTabla === 'function') { // Fallback si initVentasAccesorios no es explícitamente necesaria
                renderizarTabla([]); // Renderizar vacío o con datos actuales si están disponibles
            }
            // Mostrar botón de nueva venta y filtro para ventas
            document.getElementById('nueva-venta-accesorios').style.display = 'inline-block';
            document.getElementById('filtro-ventas-accesorios').style.display = 'inline-block';
            document.getElementById('nuevo-accesorio').style.display = 'none';
            document.getElementById('filtro-stock-accesorios').style.display = 'none';

        } else if (view === 'stock') {
            ventasAccesoriosContent.style.display = 'none';
            stockAccesoriosContent.style.display = 'block';
            btnStockAccesorios.classList.add('active');
            btnVentasAccesorios.classList.remove('active');
            // Inicializar o volver a renderizar stock
            if (typeof initStockAccesorios === 'function') {
                initStockAccesorios();
            } else if (typeof renderizarTablaStock === 'function') { // Fallback
                renderizarTablaStock([]); // Renderizar vacío o con datos actuales si están disponibles
            }
            // Mostrar botón de nuevo accesorio y filtro para stock
            document.getElementById('nueva-venta-accesorios').style.display = 'none';
            document.getElementById('filtro-ventas-accesorios').style.display = 'none';
            document.getElementById('nuevo-accesorio').style.display = 'inline-block';
            document.getElementById('filtro-stock-accesorios').style.display = 'inline-block';
        }
    }

    // Escuchadores de eventos para la alternancia de vistas de accesorios
    if (btnVentasAccesorios) {
        btnVentasAccesorios.addEventListener('click', () => showAccesoriosContent('ventas'));
    }
    if (btnStockAccesorios) {
        btnStockAccesorios.addEventListener('click', () => showAccesoriosContent('stock'));
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