$(document).ready(function() {
    // Load navbar
    includeHtml('navbar-placeholder', '../components/navbar.html');
    
    // Featured cards
    const container = document.getElementById('cards-row-feature');
    const featuredContests = [
        { company: 'Google', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #1E90FF 0%, #00FF85 100%)' },
        { company: 'Amazon', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)' },
        { company: 'Microsoft', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' },
        { company: 'Apple', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)' },
        { company: 'Netflix', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #6dd5ed 100%)' },
        { company: 'Meta', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)' },
        { company: 'Nvidia', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)' },
        { company: 'OpenAI', title: 'Software Engineer', gradient: 'linear-gradient(135deg, #29323c 0%, #485563 100%)' }
    ];
    
    featuredContests.forEach(contest => {
        container.appendChild(
            createContentCard('Contest', `${contest.company} <br> ${contest.title}`, '18rem', '220px', '#', contest.gradient)
        );
    });
    
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
            url: 'localhost://Coders_Battleground/Server/get-contests.php',
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
            url: 'localhost://Coders_Battleground/Server/get-my-contests.php',
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