
    document.getElementById("form1").addEventListener("submit", function(e) {
        e.preventDefault();

        const newResult = {
            name: document.getElementById("name").value,
            tele: document.getElementById("tele").value,
            email: document.getElementById("email").value,
            f: document.getElementById("f").checked ? "Да" : "Нет",
            s: document.getElementById("s").checked ? "Да" : "Нет",
            t: document.getElementById("t").checked ? "Да" : "Нет",
            birth: document.getElementById("birth").value,
            rate: document.querySelector('input[name="rate"]:checked').value,
        };

        const existingData = JSON.parse(localStorage.getItem("results")) || [];
        existingData.push(newResult);
        localStorage.setItem("results", JSON.stringify(existingData));

        this.reset();
        window.location.href = "result.html";
    });

    document.getElementById("clear").addEventListener("click", () => {
        document.getElementById("form1").reset();
    });


