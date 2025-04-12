let phoneBook = [
        {id: 1, name: "Иванов Иван", phone: "1234567890", address: "Молодечно", debt: true},
        {id: 2, name: "Петрова Мария", phone: "0987654321", address: "Менютки", debt: false}
    ];

    let historyLog = [
        "Инициализация: добавлены тестовые записи (ID 1 и 2)"
    ];

    document.addEventListener('DOMContentLoaded', function() {
        showAllRecords();
        updateHistory();
    });

    function showAllRecords() {
        const tbody = document.getElementById('results');
        tbody.innerHTML = '';

        phoneBook.forEach(contact => {
            tbody.innerHTML += `
                <tr>
                    <td>${contact.id}</td>
                    <td>${contact.name}</td>
                    <td>${contact.phone}</td>
                    <td>${contact.address}</td>
                    <td>${contact.debt ? 'Да' : 'Нет'}</td>
                </tr>
            `;
        });
    }

    function updateHistory() {
        const historyElement = document.getElementById('history-log');
        historyElement.innerHTML = '';

        historyLog.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'history-entry';
            entryElement.textContent = entry;
            historyElement.appendChild(entryElement);
        });
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    function addToHistory(message) {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        historyLog.push(`[${timeString}] ${message}`);

        if (historyLog.length > 50) {
            historyLog.shift();
        }
        updateHistory();
    }

    function clearForm() {
        document.getElementById("input-id").value = "";
        document.getElementById("input-name").value = "";
        document.getElementById("input-phone").value = "";
        document.getElementById("input-address").value = "";
        document.getElementById("input-debt").value = "false";

        addToHistory("Форма очищена");
    }

    function addRecord() {
        const id = parseInt(document.getElementById("input-id").value);
        const name = document.getElementById("input-name").value.trim();
        const phone = document.getElementById("input-phone").value.trim();
        const address = document.getElementById("input-address").value.trim();
        const debt = document.getElementById("input-debt").value === 'true';

        if (!id || !name) {
            alert("Поля ID и ФИО обязательны!");
            return;
        }

        if (phoneBook.some(contact => contact.id === id)) {
            alert("Контакт с таким ID уже существует!");
            return;
        }

        const newContact = {id, name, phone, address, debt};
        phoneBook.push(newContact);
        phoneBook.sort((a, b) => a.id - b.id);

        showAllRecords();
        clearForm();

        addToHistory(`Добавлена новая запись: ID ${id}, ${name}`);
        alert("Контакт добавлен!");
    }

    function deleteRecord() {
        const id = parseInt(prompt("Введите ID для удаления:"));

        if (!id) return;

        const contactToDelete = phoneBook.find(contact => contact.id === id);
        if (!contactToDelete) {
            alert("Контакт с таким ID не найден!");
            return;
        }

        phoneBook = phoneBook.filter(contact => contact.id !== id);
        showAllRecords();

        addToHistory(`Удалена запись: ID ${id}, ${contactToDelete.name}`);
        alert("Контакт удален!");
    }

    function showDebtors() {
        const debtors = phoneBook
            .filter(contact => contact.debt)
            .map(contact => `${contact.id}: ${contact.name}`)
            .join('\n');

        addToHistory("Просмотр списка должников");
        alert(debtors || "Должников нет!");
    }
