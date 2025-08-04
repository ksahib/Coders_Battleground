$(document).ready(function() {
    // Load navbar
    includeHtml('navbar-placeholder', '../components/navbar.html');
    
    let contestHistoryData = [];
    let currentPage = 1;
    const rowsPerPage = 8;

    const tableContainer = $('#contest-table-placeholder');
    const paginationContainer = $('#pagination-controls');
    const loadingSpinner = $('#loading-spinner');
    const errorMessage = $('#error-message');
    const noDataMessage = $('#no-data-message');
    const usernameDisplay = $('#username-display');

    // Fetch contest history from server
    function fetchContestHistory() {
        showLoading();
        
        $.ajax({
            url: 'http://localhost/Coders_Battleground/Server/get-contest-history.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hideLoading();
                
                if (response.success) {
                    contestHistoryData = response.data;
                    
                    if (contestHistoryData.length === 0) {
                        showNoDataMessage();
                    } else {
                        displayPage(1);
                    }
                    
                    // Set username in display
                    if (response.username) {
                        usernameDisplay.text(response.username);
                    }
                    
                    // Update current rating if provided
                    if (response.current_rating !== undefined) {
                        $('#current-rating').text(response.current_rating);
                    }
                } else {
                    showError(response.message || 'Failed to fetch contest history');
                }
            },
            error: function(xhr, status, error) {
                hideLoading();
                console.error('Error fetching contest history:', error);
                showError('Network error. Please try again later.');
            }
        });
    }

    function showLoading() {
        loadingSpinner.show();
        tableContainer.hide();
        paginationContainer.hide();
        errorMessage.hide();
        noDataMessage.hide();
    }

    function hideLoading() {
        loadingSpinner.hide();
    }

    function showError(message) {
        hideLoading();
        $('#error-text').text(message);
        errorMessage.show();
        tableContainer.hide();
        paginationContainer.hide();
        noDataMessage.hide();
    }

    function showNoDataMessage() {
        hideLoading();
        noDataMessage.show();
        tableContainer.hide();
        paginationContainer.hide();
        errorMessage.hide();
    }

    function renderPaginationControls() {
        paginationContainer.empty();
        const pageCount = Math.ceil(contestHistoryData.length / rowsPerPage);
        if (pageCount <= 1) return;

        const ul = $('<ul class="pagination"></ul>');

        // Previous button
        const prevLi = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">Previous</a>
        </li>`);
        prevLi.on('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                displayPage(currentPage - 1);
            }
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
            if (currentPage < pageCount) {
                displayPage(currentPage + 1);
            }
        });
        ul.append(nextLi);

        paginationContainer.append(ul);
    }

    function renderContestTable(dataSlice) {
        let tableRowsHtml = dataSlice.map(contest => {
            let ratingChangeHtml;
            const change = parseInt(contest.rating_change);
            
            if (change > 0) {
                ratingChangeHtml = `<span class="rating-positive">+${change}</span>`;
            } else if (change < 0) {
                ratingChangeHtml = `<span class="rating-negative">${change}</span>`;
            } else {
                ratingChangeHtml = `<span class="rating-neutral">0</span>`;
            }

            const formattedDate = new Date(contest.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            return `
            <tr>
                <td>${formattedDate}</td>
                <td><a href="#" class="text-decoration-none">${contest.name}</a></td>
                <td class="text-center">${contest.rank || 'N/A'}</td>
                <td class="text-center">${ratingChangeHtml}</td>
                <td class="text-center fw-bold">${contest.new_rating}</td>
            </tr>`;
        }).join('');

        tableContainer.html(`
            <table class="table table-striped table-hover">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Contest</th>
                        <th scope="col" class="text-center">Rank</th>
                        <th scope="col" class="text-center">Rating Change</th>
                        <th scope="col" class="text-center">New Rating</th>
                    </tr>
                </thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>`);
    }
    
    function displayPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = contestHistoryData.slice(start, end);

        hideLoading();
        renderContestTable(paginatedItems);
        renderPaginationControls();
        
        tableContainer.show();
        paginationContainer.css('display', 'flex');
        errorMessage.hide();
        noDataMessage.hide();
    }
    
    // Initialize the page
    fetchContestHistory();
});