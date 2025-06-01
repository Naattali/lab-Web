const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

app.get('/checkFiles', (req, res) => {
    const originalPath = path.join(__dirname, '../resources/original_array.txt');
    const sortedPath = path.join(__dirname, '../resources/sorted_array.txt');
    
    const originalExists = fs.existsSync(originalPath);
    const sortedExists = fs.existsSync(sortedPath);
    
    res.send({ originalExists, sortedExists });
});

app.post('/saveArray', (req, res) => {
    const { filename, array } = req.body;
    const filePath = path.join(__dirname, '../', filename);
    
    fs.writeFile(filePath, JSON.stringify(array), (err) => {
        if (err) {
            console.error('Ошибка записи:', err);
            return res.status(500).send('Ошибка записи файла');
        }
        res.send({ success: true });
    });
});

app.post('/loadArray', (req, res) => {
    const { filename } = req.body;
    const filePath = path.join(__dirname, '../', filename);
    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения:', err);
            return res.status(404).send('Файл не найден');
        }
        res.send({ array: JSON.parse(data) });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
    const resourcesDir = path.join(__dirname, '../resources');
    if (!fs.existsSync(resourcesDir)) {
        fs.mkdirSync(resourcesDir);
    }
});