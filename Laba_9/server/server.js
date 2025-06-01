const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

app.get('/api/generate-array', (req, res) => {
    const array = Array.from({length: 100}, () => Math.floor(Math.random() * 91) + 10);
    res.json({ originalArray: array });
});

app.post('/api/process-array', (req, res) => {
    const { array } = req.body;
    const sortedArray = [...array].sort((a, b) => a - b);
    const maxElement = Math.max(...array);
    res.json({ sortedArray, maxElement });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});