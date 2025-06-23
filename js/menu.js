document.addEventListener('DOMContentLoaded', () => {
    const empleadosSection = document.getElementById('empleados-section');
    const ventasSection = document.getElementById('ventas-section');
    const tallerSection = document.getElementById('taller-section');
    const vehiculosSection = document.getElementById('vehiculos-section');
    const accesoriosSection = document.getElementById('accesorios-section');// NUEVO
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    // Ocultar las secciones al inicio
    empleadosSection.style.display = 'none';
    ventasSection.style.display = 'none';
    tallerSection.style.display = 'none';
    vehiculosSection.style.display = 'none';
    accesoriosSection.style.display = 'none'; // NUEVO

    // Agregar event listeners a los enlaces de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Ocultar todas las secciones antes de mostrar la correcta
            empleadosSection.style.display = 'none';
            ventasSection.style.display = 'none';
            tallerSection.style.display = 'none';
            vehiculosSection.style.display = 'none';
            accesoriosSection.style.display = 'none'; // NUEVO

            if (link.getAttribute('href') === '#empleados-section') {
                event.preventDefault();
                empleadosSection.style.display = 'block';
                // Llama a la función de renderizado desde employees.js
                if (typeof renderizarEmpleados === 'function') {
                    renderizarEmpleados(document.getElementById('busqueda-empleado').value);
                }
            } else if (link.getAttribute('href') === '#ventas-section') {
                event.preventDefault();
                ventasSection.style.display = 'block';
                // Llama a la función de renderizado desde sales.js
                if (typeof renderizarVentas === 'function') {
                    renderizarVentas(document.getElementById('busqueda-venta').value);
                }
            } else if (link.getAttribute('href') === '#taller-section') { // NUEVO
                event.preventDefault();
                tallerSection.style.display = 'block';
                // Llama a la función de renderizado desde workshop.js
                if (typeof renderizarOrdenesTaller === 'function') { // Cambiado el nombre de la función
                    renderizarOrdenesTaller(document.getElementById('busqueda-orden').value);
                }
            } else if (link.getAttribute('href') === '#vehiculos-section') {
                event.preventDefault();
                vehiculosSection.style.display = 'block';
                // Llama a la función de renderizado desde vehiculos.js
                if (typeof renderizarVehiculos === 'function') {
                    renderizarVehiculos(document.getElementById('busqueda-vehiculo').value);
                }
            } else if (link.getAttribute('href') === '#accesorios-section') {
                event.preventDefault();
                accesoriosSection.style.display = 'block';
                // Llama a la función de renderizado desde vehiculos.js
                if (typeof renderizarTabla === 'function') {
                    renderizarTabla(document.getElementById('filtro-ventas-accesorios').value);
                }
            }


            // Remover la clase 'active' de todos los enlaces y agregarla al actual
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Establecer "Empleados" como activo por defecto y mostrarlo
    const empleadosNavLink = document.querySelector('a[href="#empleados-section"]');
    if (empleadosNavLink) {
        empleadosNavLink.classList.add('active');
        empleadosSection.style.display = 'block';
        // Renderizado inicial para la sección de empleados
        if (typeof renderizarEmpleados === 'function') {
            renderizarEmpleados('');
        }
    }
});