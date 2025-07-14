$(document).ready(function () {
    // Problem management
    let problemCount = 0;

    function addProblemField() {
        problemCount++;
        const problemHTML = `
            <div class="problem-field-group mb-3" data-problem-number="${problemCount}">
                <div class="row align-items-end">
                    <div class="col-md-4">
                        <label class="form-label">Problem Title</label>
                        <input type="text" class="form-control problem-title" placeholder="Problem ${String.fromCharCode(64 + problemCount)} Title" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Problem ID</label>
                        <input type="number" class="form-control problem-id" placeholder="e.g., 1" required>
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Score</label>
                        <input type="number" class="form-control problem-score" placeholder="100" value="100" required>
                    </div>
                    <div class="col-md-2">
                        <button type="button" class="btn btn-danger w-100 remove-problem-btn">Remove</button>
                    </div>
                </div>
            </div>
        `;

        $('#problems-container').append(problemHTML);
    }

    // Add initial problem field
    addProblemField();

    // Add problem button click
    $('#add-problem-btn').on('click', function() {
        addProblemField();
    });

    // Remove problem button click (using delegation)
    $(document).on('click', '.remove-problem-btn', function() {
        $(this).closest('.problem-field-group').remove();
    });

    // Form submission
    $('#contest-form').on('submit', function (e) {
        e.preventDefault();

        // Collect problems
        const problems = [];
        $('.problem-field-group').each(function() {
            const title = $(this).find('.problem-title').val().trim();
            const problem_id = $(this).find('.problem-id').val().trim();
            const score = parseInt($(this).find('.problem-score').val()) || 100;
            
            if (title && problem_id) {
                problems.push({
                    title: title,
                    problem_id: problem_id,
                    score: score
                });
            }
        });

        // Validate at least one problem
        if (problems.length === 0) {
            $('#submit-status').html('<div class="alert alert-danger">Please add at least one problem to the contest</div>');
            return;
        }

        // Prepare contest data
        const contestData = {
            name: $('#contestName').val().trim(),
            contest_info: $('#contestDescription').val().trim(),
            start_time: $('#startTime').val(),
            end_time: $('#endTime').val(),
            problems: problems,
            type: "INSERT"
        };

        console.log('Sending contest data:', contestData);

        // Send AJAX request
        $.ajax({
            url: "http://localhost/Coders_Battleground/server/create_contest.php",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(contestData),
            success: function (response) {
                console.log('Response received:', response);
                try {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    
                    if (result.status === 'success') {
                        $('#submit-status').html('<div class="alert alert-success">' + result.message + '</div>');
                        
                        // Reset form
                        $('#contest-form')[0].reset();
                        $('#problems-container').empty();
                        problemCount = 0;
                        addProblemField();
                    } else {
                        $('#submit-status').html('<div class="alert alert-danger">' + result.message + '</div>');
                    }
                } catch (err) {
                    console.error('Parse error:', err);
                    $('#submit-status').html('<div class="alert alert-warning">Unexpected response from server</div>');
                }
            },
            error: function (xhr, status, error) {
                console.error('AJAX error:', status, error);
                console.error('Response:', xhr.responseText);
                
                let errorMessage = 'Error: ' + xhr.status;
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    if (errorResponse.message) {
                        errorMessage = errorResponse.message;
                    }
                } catch (e) {
                    errorMessage += ' - ' + error;
                }
                
                $('#submit-status').html('<div class="alert alert-danger">' + errorMessage + '</div>');
            }
        });
    });
});