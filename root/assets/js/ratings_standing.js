$(document).ready(function () {
    let currentPage = 1;
    const rowsPerPage = 10;
    let activeDataset = [];

    const rankingTitle = $('#ranking-title');
    const tableContainer = $('#ranking-table-placeholder');
    const paginationContainer = $('#pagination-controls');

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
        const pageCount = Math.ceil(activeDataset.length / rowsPerPage);
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

    function renderRankingTable(dataSlice) {
        if (dataSlice.length === 0) {
            tableContainer.html('<div class="alert alert-info">No ranking data available.</div>');
            return;
        }

        let tableRowsHtml = dataSlice.map(user => {
            const colorClass = getRatingColorClass(user.rating);
            return `
                <tr>
                    <td>${user.rank}</td>
                    <td><a href="/profile/${user.username}" class="text-decoration-none ${colorClass}">${user.username}</a></td>
                    <td class="text-center">${user.contests}</td>
                    <td class="text-center fw-bold ${colorClass}">${user.rating}</td>
                </tr>`;
        }).join('');

        tableContainer.html(`
            <table class="table table-striped">
                <thead class="table-light">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Who</th>
                        <th scope="col" class="text-center">Contests</th>
                        <th scope="col" class="text-center">Rating</th>
                    </tr>
                </thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>`);
    }
    
    function displayPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = activeDataset.slice(start, end);

        renderRankingTable(paginatedItems);
        renderPaginationControls();
    }

    function loadRankings() {
        tableContainer.html('<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>');
        
        $.ajax({
            url: 'http://localhost/server/get_rankings.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    activeDataset = response.data;
                    
                    rankingTitle.text('All-Time User Rankings');
                    
                    displayPage(1);
                } else {
                    tableContainer.html(`<div class="alert alert-danger">Error: ${response.message}</div>`);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error loading rankings:', error);
                tableContainer.html('<div class="alert alert-danger">Failed to load rankings. Please try again later.</div>');
            }
        });
    }

    loadRankings();
});