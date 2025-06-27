function getChart(id, { easy, medium, hard, total }) {
    const ctx = document.getElementById(id).getContext('2d');
    const solved = easy + medium + hard;
    const percent = Math.round((solved / total) * 100);

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Easy', 'Medium', 'Hard'],
            datasets: [{
                data: [easy, medium, hard],
                backgroundColor: ['#00c58e', '#ffc107', '#f44336'],
                cutout: '70%',
                borderWidth: 0
            }]
        },
        options: {
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    // Update labels
    document.querySelector(".center-label").innerHTML = `
        <div>${percent}%</div>
        <small>Accepted</small>
        <small>${solved} Submitted</small>
    `;
    document.getElementById('easy-count').textContent = `${easy}/883`;
    document.getElementById('medium-count').textContent = `${medium}/1868`;
    document.getElementById('hard-count').textContent = `${hard}/845`;
}
