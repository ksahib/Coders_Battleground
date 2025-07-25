function generateTableHeader(tableId, numProblems) {
  const table = document.getElementById(tableId);
  table.innerHTML = '';

  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  ['Rank','Name', 'Total'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    tr.appendChild(th);
  });

  for (let i = 0; i < numProblems; i++) {
    const th = document.createElement('th');
    const letter = String.fromCharCode(65 + i);
    th.textContent = letter;
    tr.appendChild(th);
  }

  thead.appendChild(tr);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  table.appendChild(tbody);
}

function insertTableRow(tableId, rank, name, totalScore, problemScores) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    console.error('Table body not found!');
    return;
  }

  const tr = document.createElement('tr');

  const rankTd = document.createElement('td');
  rankTd.textContent = rank;
  tr.appendChild(rankTd);
  
  const nameTd = document.createElement('td');
  nameTd.textContent = name;
  tr.appendChild(nameTd);

  
  const totalTd = document.createElement('td');
  totalTd.textContent = totalScore;
  tr.appendChild(totalTd);

  
  problemScores.forEach(score => {
    const td = document.createElement('td');
    td.textContent = (score != null ? score : '-');
    tr.appendChild(td);
  });

  tbody.appendChild(tr);
}
