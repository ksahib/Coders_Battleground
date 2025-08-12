$(document).ready(function() {
    // Load navbar
    includeHtml('navbar-placeholder', '../components/navbar.html');
    
    // Featured cards
    const container = document.getElementById('cards-row-feature');
    // Contest list variables
    let allContests = [];
    let myContests = [];
    let listRenderer = null;
    
    // Show loading spinner
    function showLoading() {
        $('#loading-spinner').show();
    }
    
    // Hide loading spinner
    function hideLoading() {
        $('#loading-spinner').hide();
    }
    
    // Format contest data for list renderer
    function formatContestData(contests, isMyContest = false) {
        return contests.map(contest => {
            const startDate = new Date(contest.start).toLocaleDateString();
            const endDate = new Date(contest.end).toLocaleDateString();
            const status = new Date() < new Date(contest.start) ? 'Upcoming' : 
                          new Date() > new Date(contest.end) ? 'Ended' : 'Live';
            
            return {
                label: `${contest.name} - ${contest.company_name} (${startDate} - ${endDate}) [${status}]`,
                url: `../pages/weeklycontest.html?id=${contest.id}`
            };
        });
    }
    
    // Fetch all contests
    function fetchAllContests() {
        showLoading();
        
        $.ajax({
            url: 'http://localhost/Coders_Battleground/Server/get-contests.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                hideLoading();
                
                if (response.status === 'success') {
                    allContests = formatContestData(response.data);
                    initializeListRenderer();
                } else {
                    console.error('Error:', response.message);
                    allContests = [];
                    initializeListRenderer();
                }
            },
            error: function(xhr, status, error) {
                hideLoading();
                console.error('Failed to fetch contests:', error);
                allContests = [];
                initializeListRenderer();
            }
        });
    }
    
    // Fetch user's contests
    function fetchMyContests() {
        $.ajax({
            url: 'http://localhost/Coders_Battleground/Server/get-my-contests.php',
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                if (response.status === 'success') {
                    myContests = formatContestData(response.data, true);
                    
                    // Update list renderer if it exists
                    if (listRenderer) {
                        listRenderer.updateDataSet('mycontests', myContests);
                    }
                } else {
                    console.error('Error:', response.message);
                    myContests = [];
                }
            },
            error: function(xhr, status, error) {
                console.error('Failed to fetch my contests:', error);
                myContests = [];
            }
        });
    }
    
    // Initialize list renderer
    function initializeListRenderer() {
        listRenderer = new ListRenderer({
            containerId: 'list-group-ul',
            dataSets: {
                contests: allContests,
                mycontests: myContests
            },
            defaultKey: 'contests',
            buttonMap: {
                contests: 'contest-btn',
                mycontests: 'my-contest-btn'
            },
            emptyMessage: "No Contests Found",
            emptyClass: 'list-empty'
        });
    }
    
    // Load contests on page load
    fetchAllContests();
    fetchMyContests();
});