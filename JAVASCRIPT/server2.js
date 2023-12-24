const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let scores = {
    playerScore: 0,
    computerScore: 0,
};

app.post('/saveScore', (req, res) => {
    const { playerScore, computerScore } = req.body;
    console.log('Dati ricevuti dal client:', req.body);
    scores.playerScore = playerScore;
    scores.computerScore = computerScore;
    console.log('Punteggio aggiornato:', scores);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server in ascolto sulla porta ${port}`);
});
