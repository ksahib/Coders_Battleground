$(document).ready(function () {
    // Load navbar
    includeHtml('navbar-placeholder', '../components/navbar.html');
    
    let currentPage = 1;
    const rowsPerPage = 10;
    let standingsData = [];
    let contestInfo = {};
    let refreshInterval = null;

    const rankingTitle = $('#ranking-title');
    const tableContainer = $('#standings-table-placeholder');
    const paginationContainer = $('#pagination-controls');
    const contestNameDisplay = $('#contest-name');

    // Get contest ID from URL parameter
    function getContestId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('contest_id');
    }

    // Color classes based on rating
    function getRatingColorClass(rating) {
        if (rating >= 2400) return 'user-red';
        else if (rating >= 2200) return 'user-orange';
        else if (rating >= 1900) return 'user-purple';
        else if (rating >= 1600) return 'user-blue';
        else if (rating >= 1400) return 'user-cyan';
        else if (rating >= 1200) return 'user-green';
        else return 'user-gray';
    }

    function renderPaginationControls() {
        paginationContainer.empty();
        const pageCount = Math.ceil(standingsData.length / rowsPerPage);
        if (pageCount <= 1) return;
        
        const ul = $('<ul class="pagination"></ul>');
        
        // Previous button
        const prevLi = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">Previous</a>
        </li>`);
        prevLi.on('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) displayPage(currentPage - 1);
        });
        ul.append(prevLi);

        // Page numbers
        for (let i = 1; i <= pageCount; i++) {
            const li = $(`<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>`);
            li.on('click', function(e) {
                e.preventDefault();
                displayPage(i);
            });
            ul.append(li);
        }

        // Next button
        const nextLi = $(`<li class="page-item ${currentPage === pageCount ? 'disabled' : ''}">
            <a class="page-link" href="#">Next</a>
        </li>`);
        nextLi.on('click', function(e) {
            e.preventDefault();
            if (currentPage < pageCount) displayPage(currentPage + 1);
        });
        ul.append(nextLi);

        paginationContainer.append(ul);
    }

    function renderStandingsTable(dataSlice) {
        if (dataSlice.length === 0) {
            tableContainer.html('<div class="alert alert-info">No participants yet.</div>');
            return;
        }

        // Build table headers
        let headerHtml = `
            <tr>
                <th scope="col">#</th>
                <th scope="col">Who</th>
                <th scope="col" class="text-center">Score</th>
        `;
        
        // Add problem columns
        if (contestInfo.problems && contestInfo.problems.length > 0) {
            contestInfo.problems.forEach((problem, index) => {
                headerHtml += `<th scope="col" class="text-center">P${index + 1}</th>`;
            });
        }
        
        headerHtml += '</tr>';

        // Build table rows
        let tableRowsHtml = dataSlice.map(participant => {
            const colorClass = getRatingColorClass(participant.rating || 1500);
            let rowHtml = `
                <tr>
                    <td>${participant.rank}</td>
                    <td><a href="/profile/${participant.username}" class="text-decoration-none ${colorClass}">${participant.name}</a></td>
                    <td class="text-center fw-bold">${participant.total_score}</td>
            `;
            
            // Add problem scores
            if (participant.problems) {
                participant.problems.forEach(problem => {
                    if (problem.solved) {
                        rowHtml += `<td class="text-center problem-solved">${problem.score}</td>`;
                    } else if (problem.attempted) {
                        rowHtml += `<td class="text-center problem-attempted">-</td>`;
                    } else {
                        rowHtml += `<td class="text-center">-</td>`;
                    }
                });
            }
            
            rowHtml += '</tr>';
            return rowHtml;
        }).join('');

        tableContainer.html(`
            <table class="table table-striped">
                <thead class="table-light">
                    ${headerHtml}
                </thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>`);
    }
    
    function displayPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = standingsData.slice(start, end);

        renderStandingsTable(paginatedItems);
        renderPaginationControls();
    }

    function loadStandings() {
        const contestId = getContestId();
        
        if (!contestId) {
            tableContainer.html('<div class="alert alert-danger">No contest ID provided.</div>');
            return;
        }
        
        $.ajax({
            url: 'http://localhost/server/get-live-standings.php',
            type: 'GET',
            data: { contest_id: contestId },
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    standingsData = response.data;
                    contestInfo = response.contest_info || {};
                    
                    // Update contest name
                    if (contestInfo.name) {
                        contestNameDisplay.text(contestInfo.name);
                        rankingTitle.text(`${contestInfo.name} - Live Standings`);
                    }
                    
                    displayPage(1);
                    
                    // Set up auto-refresh if contest is live
                    if (contestInfo.status === 'live' && !refreshInterval) {
                        refreshInterval = setInterval(loadStandings, 30000); // Refresh every 30 seconds
                    }
                } else {
                    tableContainer.html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading standings:', error);
                tableContainer.html('<div class="alert alert-danger">Failed to load standings. Please try again later.</div>');
            }
        });
    }

    // Clear interval when leaving page
    $(window).on('beforeunload', function() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    });

    // Initial load
    loadStandings();
});