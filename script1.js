var db;
var request = indexedDB.open("TrisGameDatabase", 1);
request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("scores", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("player1", "player1", { unique: false });
    objectStore.createIndex("player2", "player2", { unique: false });
    objectStore.createIndex("score", "score", { unique: false });
};

request.onsuccess = function (event) {
    db = event.target.result;
};

request.onerror = function (event) {
    console.error("Errore nell'apertura del database:", event.target.errorCode);
};

function saveScores() {
    var transaction = db.transaction(["scores"], "readwrite");
    var objectStore = transaction.objectStore("scores");
    var request = objectStore.add({
        player1: player1Name,
        player2: player2Name,
        score: player1Score + " - " + player2Score
    });

    request.onsuccess = function (event) {
        console.log("Punteggi salvati con successo nel database!");
    };

    request.onerror = function (event) {
        console.error("Errore nel salvataggio dei punteggi:", event.target.errorCode);
    };
}

function viewScores() {
    var transaction = db.transaction(["scores"], "readonly");
    var objectStore = transaction.objectStore("scores");
    var request = objectStore.openCursor();
    request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            console.log("ID:", cursor.key, "Player 1:", cursor.value.player1, "Player 2:", cursor.value.player2, "Score:", cursor.value.score);
            cursor.continue();
        } else {
            console.log("Fine dei punteggi nel database.");
        }
    };

    request.onerror = function (event) {
        console.error("Errore nel recupero dei punteggi:", event.target.errorCode);
    };
}

function viewScores() {
    var modal = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");

    // Pulisco il contenuto della finestra modale
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }

    var transaction = db.transaction(["scores"], "readonly");
    var objectStore = transaction.objectStore("scores");
    var request = objectStore.openCursor(null, 'prev');  
    request.onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            // Mostro solo l'ultima partita
            var scoreInfo = document.createElement("p");
            scoreInfo.innerText = "Giocatore 1: " + cursor.value.player1 + ", Giocatore 2: " + cursor.value.player2 + ", Punteggio: " + cursor.value.score;
            modalContent.appendChild(scoreInfo);
            modal.style.display = "block"; 
            return;  
        } else {
            console.log("Nessun punteggio nel database.");
        }
    };

    request.onerror = function (event) {
        console.error("Errore nel recupero dei punteggi:", event.target.errorCode);
    };
}

function closeModal() {
    var modal = document.getElementById("modal");
    var modalContent = document.getElementById("modal-content");
    while (modalContent.firstChild) {
        modalContent.removeChild(modalContent.firstChild);
    }
    modal.style.display = "none";
}

var playerTurn, moves, isGameOver, span, restartButton;
playerTurn = "x";
moves = 0;
isGameOver = false;
span = document.getElementsByTagName("span");
restartButton = '<button onclick="playAgain()">Rigioca</button>';

// Variabili per memorizzare i nomi e il punteggio dei giocatori
var player1Name, player2Name, player1Score = 0, player2Score = 0;

// Aggiungo la definizione dell'elemento highScoreElement
var highScoreElement = document.getElementById("high-score");

function startGame() {
    player1Name = document.getElementById("player1Name").value || "Giocatore 1";
    player2Name = document.getElementById("player2Name").value || "Giocatore 2";
    // Aggiorno il display dei nomi dei giocatori
    document.getElementById("score").innerText = "Punteggio: " + player1Name + ": 0, " + player2Name + ": 0";
    updatePlayerNames();  // Chiamata per aggiornare i nomi dei giocatori nell'HTML
}

function updatePlayerNames() {
    // Aggiorno il testo con i nomi dei giocatori
    document.getElementById("displayPlayer1Name").innerText = player1Name;
    document.getElementById("displayPlayer2Name").innerText = player2Name;
}

// Variabili per memorizzare i nomi e il punteggio dei giocatori
var player1Name, player2Name, player1Score = 0, player2Score = 0;

function play(y) {
    if (y.dataset.player == "none" && window.isGameOver == false) {
        y.innerHTML = playerTurn;
        y.dataset.player = playerTurn;
        moves++;
        if (playerTurn == "x") {
            playerTurn = "o";
        } else if (playerTurn == "o") {
            playerTurn = "x";
        }
    }

    /* Tipi di vittorie */
    checkWinner(1, 2, 3);
    checkWinner(4, 5, 6);
    checkWinner(7, 8, 9);
    checkWinner(1, 4, 7);
    checkWinner(2, 5, 8);
    checkWinner(3, 6, 9);
    checkWinner(1, 5, 9);
    checkWinner(3, 5, 7);

    /* No vincitori */
    if (moves == 9 && isGameOver == false) { draw(); }

}

function checkWinner(a, b, c) {
    a--;
    b--;
    c--;
    if ((span[a].dataset.player === span[b].dataset.player) && (span[b].dataset.player === span[c].dataset.player) && (span[a].dataset.player === span[c].dataset.player) && (span[a].dataset.player === "x" || span[a].dataset.player === "o") && isGameOver == false) {
        span[a].parentNode.className += " activeBox";
        span[b].parentNode.className += " activeBox";
        span[c].parentNode.className += " activeBox";
        gameOver(a);
    }
}

function playAgain() {
    document.getElementsByClassName("alert")[0].parentNode.removeChild(document.getElementsByClassName("alert")[0]);
    resetGame();
    window.isGameOver = false;
    for (var k = 0; k < span.length; k++) {
        span[k].parentNode.className = span[k].parentNode.className.replace("activeBox", "");
    }
}

function resetGame() {
    for (i = 0; i < span.length; i++) {
        span[i].dataset.player = "none";
        span[i].innerHTML = "&nbsp;";
    }
    playerTurn = "x";
}

function updateScoreDisplay() {
    // Aggiorno il testo del punteggio
    document.getElementById("score").innerText = "Punteggio: " + player1Name + ": " + player1Score + ", " + player2Name + ": " + player2Score;
}

function gameOver(a) {
    var winner = span[a].dataset.player.toUpperCase();
    var winningPlayerName = winner === "X" ? player1Name : player2Name;
    var gameOverAlertElement = "<b>GAME OVER </b><br><br> Giocatore " + winningPlayerName + ' ha vinto ! <br><br>' + restartButton;
    var div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = gameOverAlertElement;
    document.getElementsByTagName("body")[0].appendChild(div);

    if (winner === "X") {
        player1Score++;
    } else if (winner === "O") {
        player2Score++;
    }

    window.isGameOver = true;
    moves = 0;
    updateScoreDisplay();  // Aggiorno la visualizzazione del punteggio
    saveScores();
}

function draw() {
    var drawAlertElement = '<b>PAREGGIO</b><br><br>' + restartButton;
    var div = document.createElement("div");
    div.className = "alert";
    div.innerHTML = drawAlertElement;
    document.getElementsByTagName("body")[0].appendChild(div);
    window.isGameOver = true;
    moves = 0;
}

const resetHighScoreButton = document.getElementById("reset-high-score");
resetHighScoreButton.addEventListener("click", () => {  /* L'aggiunta di un listener agli eventi è parte dell'API degli eventi di HTML5. In questo caso, si tratta di un evento di click */
    // Reimposto il punteggio massimo a 0 nel localStorage
    localStorage.setItem("high-score", 0);
    
    // Aggiorno anche i punteggi dei giocatori 
    player1Score = 0;
    player2Score = 0;

    // Aggiorno la visualizzazione del punteggio dei giocatori
    updateScoreDisplay();
});