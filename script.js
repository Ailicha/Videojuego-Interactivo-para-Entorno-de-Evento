// Emojis de corazones para el juego
const heartEmojis = ['❤️', '💕', '💖', '💗', '💓', '💝', '💞', '💟'];

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
            <div class="card-front">
                <div class="rainbow"></div>
            </div>
            <div class="card-back">${emoji}</div>
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

// Verificar si las tarjetas coinciden
function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.emoji === card2.dataset.emoji) {
        // Coinciden
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            flippedCards = [];
            canFlip = true;

            // Verificar victoria
            if (matchedPairs === heartEmojis.length) {
                setTimeout(() => {
                    showWinPopup();
                }, 500);
            }
        }, 500);
    } else {
        // No coinciden
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
    
    // Recrear el tablero
    createBoard();
}

// Iniciar el juego
function startGame() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').classList.add('active');
    createBoard();
}

