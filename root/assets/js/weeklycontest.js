$(document).ready(function() {
    // Get contest ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const contestId = urlParams.get('id');

    if (!contestId) {
        $('body').html('<div class="alert alert-danger text-center">No Contest ID provided.</div>');
        return;
    }

    function formatDateTime(dateTimeString) {
        if (!dateTimeString) return 'Not set';
        const options = {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    }

    // Fetch contest data from the server
    $.ajax({
        url: `http://localhost/Coders_Battleground/server/get_contest_details.php?id=${contestId}`,
        type: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.status === 'success') {
                const data = response.data;

                $('#contest-title').text(data.details.name);
                const startTime = formatDateTime(data.details.start_time);
                const endTime = formatDateTime(data.details.end_time);
                $('#contest-time').text(`${startTime} - ${endTime}`);
                
                $('#contest-info').text(data.details.contest_info || 'No additional information available for this contest.');

                const problemsList = $('#problems-list-container');
                problemsList.empty(); // Clear loading text
                if (data.problems.length > 0) {
                    data.problems.forEach(problem => {
                        problemsList.append(`<li class="list-group-item">${problem.name} (${problem.difficulty})</li>`);
                    });
                } else {
                    problemsList.append('<li class="list-group-item">No problems found for this contest.</li>');
                }

                const rankingsList = $('#top-rankings-container');
                rankingsList.empty(); // Clear loading text
                if (data.top_rankings.length > 0) {
                    data.top_rankings.forEach((user, index) => {
                        const ratingChange = user.rating_change > 0 ? `+${user.rating_change}` : user.rating_change;
                        rankingsList.append(`<li class="list-group-item">#${index + 1} - ${user.username} (${ratingChange})</li>`);
                    });
                } else {
                    rankingsList.append('<li class="list-group-item">No rankings yet for this contest.</li>');
                }
                
                // Pass the contestId to the ranking and problems pages
                $('#ranking-link').attr('href', `../pages/live-standings.html?contest_id=${contestId}`);
                $('#problems-link').attr('href', `../pages/ProblemsList.html?contest_id=${contestId}`);

            } else {
                $('body').html(`<div class="alert alert-danger text-center">Error: ${response.message}</div>`);
            }
        },
        error: function(xhr, status, error) {
            console.error("Failed to load contest data:", error);
            $('body').html('<div class="alert alert-danger text-center">Could not load contest data. Please check the console for errors.</div>');
        }
    });
});