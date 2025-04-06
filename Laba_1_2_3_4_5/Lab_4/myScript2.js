    var tableBody = document.getElementById("results");
        var list = document.getElementById("names");

        var results = JSON.parse(localStorage.getItem("results")) || [];
        results.forEach(function(result) {
          var row = document.createElement("tr");
          var listItem = document.createElement("option");
          row.innerHTML = `<td>${result.name}</td>
                                      <td>${result.tele}</td>
                                      <td>${result.email}</td>
                                      <td>${result.f}</td>
                                      <td>${result.s}</td>
                                      <td>${result.t}</td>
                                      <td>${result.birth}</td>
                                      <td>${result.rate}</td>`;
          listItem.textContent = result.name;

          tableBody.appendChild(row);
          list.appendChild(listItem);
        });