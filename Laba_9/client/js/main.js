async function fetchData(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
}

function renderArray(array, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const index = i * 10 + j;
            const cell = document.createElement('div');
            cell.className = 'array-cell';
            cell.textContent = array[index];
            container.appendChild(cell);
        }
    }
}

let originalArray = [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('generate-btn')) {
        const generateBtn = document.getElementById('generate-btn');
        const processBtn = document.getElementById('process-btn');
        
        generateBtn.addEventListener('click', async () => {
            try {
                const data = await fetchData('http://localhost:3000/api/generate-array');
                originalArray = data.originalArray;
                renderArray(originalArray, 'original-array');
                processBtn.disabled = false;
            } catch (error) {
                console.error('Ошибка:', error);
            }
        });
        
        processBtn.addEventListener('click', async () => {
            try {
                const data = await fetchData('http://localhost:3000/api/process-array', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ array: originalArray }),
                });
                
                sessionStorage.setItem('sortedArray', JSON.stringify(data.sortedArray));
                sessionStorage.setItem('maxElement', data.maxElement);
                
                window.location.href = 'result.html';
            } catch (error) {
                console.error('Ошибка:', error);
            }
        });
    } else if (document.getElementById('back-btn')) {
        const sortedArray = JSON.parse(sessionStorage.getItem('sortedArray'));
        const maxElement = sessionStorage.getItem('maxElement');
        
        renderArray(sortedArray, 'sorted-array');
        document.getElementById('max-element').textContent = maxElement;
        
        document.getElementById('back-btn').addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});