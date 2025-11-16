// Emojis de corazones para el juego
const heartEmojis = ['💜', '💚', '❤️‍🔥', '🩶', '🩵', '💝', '🧡', '💟'];

// Frases motivadoras para la derrota
const loseMessages = [
    "El amor siempre vuelve, ¡intentemos de nuevo! 💗",
    "¡No pasa nada! Cada intento te acerca más al amor verdadero 💞",
    "Respirá profundo, sos magia. ¡Probemos otra vez! ✨❤️",
    "El amor requiere paciencia, ¡sigamos intentando! 💕",
    "Cada error es un paso más cerca del éxito. ¡Vamos! 💖"
];

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let mistakes = 0;
const maxMistakes = 5; // Número máximo de errores permitidos
let canFlip = true;

// Crear el tablero de juego
function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    
    // Duplicar los emojis para crear parejas
    const pairs = [...heartEmojis, ...heartEmojis];
    
    // Mezclar aleatoriamente
    shuffleArray(pairs);
    
    // Crear las tarjetas
    pairs.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.dataset.color = (index % 8) + 1;
        
        card.innerHTML = `
        <div class="card-front">${emoji}</div>
        <div class="card-back">
            <div class="rainbow"></div>
        </div>
    `;
   
        
        card.addEventListener('click', () => flipCard(card));
        board.appendChild(card);
        cards.push(card);
    });
}

// Mezclar array aleatoriamente
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Voltear una tarjeta
function flipCard(card) {
    // No permitir voltear si:
    // - No se puede voltear en este momento
    // - La tarjeta ya está volteada
    // - La tarjeta ya está emparejada (matched)
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false;
        checkMatch();
    }
}

// Crear estrellitas cuando hay un match correcto
function createMatchStars(card1, card2) {
    // Obtener posiciones de las tarjetas
    const rect1 = card1.getBoundingClientRect();
    const rect2 = card2.getBoundingClientRect();
    
    // Crear 1 o 2 estrellitas desde cada tarjeta
    const numStars = Math.random() > 0.5 ? 1 : 2;
    
    for (let i = 0; i < numStars; i++) {
        // Estrellita desde la primera tarjeta
        const star1 = document.createElement('span');
        star1.className = 'star match-star';
        star1.textContent = '⭐';
        star1.style.left = (rect1.left + rect1.width / 2) + 'px';
        star1.style.top = (rect1.top + rect1.height / 2) + 'px';
        star1.style.animationDelay = (i * 0.1) + 's';
        document.body.appendChild(star1);
        
        // Remover después de la animación
        setTimeout(() => {
            if (star1.parentNode) {
                star1.remove();
            }
        }, 1500);
        
        // Estrellita desde la segunda tarjeta
        const star2 = document.createElement('span');
        star2.className = 'star match-star';
        star2.textContent = '⭐';
        star2.style.left = (rect2.left + rect2.width / 2) + 'px';
        star2.style.top = (rect2.top + rect2.height / 2) + 'px';
        star2.style.animationDelay = (i * 0.1 + 0.05) + 's';
        document.body.appendChild(star2);
        
        // Remover después de la animación
        setTimeout(() => {
            if (star2.parentNode) {
                star2.remove();
            }
        }, 1500);
    }
}

// Verificar si las tarjetas coinciden
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Coinciden - las tarjetas quedan permanentemente boca arriba (mostrando corazones) hasta el final del juego
        // Crear estrellitas de éxito
        createMatchStars(card1, card2);
        
        // Asegurar que ambas tarjetas estén volteadas (boca arriba) mostrando los corazones
        card1.classList.add('flipped');
        card2.classList.add('flipped');
        
        // Marcar como matched para que queden fuera de juego y permanezcan estáticas
        card1.classList.add('matched');
        card2.classList.add('matched');
        
        // Aplicar estilos inline para garantizar que queden boca arriba
        card1.style.transform = 'rotateY(180deg)';
        card2.style.transform = 'rotateY(180deg)';
        card1.style.pointerEvents = 'none';
        card2.style.pointerEvents = 'none';
        
        // Actualizar estado del juego
        matchedPairs++;
        flippedCards = [];
        canFlip = true;

        // Verificar victoria
        if (matchedPairs === heartEmojis.length) {
            setTimeout(() => {
                showWinPopup();
            }, 500);
        }
    } else {
        // No coinciden - volver a tapar después de 1 segundo
        mistakes++;
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;

            // Verificar derrota
            if (mistakes >= maxMistakes) {
                setTimeout(() => {
                    showLosePopup();
                }, 500);
            }
        }, 1000);
    }
}

// Mostrar pop-up de derrota
function showLosePopup() {
    const popup = document.getElementById('losePopup');
    const message = document.getElementById('loseMessage');
    message.textContent = loseMessages[Math.floor(Math.random() * loseMessages.length)];
    popup.classList.add('active');
}

// Mostrar pop-up de victoria con estrellitas
function showWinPopup() {
    createStars();
    const popup = document.getElementById('winPopup');
    popup.classList.add('active');
}

// Crear estrellitas animadas cuando finaliza el juego
function createStars() {
    const container = document.getElementById('starsContainer');
    container.innerHTML = '';
    
    // Crear más estrellitas para un efecto más impactante
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.textContent = '⭐';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 20 + '%'; // Empezar desde diferentes alturas
        star.style.animationDelay = Math.random() * 2 + 's';
        star.style.animationDuration = (Math.random() * 2 + 2) + 's';
        container.appendChild(star);
    }
}

// Reiniciar el juego
function restartGame() {
    // Ocultar pop-ups
    document.getElementById('losePopup').classList.remove('active');
    document.getElementById('winPopup').classList.remove('active');
    document.getElementById('starsContainer').innerHTML = '';
    
    // Resetear variables
    flippedCards = [];
    matchedPairs = 0;
    mistakes = 0;
    canFlip = true;
    cards = [];
    
    // Limpiar el tablero anterior completamente
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';
    
    // Recrear el tablero (todas las tarjetas empezarán boca abajo)
    createBoard();
}

// Iniciar el juego
function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').classList.add('active');
    createBoard();
}

