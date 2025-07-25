$(document).ready(function () {
    $('#problem-submit-form').on('submit', function (e) {
        e.preventDefault();

        const problem = {
            name: $('#problem-name').val(),
            description: $('#problem-description').val(),
            input: $('#problem-input').val(),
            output: $('#problem-output').val(),
            tags: $('#problem-tags').val().split(',').map(tag => tag.trim()).filter(tag => tag),
            difficulty: $('#problem-difficulty').val(),
            type: "INSERT"
        }

        $.ajax({
            url: "http://localhost/server/submit_problem.php",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(problem),
            success: function (response) {
                try {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    $('#submit-status').css('color', 'limegreen').text(result.message);
                    
                    // Reset form on successful submission
                    $('#problem-submit-form')[0].reset();
                    
                    // Scroll to status message
                    $('#submit-status')[0].scrollIntoView({ behavior: 'smooth' });
                } catch (error) {
                    $('#submit-status').css('color', 'orange').text('Unexpected response format');
                    console.error('Response parsing error:', error);
                }
            },
            error: function (xhr) {
                console.log("❌ AJAX call failed. Status:", xhr.status);
                
                let errorMessage = 'An error occurred';
                try {
                    const errorResponse = JSON.parse(xhr.responseText);
                    errorMessage = errorResponse.message || errorMessage;
                } catch (e) {
                    errorMessage = xhr.responseText || `Error: ${xhr.status}`;
                }
                
                $('#submit-status').html(`<span style="color:red;">${errorMessage}</span>`);
                $('#submit-status')[0].scrollIntoView({ behavior: 'smooth' });
            }
        })
    })
})