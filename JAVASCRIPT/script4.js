let playerScore = 0;
let computerScore = 0;

function makeChoice(playerChoice) {
    const choices = ['sasso', 'carta', 'forbici'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    const result = determineWinner(playerChoice, computerChoice);
    displayResult(result, playerChoice, computerChoice);
    updateScore(result);
    saveScore(playerScore, computerScore);
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'pareggiato';
    } else if (
        (playerChoice === 'sasso' && computerChoice === 'forbici') ||
        (playerChoice === 'carta' && computerChoice === 'sasso') ||
        (playerChoice === 'forbici' && computerChoice === 'carta')
    ) {
        return 'vinto';
    } else {
        return 'perso';
    }
}

function displayResult(result, playerChoice, computerChoice) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Hai scelto ${playerChoice}. Il Computer ha scelto ${computerChoice}. Tu hai ${result}.`;
}

function updateScore(result) {
    const scoreDiv = document.getElementById('score');
    if (result === 'vinto') {
        playerScore++;
    } else if (result === 'perso') {
        computerScore++;
    }
    scoreDiv.innerHTML = `Punteggio: Giocatore - ${playerScore}, Computer - ${computerScore}`;
}

const resetHighScoreButton = document.getElementById("reset-high-score");

resetHighScoreButton.addEventListener("click", () => {              
    // Reimposto il punteggio massimo a 0 nel localStorage
    localStorage.setItem("high-score", 0);
    
    playerScore = 0;
    computerScore = 0;

    const scoreDiv = document.getElementById('score');
    scoreDiv.innerHTML = `Punteggio: Giocatore - ${playerScore}, Computer - ${computerScore}`;
});

function saveScore(playerScore, computerScore) {
    // Effettuo una chiamata al server Node.js per salvare il punteggio
    // Uso fetch o un'altra API per inviare i dati al server
    fetch('http://127.0.0.1:3000/saveScore', {
        method: 'POST',
        mode: 'cors',  
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            playerScore: playerScore,
            computerScore: computerScore,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Punteggio salvato con successo:', data);
    })
    .catch((error) => {
        console.error('Errore durante il salvataggio del punteggio:', error);
    });
}


