$(document).ready(function() {
    let interviewHistoryData = [];
    let currentPage = 1;
    const rowsPerPage = 7;

    const tableContainer = $('#interview-table-placeholder');
    const paginationContainer = $('#pagination-controls');
    const loadingSpinner = $('#loading-spinner');
    const errorMessage = $('#error-message');
    const noDataMessage = $('#no-data-message');
    const usernameDisplay = $('#username-display');

    // Fetch interview history from server
    function fetchInterviewHistory() {
        showLoading();
        
        $.ajax({
            url: 'http://localhost/Coders_Battleground/server/get-interview-history.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hideLoading();
                
                if (response.success) {
                    interviewHistoryData = response.data;
                    
                    if (interviewHistoryData.length === 0) {
                        showNoDataMessage();
                    } else {
                        displayPage(1);
                    }
                    
                    // Set username in display
                    if (response.username) {
                        usernameDisplay.text(response.username);
                    }
                } else {
                    showError(response.message || 'Failed to fetch interview history');
                }
            },
            error: function(xhr, status, error) {
                hideLoading();
                console.error('Error fetching interview history:', error);
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
        const pageCount = Math.ceil(interviewHistoryData.length / rowsPerPage);
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

    function renderInterviewTable(dataSlice) {
        let tableRowsHtml = dataSlice.map(interview => {
            const statusClass = `status-${interview.status.toLowerCase().replace(' ', '-')}`;
            const formattedDate = new Date(interview.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });

            return `
            <tr>
                <td>${formattedDate}</td>
                <td><a href="#" class="text-decoration-none fw-bold">${interview.company}</a></td>
                <td>${interview.role}</td>
                <td>${interview.round}</td>
                <td class="text-center"><span class="${statusClass}">${interview.status}</span></td>
            </tr>`;
        }).join('');

        tableContainer.html(`
            <table class="table table-striped table-hover">
                <thead class="table-light">
                    <tr>
                        <th scope="col">Date</th>
                        <th scope="col">Company</th>
                        <th scope="col">Role</th>
                        <th scope="col">Round</th>
                        <th scope="col" class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>${tableRowsHtml}</tbody>
            </table>`);
    }

    function displayPage(page) {
        currentPage = page;
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = interviewHistoryData.slice(start, end);

        hideLoading();
        renderInterviewTable(paginatedItems);
        renderPaginationControls();
        
        tableContainer.show();
        paginationContainer.css('display', 'flex');
        errorMessage.hide();
        noDataMessage.hide();
    }

    // Initialize the page
    fetchInterviewHistory();
});