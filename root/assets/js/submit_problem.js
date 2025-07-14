$(document).ready(function () {
    console.log('Submit problem script loaded');
    
    $('#problem-submit-form').on('submit', function (e) {
        e.preventDefault();
        console.log('Form submitted');

        const problem = {
            name: $('#problem-name').val(),
            description: $('#problem-description').val(),
            tags: $('#problem-tags').val().split(',').map(tag => tag.trim()),
            difficulty: $('#problem-difficulty').val(),
            type: "INSERT"
        }
        
        console.log('Problem data:', problem);

        $.ajax({
            url: "http://localhost/Coders_Battleground/server/submit_problem.php",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(problem),
            success: function (response) {
                console.log('Success response:', response);
                try {
                    const result = typeof response === 'string' ? JSON.parse(response) : response;
                    $('#submit-status').css('color', 'limegreen').text(result.message);
                    console.log('Message displayed:', result.message);
                    $('#problem-submit-form')[0].reset();
                } catch (err) {
                    console.error('Parse error:', err);
                    $('#submit-status').css('color', 'orange').text('Unexpected response');
                }
            },
            error: function (xhr, status, error) {
                console.error('Ajax error:', status, error);
                console.error('Response:', xhr.responseText);
                $('#submit-status').html(`<span style="color:red;">Error: ${xhr.status} - ${error}</span>`);
            }
        })
    })
})