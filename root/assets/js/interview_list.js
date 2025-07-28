$(document).ready(function () {
    let interviewListData = [];
    let currentPage = 1;
    const itemsPerPage = 5;

    const listContainer = $('#interview-list-container');
    const paginationContainer = $('#pagination-controls');
    const searchInput = $('#search-input');
    const jobTypeFilter = $('#job-type-filter');
    const loadingSpinner = $('#loading-spinner');

    // Load interviews from database
    function loadInterviews() {
        $.ajax({
            url: 'http://localhost/Server/get_interviews.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                loadingSpinner.hide();

                if (response.status === 'success') {
                    interviewListData = response.data;
                    displayInterviews();
                } else {
                    listContainer.html(`<div class="alert alert-danger">${response.message}</div>`);
                }
            },
            error: function (xhr, status, error) {
                loadingSpinner.hide();
                console.error('Error loading interviews:', error);
                listContainer.html('<div class="alert alert-danger">Failed to load interviews. Please try again later.</div>');
            }
        });
    }

    function displayInterviews() {
        const searchQuery = searchInput.val().toLowerCase();
        const jobType = jobTypeFilter.val();

        const filteredData = interviewListData.filter(item => {
            const matchesSearch =
                item.position_open.toLowerCase().includes(searchQuery) ||
                item.company_name.toLowerCase().includes(searchQuery) ||
                item.location.toLowerCase().includes(searchQuery);
            const matchesJobType = jobType === 'all' || item.job_type === jobType;
            return matchesSearch && matchesJobType;
        });

        const totalPages = Math.ceil(filteredData.length / itemsPerPage);

        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        } else if (totalPages === 0) {
            currentPage = 1;
        }

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = filteredData.slice(start, end);

        renderInterviewList(paginatedData);
        renderPaginationControls(totalPages);
    }

    function renderInterviewList(data) {
        listContainer.empty();

        if (data.length === 0) {
            listContainer.html(`<p class="text-center text-muted">No interviews found matching your criteria.</p>`);
            return;
        }

        data.forEach(item => {
            const isApplied = item.is_applied;
            const applyButtonHtml = isApplied
                ? '<span class="applied-badge">Applied</span>'
                : `<button class="btn btn-primary btn-apply" data-interview-id="${item.interview_id}">Apply Now</button>`;

            const itemHtml = `
                <a href="Interview-details.html?interview_id=${item.interview_id}"
                    class="interview-list-item text-decoration-none text-reset">
                    <div class="row g-3 align-items-center">
                    <div class="col-auto">
                        <div class="company-logo bg-primary text-white d-flex align-items-center justify-content-center">
                        <strong>${item.company_name.charAt(0)}</strong>
                        </div>
                    </div>
                    <div class="col">
                        <h5 class="mb-1">${item.position_open}</h5>
                        <p class="mb-1 text-muted">
                        ${item.company_name} &middot; 
                        <span class="fw-bold">${item.location}</span>
                        </p>
                        <div class="d-flex gap-2">
                        <span class="badge rounded-pill bg-secondary job-tag">${item.job_type}</span>
                        <span class="badge rounded-pill bg-info job-tag text-dark">
                            ${item.rounds_count} rounds
                        </span>
                        </div>
                    </div>
                    <div class="col-md-3 text-md-end">
                        <p class="text-muted small mb-1">Posted: ${item.start}</p>
                        ${applyButtonHtml}
                    </div>
                    </div>
                </a>
                `;
            listContainer.append(itemHtml);
        });
    }

    function renderPaginationControls(totalPages) {
        paginationContainer.empty();

        if (totalPages <= 1) return;

        const ul = $('<ul class="pagination"></ul>');

        // Previous button
        const prevLi = $(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#">Previous</a>
        </li>`);
        prevLi.on('click', function (e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                displayInterviews();
            }
        });
        ul.append(prevLi);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const li = $(`<li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#">${i}</a>
            </li>`);
            li.on('click', function (e) {
                e.preventDefault();
                currentPage = i;
                displayInterviews();
            });
            ul.append(li);
        }

        // Next button
        const nextLi = $(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#">Next</a>
        </li>`);
        nextLi.on('click', function (e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                displayInterviews();
            }
        });
        ul.append(nextLi);

        paginationContainer.append(ul);
    }

    // Apply for interview
    $(document).on('click', '.btn-apply', function () {
        const button = $(this);
        const interviewId = button.data('interview-id');

        button.prop('disabled', true).text('Applying...');

        $.ajax({
            url: 'http://localhost/Server/apply_interview.php',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ interview_id: interviewId }),
            success: function (response) {
                if (response.status === 'success') {
                    button.replaceWith('<span class="applied-badge">Applied</span>');

                    // Update the data to reflect the application
                    const interview = interviewListData.find(i => i.interview_id == interviewId);
                    if (interview) {
                        interview.is_applied = true;
                    }
                } else {
                    alert(response.message);
                    button.prop('disabled', false).text('Apply Now');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error applying for interview:', error);
                alert('Failed to apply. Please try again.');
                button.prop('disabled', false).text('Apply Now');
            }
        });
    });

    // Search and filter event listeners
    searchInput.on('input', function () {
        currentPage = 1;
        displayInterviews();
    });

    jobTypeFilter.on('change', function () {
        currentPage = 1;
        displayInterviews();
    });

    // Initial load
    loadInterviews();
});