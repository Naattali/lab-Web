$(document).ready(function() {
    const ROWS = 10;
    const COLS = 10;
    const SIZE = ROWS * COLS;
    const MIN_VALUE = 10;
    const MAX_VALUE = 100;
    
    let currentArray = [];
    
    init();
    
    function init() {
        checkFiles();
    }
    
    function checkFiles() {
        $.ajax({
            url: '/checkFiles',
            method: 'GET',
            success: function(response) {
                if (response.originalExists) {
                    $('#loadOriginal').prop('disabled', false);
                }
                if (response.sortedExists) {
                    $('#loadSorted').prop('disabled', false);
                }
            }
        });
    }
    
    $('#generate').click(function() {
        currentArray = generateArray(SIZE, MIN_VALUE, MAX_VALUE);
        displayArray(currentArray, '#originalArray');
        saveArrayToFile(currentArray, 'resources/original_array.txt');
        $('#loadOriginal').prop('disabled', false);
        $('#sortedArray').empty();
    });
    
    $('#sortAsc').click(function() {
        if (currentArray.length === 0) {
            alert('Сначала сгенерируйте массив');
            return;
        }
        
        const sorted = [...currentArray].sort((a, b) => a - b);
        displayArray(sorted, '#sortedArray');
        saveArrayToFile(sorted, 'resources/sorted_array.txt');
        $('#loadSorted').prop('disabled', false);
    });
    
    $('#sortDesc').click(function() {
        if (currentArray.length === 0) {
            alert('Сначала сгенерируйте массив');
            return;
        }
        
        const sorted = [...currentArray].sort((a, b) => b - a);
        displayArray(sorted, '#sortedArray');
        saveArrayToFile(sorted, 'resources/sorted_array.txt');
        $('#loadSorted').prop('disabled', false);
    });
    
    $('#loadOriginal').click(function() {
        loadArrayFromFile('resources/original_array.txt', function(array) {
            currentArray = array;
            displayArray(array, '#originalArray');
            $('#sortedArray').empty();
        });
    });
    
    $('#loadSorted').click(function() {
        loadArrayFromFile('resources/sorted_array.txt', function(array) {
            displayArray(array, '#sortedArray');
        });
    });
    
    $('#decimalPlaces').change(function() {
        if (currentArray.length > 0) {
            displayArray(currentArray, '#originalArray');
        }
        
        if ($('#sortedArray').children().length > 0) {
            loadArrayFromFile('resources/sorted_array.txt', function(array) {
                displayArray(array, '#sortedArray');
            });
        }
    });
    
    function generateArray(size, min, max) {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(parseFloat((Math.random() * (max - min) + min).toFixed(4)));
        }
        return arr;
    }
    
    function displayArray(arr, selector) {
        const decimalPlaces = parseInt($('#decimalPlaces').val());
        let html = '';
        
        arr.forEach(num => {
            html += `<div class="array-cell">${num.toFixed(decimalPlaces)}</div>`;
        });
        
        $(selector).html(html);
    }
    
    function saveArrayToFile(arr, filename) {
        $.ajax({
            url: '/saveArray',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                filename: filename,
                array: arr
            }),
            success: function() {
                console.log('Массив сохранен в', filename);
            }
        });
    }
    
    function loadArrayFromFile(filename, callback) {
        $.ajax({
            url: '/loadArray',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ filename: filename }),
            success: function(response) {
                callback(response.array);
            },
            error: function() {
                alert('Файл не найден или поврежден');
            }
        });
    }
});