const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const port = 3000; 

app.use(bodyParser.json());
app.use(cors()); 

app.post('/saveScore', (req, res) => {
    const { score, highScore } = req.body;
    console.log('Ricevuto punteggio dal client:', score);
    console.log('Ricevuto punteggio massimo dal client:', highScore);
    res.status(200).send('Punteggio salvato con successo');
});

app.listen(port, () => {
    console.log(`Il server è in ascolto sulla porta ${port}`);
});
