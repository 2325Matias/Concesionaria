document.addEventListener('DOMContentLoaded', function () {
    const catalogoAutos = document.getElementById('catalogo-autos');
    const formularioContacto = document.getElementById('formulario-contacto');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    const mensajeError = document.getElementById('mensaje-error');

    // Referencias al Modal
    const detalleAutoModal = new bootstrap.Modal(document.getElementById('detalleAutoModal'));
    const modalNombreAuto = document.getElementById('modalNombreAuto');
    const modalDescripcionAuto = document.getElementById('modalDescripcionAuto');
    const modalPrecioAuto = document.getElementById('modalPrecioAuto');
    const modalCarouselInner = document.getElementById('modalCarouselInner');
    const modalCarouselIndicators = document.getElementById('modalCarouselIndicators');


    // --- DATOS DE AUTOS ---
    // Asegúrate de que las rutas de las imágenes sean correctas y existan.
    // He añadido campos 'imagenesDetalle' y 'descripcionDetallada'.
    let autos = [
        {
            id: 'sedan',
            nombre: 'Sedán Elegante',
            descripcion: 'Un sedán de lujo con gran confort y tecnología avanzada.', // Descripción corta para la tarjeta
            imagen: 'img/autos/yaris/toyota yaris.jpg.jpg', // Imagen principal para la tarjeta
            precio: '$29.741.000',
            imagenesDetalle: [ // Imágenes para el carousel del modal
                'img/autos/yaris/toyota yaris.jpg.jpg', // Puedes repetir la principal
                'img/autos/yaris/1.jpeg', // Asegúrate que esta imagen exista
                'img/autos/yaris/2.jpeg', // Asegúrate que esta imagen exista
                'img/autos/yaris/3.jpeg'  // Asegúrate que esta imagen exista
            ],
            descripcionDetallada: 'Este Sedán Elegante no solo destaca por su diseño sofisticado, sino también por su interior espacioso y acabados de primera calidad. Equipado con la última tecnología en asistencia al conductor, sistema de infoentretenimiento con pantalla táctil, y un motor eficiente que ofrece una experiencia de conducción suave y potente. Ideal para quienes buscan lujo, confort y seguridad en cada viaje.'
        },
        {
            id: 'suv',
            nombre: 'SUV Familiar',
            descripcion: 'Espaciosa SUV ideal para familias y aventuras.',
            imagen: 'img/autos/t-cros/1.png.png',
            precio: '$42.000',
            imagenesDetalle: [
                'img/autos/t-cros/1.png.png',
                'img/autos/t-cros/3.png.png',
                'img/autos/t-cros/4.png.png',
                'img/autos/t-cros/5.png.png',
                'img/autos/t-cros/6.png.png',
                'img/autos/t-cros/7.png.png'
            ],
            descripcionDetallada: 'La SUV Familiar combina versatilidad y robustez. Con asientos para cinco pasajeros y un amplio maletero, es perfecta para viajes largos o el día a día en la ciudad. Cuenta con sistemas de seguridad activa y pasiva, conectividad total y un diseño imponente que no pasará desapercibido.'
        },
        {
            id: 'deportivo',
            nombre: 'Deportivo Clásico',
            descripcion: 'Un deportivo icónico para los amantes de la velocidad.',
            imagen: 'img/autos/gol gti/gol gti imagen.jpg.webp',
            precio: '$60.000',
            imagenesDetalle: [
                'img/autos/gol gti/gol gti imagen.jpg.webp',
                'img/autos/gol gti/3.webp',
                'img/autos/gol gti/2.webp',
                'img/autos/gol gti/1.webp',
                'img/autos/gol gti/4.webp'
            ],
            descripcionDetallada: 'Revive la emoción de la conducción con este Deportivo Clásico. Su motor potente, diseño aerodinámico y manejo ágil te brindarán una experiencia inolvidable. Un verdadero ícono que combina historia y performance.'
        },
        {
            id: 'hatchback',
            nombre: 'Hatchback Urbano',
            descripcion: 'Compacto y ágil, perfecto para la ciudad.',
            imagen: 'img/autos/punto/v1.jpg',
            precio: '$22.000',
            imagenesDetalle: [
                'img/autos/punto/v1.jpg',
                'img/autos/punto/v2.webp',
                'img/autos/punto/v3.webp',
                'img/autos/punto/v4.webp',
                'img/autos/punto/v5.webp',
                'img/autos/punto/v6.webp'
            ],
            descripcionDetallada: 'El Hatchback Urbano es tu compañero ideal para la jungla de asfalto. Su tamaño compacto facilita el estacionamiento y la maniobrabilidad, mientras que su eficiente motor te permite ahorrar combustible. Interior moderno y bien equipado para tus trayectos diarios.'
        },
        {
            id: 'camioneta',
            nombre: 'Camioneta Robusta',
            descripcion: 'Potente y resistente, lista para cualquier desafío.',
            imagen: 'img/autos/amarok/v1.jpg',
            precio: '$48.000',
            imagenesDetalle: [
                'img/autos/amarok/v1.jpg',
                'img/autos/amarok/v2.jpg',
                'img/autos/amarok/v3.jpg',
                'img/autos/amarok/v4.jpg',
                'img/autos/amarok/v5.jpg',
                'img/autos/amarok/v6.jpg',
                'img/autos/amarok/v7.jpg',
                'img/autos/amarok/v8.jpg'
            ],
            descripcionDetallada: 'Con la Camioneta Robusta, ningún terreno es un obstáculo. Su tracción 4x4, motor de alto torque y chasis reforzado la hacen ideal para el trabajo duro o las aventuras off-road. Comodidad y tecnología se unen a su indiscutible fortaleza.'
        },
        {
            id: 'electrico',
            nombre: 'Eléctrico Eco-Friendly',
            descripcion: 'Un vehículo eléctrico con cero emisiones y diseño moderno.',
            imagen: 'img/autos/kwid/v1.webp',
            precio: '$55.000',
            imagenesDetalle: [
                'img/autos/kwid/v1.webp',
                'img/autos/kwid/v2.jpg',
                'img/autos/kwid/v3.jpg',
                'img/autos/kwid/v4.jpg'
            ],
            descripcionDetallada: 'Súmate a la movilidad sostenible con nuestro Eléctrico Eco-Friendly. Disfruta de una conducción silenciosa, cero emisiones y un costo de mantenimiento reducido. Su diseño futurista y tecnología de vanguardia te encantarán.'
        }
    ];

    function mostrarAutos() {
        catalogoAutos.innerHTML = ''; // Limpiar catálogo existente antes de volver a mostrar
        autos.forEach((auto, index) => {
            const tarjeta = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${auto.imagen}" class="card-img-top" alt="${auto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${auto.nombre}</h5>
                            <p class="card-text">${auto.descripcion}</p>
                            <p class="card-text"><small class="text-muted">Precio: ${auto.precio}</small></p>
                            <button class="btn btn-primary btn-ver-detalles" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#detalleAutoModal" 
                                    data-auto-id="${auto.id}">
                                Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
            catalogoAutos.innerHTML += tarjeta;
        });

        // Añadir event listeners a los nuevos botones "Ver Detalles"
        document.querySelectorAll('.btn-ver-detalles').forEach(boton => {
            boton.addEventListener('click', function() {
                const autoId = this.dataset.autoId;
                const autoSeleccionado = autos.find(a => a.id === autoId);
                if (autoSeleccionado) {
                    cargarDatosModal(autoSeleccionado);
                }
            });
        });
    }

    function cargarDatosModal(auto) {
        modalNombreAuto.textContent = auto.nombre;
        modalDescripcionAuto.textContent = auto.descripcionDetallada;
        modalPrecioAuto.textContent = `Precio: ${auto.precio}`;

        modalCarouselInner.innerHTML = ''; // Limpiar carousel
        modalCarouselIndicators.innerHTML = ''; // Limpiar indicadores

        auto.imagenesDetalle.forEach((imagenUrl, index) => {
            const carouselItem = `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${imagenUrl}" class="d-block w-100" alt="${auto.nombre} - Imagen ${index + 1}">
                </div>
            `;
            modalCarouselInner.innerHTML += carouselItem;

            const indicator = `
                <button type="button" data-bs-target="#carouselAutoImagenes" data-bs-slide-to="${index}" 
                        class="${index === 0 ? 'active' : ''}" 
                        aria-current="${index === 0 ? 'true' : 'false'}" 
                        aria-label="Slide ${index + 1}"></button>
            `;
            modalCarouselIndicators.innerHTML += indicator;
        });

        // No es necesario llamar a detalleAutoModal.show() aquí si el botón ya tiene data-bs-toggle y data-bs-target
        // Bootstrap se encarga de mostrarlo.
    }


    mostrarAutos(); // Mostrar autos al cargar la página

    // --- MANEJO DEL FORMULARIO DE CONTACTO (sin cambios) ---
    if (formularioContacto) {
        formularioContacto.addEventListener('submit', function (event) {
            event.preventDefault();
            // Simulación de envío de formulario
            mensajeError.style.display = 'none';
            mensajeRespuesta.style.display = 'none';

            // Validación básica (ejemplo)
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const mensaje = document.getElementById('mensaje').value;

            if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
                mensajeError.textContent = 'Por favor, completa todos los campos.';
                mensajeError.style.display = 'block';
                return;
            }
            if (!email.includes('@') || !email.includes('.')) {
                 mensajeError.textContent = 'Por favor, ingresa un email válido.';
                mensajeError.style.display = 'block';
                return;
            }


            setTimeout(() => {
                formularioContacto.reset();
                mensajeRespuesta.style.display = 'block';
                setTimeout(() => {
                    mensajeRespuesta.style.display = 'none';
                }, 3000);
            }, 1000);
        });
    }
});