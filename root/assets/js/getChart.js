//function for generating doughnut charts using the Chart.js library
function getChart(id, { easy, medium, hard, total }) {
  const ctx   = document.getElementById(id).getContext('2d');
  const solvedCount = easy + medium + hard;
  const percent     = Math.round((solvedCount / total) * 100);

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels:   ['Easy', 'Medium', 'Hard'],
      datasets: [{
        data:      [easy, medium, hard],
        cutout:    '70%',
        borderWidth: 0
      }]
    },
    options: {
      plugins: {
        legend:  { display: false },
        tooltip: { enabled: false }
      }
    }
  });

  document.querySelector(".center-label").innerHTML = `
    <div>${percent}%</div>
    <small>Solved</small>
    <small>${solvedCount}/${total}</small>
  `;
}

