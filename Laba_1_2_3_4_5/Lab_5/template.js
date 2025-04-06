//db = openDatabase("ToDo", "0.1", "A list of to do items.", 200000);
//if(!db){alert("Failed to connect to database.");}

 const db = openDatabase("PhoneBook", "1.0", "Телефонная база данных", 2 * 1024 * 1024);

        db.transaction(function (tx) {
                   tx.executeSql(`CREATE TABLE IF NOT EXISTS Contacts (
                       id INTEGER PRIMARY KEY,
                       name TEXT,
                       phone TEXT,
                       address TEXT,
                       debt BOOLEAN
                   )`);

                   // Добавление начальных данных
                   tx.executeSql("SELECT COUNT(*) AS count FROM Contacts", [], function (tx, results) {
                       if (results.rows.item(0).count === 0) {
                           // Если таблица пуста, добавляем данные
                           tx.executeSql("INSERT INTO Contacts (id, name, phone, address, debt) VALUES (1, 'Иван Иванов', '1234567890', 'ул. Примерная, 1', 1)");
                           tx.executeSql("INSERT INTO Contacts (id, name, phone, address, debt) VALUES (2, 'Мария Петрова', '0987654321', 'ул. Демонстрационная, 5', 0)");
                           tx.executeSql("INSERT INTO Contacts (id, name, phone, address, debt) VALUES (3, 'Алексей Смирнов', '5555555555', 'ул. Образцовая, 10', 1)");
                           tx.executeSql("INSERT INTO Contacts (id, name, phone, address, debt) VALUES (4, 'Ольга Сидорова', '4444444444', 'ул. Тестовая, 20', 0)");
                           alert("Начальные данные добавлены");
                           showAllRecords();
                       }
                   });
               });

        // Функция для очистки формы
        function clearForm() {
            document.getElementById("input-id").value = "";
            document.getElementById("input-name").value = "";
            document.getElementById("input-phone").value = "";
            document.getElementById("input-address").value = "";
            document.getElementById("input-debt").value = "0";
        }

        // Функция для добавления записи
        function addRecord() {
            const id = document.getElementById("input-id").value;
            const name = document.getElementById("input-name").value;
            const phone = document.getElementById("input-phone").value;
            const address = document.getElementById("input-address").value;
            const debt = document.getElementById("input-debt").value;

            db.transaction(function (tx) {
                tx.executeSql("INSERT INTO Contacts (id, name, phone, address, debt) VALUES (?, ?, ?, ?, ?)",
                [id, name, phone, address, debt], function () {
                    alert("Запись добавлена");
                    showAllRecords();
                }, function (tx, error) {
                    alert("Ошибка добавления записи: " + error.message);
                });
            });

            clearForm();
        }

        // Функция для удаления записи по ID
        function deleteRecord() {
            const id = prompt("Введите ID записи для удаления:");
            db.transaction(function (tx) {
                tx.executeSql("DELETE FROM Contacts WHERE id = ?", [id], function () {
                    alert("Запись удалена");
                    showAllRecords();
                }, function (tx, error) {
                    alert("Ошибка удаления записи: " + error.message);
                });
            });
        }
        // Функция для отображения всех записей
                function showAllRecords() {
                    console.log("Функция showAllRecords запущена");
                    db.transaction(function (tx) {
                        tx.executeSql("SELECT * FROM Contacts", [], function (tx, results) {
                            console.log("Запрос выполнен");
                            const tbody = document.getElementById("results");
                            tbody.innerHTML = ""; // Очистка таблицы
                            for (let i = 0; i < results.rows.length; i++) {
                                const row = results.rows.item(i);
                                tbody.innerHTML += `
                                    <tr>
                                        <td>${row.id}</td>
                                        <td>${row.name}</td>
                                        <td>${row.phone}</td>
                                        <td>${row.address}</td>
                                        <td>${row.debt ? "Да" : "Нет"}</td>
                                    </tr>
                                `;
                            }
                        }, function (tx, error) {
                            console.error("Ошибка выполнения запроса:", error.message);
                        });
                    });
                }

                // Функция для вывода всех ФИО с задолженностями
                function showDebtors() {
                    db.transaction(function (tx) {
                        tx.executeSql("SELECT name FROM Contacts WHERE debt = 1", [], function (tx, results) {
                            let debtors = "ФИО с задолженностями:\n";
                            for (let i = 0; i < results.rows.length; i++) {
                                debtors += results.rows.item(i).name + "\n";
                            }
                            alert(debtors);
                        });
                    });
                }