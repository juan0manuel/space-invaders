// Espera a que todo el contenido del DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Selecciona todos los divs dentro del contenedor con clase 'cuadricula'
    const cuadros = document.querySelectorAll('.cuadricula div');
    // Selecciona el elemento que muestra el resultado (puntuación o mensaje)
    const resultadoMuestra = document.querySelector('#resultado');
    let ancho = 15; // Define el ancho de la cuadrícula
    let posicionNave = 202; // Posición inicial de la nave
    let posicionInvasores = 0; // Posición de los invasores
    let invasoresAlienDestruidos = []; // Array para guardar los invasores eliminados
    let resultado = 0; // Puntuación inicial
    let direccion = 1; // Dirección inicial de los invasores (derecha)
    let invasorId; // ID del intervalo que moverá a los invasores

    // Posiciones iniciales de los invasores en la cuadrícula
    const invasoresAlien = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, // Primera fila
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24, // Segunda fila
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39 // Tercera fila
    ];

    // Coloca los invasores en sus posiciones iniciales
    invasoresAlien.forEach(invasor => cuadros[posicionInvasores + invasor].classList.add('invasor'));

    // Coloca la nave en su posición inicial en la cuadrícula
    cuadros[posicionNave].classList.add("nave");

    // Función para mover la nave hacia la izquierda o derecha
    function moverNave(e) {
        // Elimina la clase 'nave' de la posición actual
        cuadros[posicionNave].classList.remove("nave");

        // Mueve la nave en función de la tecla presionada (izquierda o derecha)
        switch (e.code) {
            case 'ArrowLeft': // Flecha izquierda
                if (posicionNave % ancho !== 0) posicionNave -= 1; // Evita que salga del borde izquierdo
                break;
            case 'ArrowRight': // Flecha derecha
                if (posicionNave % ancho < ancho - 1) posicionNave += 1; // Evita que salga del borde derecho
                break;
        }
        // Vuelve a agregar la clase 'nave' en la nueva posición
        cuadros[posicionNave].classList.add("nave");
    };

    // Detecta cuándo el usuario presiona una tecla para mover la nave
    document.addEventListener("keydown", moverNave);

    // Función para mover los invasores de un lado a otro
    function moverInvasores() {
        const bordeIzq = invasoresAlien[0] % ancho === 0; // Verifica si están en el borde izquierdo
        const bordeDer = invasoresAlien[invasoresAlien.length - 1] % ancho === ancho - 1; // Verifica si están en el borde derecho

        // Cambia la dirección cuando los invasores llegan a los bordes
        if ((bordeIzq && direccion === -1) || (bordeDer && direccion === 1)) {
            direccion = ancho; // Baja una fila cuando alcanzan un borde
        } else if (direccion === ancho) {
            // Cambia de dirección después de bajar una fila
            if (bordeIzq) direccion = 1; // Moverse a la derecha
            else direccion = -1; // Moverse a la izquierda
        }

        // Elimina la clase 'invasor' de las posiciones actuales de los invasores
        for (let i = 0; i <= invasoresAlien.length - 1; i++) {
            cuadros[invasoresAlien[i]].classList.remove('invasor');
        }

        // Mueve a los invasores a su nueva posición
        for (let i = 0; i <= invasoresAlien.length - 1; i++) {
            invasoresAlien[i] += direccion;
        }

        // Agrega la clase 'invasor' a las nuevas posiciones
        for (let i = 0; i <= invasoresAlien.length - 1; i++) {
            if (!invasoresAlienDestruidos.includes(i)) {
                cuadros[invasoresAlien[i]].classList.add('invasor');
            }
        }

        // Verifica si un invasor ha colisionado con la nave
        if (cuadros[posicionNave].classList.contains('invasor', 'nave')) {
            resultadoMuestra.textContent = "Game Over"; // Muestra mensaje de 'Game Over'
            cuadros[posicionNave].classList.add("boom"); // Efecto de explosión
            clearInterval(invasorId); // Detiene el movimiento de los invasores
        }

        // Verifica si todos los invasores han sido eliminados
        if (invasoresAlienDestruidos.length === invasoresAlien.length) {
            resultadoMuestra.textContent = '¡Ganaste!'; // Muestra mensaje de victoria
            clearInterval(invasorId); // Detiene el movimiento de los invasores
        }
    }

    // Mueve a los invasores cada 500 milisegundos
    invasorId = setInterval(moverInvasores, 500);

    // Función para disparar un láser desde la nave
    function disparo(e) {
        let laserId;
        let posicionLaser = posicionNave; // El láser comienza en la posición de la nave

        // Función para mover el láser hacia arriba
        function moverLaser() {
            cuadros[posicionLaser].classList.remove('laser'); // Elimina el láser de la posición actual
            posicionLaser -= ancho; // Mueve el láser una fila hacia arriba
            cuadros[posicionLaser].classList.add('laser'); // Agrega el láser en la nueva posición

            // Verifica si el láser impacta un invasor
            if (cuadros[posicionLaser].classList.contains('invasor')) {
                cuadros[posicionLaser].classList.remove('laser', 'invasor'); // Elimina el láser y el invasor
                cuadros[posicionLaser].classList.add('boom'); // Efecto de explosión

                // Elimina la explosión después de 250 ms
                setTimeout(() => cuadros[posicionLaser].classList.remove("boom"), 250);
                clearInterval(laserId); // Detiene el láser

                // Guarda el invasor destruido y actualiza la puntuación
                const AlienDestruido = invasoresAlien.indexOf(posicionLaser);
                invasoresAlienDestruidos.push(AlienDestruido);
                resultado++;
                resultadoMuestra.textContent = resultado; // Actualiza el resultado
            }

            // Si el láser llega al borde superior, se elimina
            if (posicionLaser < ancho) {
                clearInterval(laserId);
                setTimeout(() => cuadros[posicionLaser].classList.remove('laser'), 100);
            }
        }

        // Detecta si se ha presionado la barra espaciadora para disparar
        switch (e.keyCode) {
            case 32: // Código de la barra espaciadora
                laserId = setInterval(moverLaser, 100); // Mueve el láser cada 100 ms
                break;
        }
    }

    // Detecta cuando el jugador suelta una tecla para disparar
    document.addEventListener('keyup', disparo);
});
