const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Recupero il punteggio massimno dal local storage

let highScore = localStorage.getItem("high-score") || 0; /* API HTML5 (API WEB STORAGE DI HTML5) */
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Premi OK per riprovare...");
    location.reload();
}

const resetHighScoreButton = document.getElementById("reset-high-score");

resetHighScoreButton.addEventListener("click", () => {              /* L'aggiunta di un listener agli eventi è parte dell'API degli eventi di HTML5. In questo caso, si tratta di un evento di click */
    // Reimposto il punteggio massimo a 0 nel localStorage
    localStorage.setItem("high-score", 0);
    
    // Aggiorno l'elemento HTML del punteggio massimo
    highScoreElement.innerText = "High Score: 0";
});


// Cambio la velocità n base alla freccia premuta
const changeDirection = e => {
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Cambio direzione ad ogni click di una freccia

controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Quando il serpente mangia il cibo
    if (snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score++;
        highScore = score >= highScore ? score : highScore; // se score > high score => high score = score

        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;

        // Chiamata per salvare il punteggio sul server
        saveScoreToServer(score, highScore);
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100); /* setInterval è parte dell'API di temporizzazione di HTML5 e viene utilizzato per eseguire la funzione initGame a intervalli regolari */
document.addEventListener("keyup", changeDirection); /* La registrazione degli eventi della tastiera tramite addEventListener è parte dell'API degli eventi di HTML5. In questo caso, l'evento "keyup" è utilizzato per gestire il cambiamento della direzione del serpente */

function saveScoreToServer(score, highScore) {    
    var xhr = new XMLHttpRequest();
    var url = 'http://localhost:3000/saveScore'; 

    // Preparo i dati da inviare
    var data = {
        score: score,
        highScore: highScore
    };

    // Configuro la richiesta
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    // Risposta dal server
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log('Punteggio salvato con successo:', xhr.responseText);
            } else {
                console.error('Errore durante il salvataggio del punteggio. Codice di stato:', xhr.status);
            }
        }
    };

    // Invio la richiesta
    xhr.send(JSON.stringify(data));
}
