const tableData = [
      { id: 1, problem: 20001, user: "000", lang: "python", reporter: "@xyz" },
      { id: 2, problem: 20012, user: "345", lang: "java", reporter: "@1ami" },
      { id: 3, problem: 20021, user: "346", lang: "java", reporter: "@catcoder" },
      { id: 4, problem: 20022, user: "665", lang: "c++", reporter: "@pedropascal067" },
      { id: 5, problem: 20027, user: "111", lang: "python", reporter: "@codexharry" },
      { id: 6, problem: 20024, user: "034", lang: "python", reporter: "@arin" },
      { id: 7, problem: 20021, user: "234", lang: "python", reporter: "@sahibcodes" },
      { id: 8, problem: 20024, user: "010", lang: "c++", reporter: "@sakib678" },
      { id: 9, problem: 20023, user: "130", lang: "java", reporter: "@sadik" },
      { id: 10, problem: 20023, user: "089", lang: "python", reporter: "@lucy789" },
    ];

    const tbody = document.getElementById("reportTableBody");

    tableData.forEach(row => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${row.id}</td>
        <td>${row.problem}</td>
        <td>${row.user}</td>
        <td>${row.lang}</td>
        <td>${row.reporter}</td>
        <td><button class="status-button">Resolved </button></td>
      `;
      tbody.appendChild(tr);
    });

    function toggleDropdown() {
      document.getElementById("statusDropdown").classList.toggle("active");
    }

    document.addEventListener("click", function(event) {
      if (!event.target.closest("#statusDropdown")) {
        document.getElementById("statusDropdown").classList.remove("active");
      }
    });