document.addEventListener('DOMContentLoaded', function() {
    const catalogoAutos = document.getElementById('catalogo-autos');
    const formularioContacto = document.getElementById('formulario-contacto');
    const mensajeRespuesta = document.getElementById('mensaje-respuesta');
    const mensajeError = document.getElementById('mensaje-error');

    let autos = [
        {
            nombre: 'Sedán Elegante',
            descripcion: 'Un sedán de lujo con gran confort y tecnología avanzada.',
            imagen: 'img/autos/yaris/toyota yaris.jpg',
            precio: '$29.741.000'
        },
        {
            nombre: 'SUV Familiar',
            descripcion: 'Espaciosa SUV ideal para familias y aventuras.',
            imagen: 'img/autos/t-cros/1.png',
            precio: '$33.000.000'
        },
        {
            nombre: 'Deportivo Clásico',
            descripcion: 'Un deportivo icónico para los amantes de la velocidad.',
            imagen: 'img/autos/gol gti/gol gti imagen.jpg',
            precio: '$55.000.000'
        },
        {
            nombre: 'Hatchback Urbano',
            descripcion: 'Compacto y ágil, perfecto para la ciudad.',
            imagen: 'img/autos/punto/v1 redi.jpg',
            precio: '$18.000.000'
        },
        {
            nombre: 'Camioneta Robusta',
            descripcion: 'Potente y resistente, lista para cualquier desafío.',
            imagen: 'img/autos/amarok/v1.jpg',
            precio: '$48.000'
        },
        {
            nombre: 'Eléctrico Eco-Friendly',
            descripcion: 'Un vehículo eléctrico con cero emisiones y diseño moderno.',
            imagen: 'img/autos/kwid/v1.jpg',
            precio: '$55.000'
        },
        // Puedes agregar más autos aquí
    ];

    let autosMostradosInicialmente = 6;
    let autosMostradosActual = 0;

    function mostrarAutos(cantidad) {
        for (let i = autosMostradosActual; i < Math.min(autosMostradosActual + cantidad, autos.length); i++) {
            const auto = autos[i];
            const tarjeta = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${auto.imagen}" class="card-img-top" alt="${auto.nombre}">
                        <div class="card-body">
                            <h5 class="card-title">${auto.nombre}</h5>
                            <p class="card-text">${auto.descripcion}</p>
                            <p class="card-text"><small class="text-muted">Precio: ${auto.precio}</small></p>
                            <a href="#" class="btn btn-primary">Ver Detalles</a>
                        </div>
                    </div>
                </div>
            `;
            catalogoAutos.innerHTML += tarjeta;
        }
        autosMostradosActual = Math.min(autosMostradosActual + cantidad, autos.length);
        if (autosMostradosActual === autos.length) {
            cargarMasBtn.style.display = 'none';
        } else {
            cargarMasBtn.style.display = 'block';
        }
    }

    mostrarAutos(autosMostradosInicialmente);

    formularioContacto.addEventListener('submit', function(event) {
        event.preventDefault();
        // Simulación de envío de formulario (aquí iría la lógica real)
        setTimeout(() => {
            formularioContacto.reset();
            mensajeRespuesta.style.display = 'block';
            mensajeError.style.display = 'none';
            setTimeout(() => {
                mensajeRespuesta.style.display = 'none';
            }, 3000);
        }, 1000); // Simula un pequeño retraso
    });
});