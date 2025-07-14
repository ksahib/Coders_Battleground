$(document).ready(function(){
    $('#problem-submit-form').on('submit',function(e){
        e.preventDefault();

        const problem={
            name: $('#problem-name').val(),
            description: $('#problem-description').val(),
            tags: $('#problem-tags').val().split(',').map(tag => tag.trim()),
            difficulty: $('#problem-difficulty').val(),
            acceptance: $('#problem-acceptance').val() || null,
            type: "INSERT"
        }

        $.ajax({
            url: "http://localhost/CB_BackEnd/submit_problem.php",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(problem),
            success: function(response){
                
               try {
    const result = typeof response === 'string' ? JSON.parse(response) : response;
    $('#submit-status').css('color', 'limegreen').text(result.message);
} catch {
    $('#submit-status').css('color', 'orange').text('Unexpected response');
}
                $('#problem-submit-form')[0].reset();
            },
            error: function (xhr) {
                $('#submit-status').html(`<span style="color:red;">Error: ${xhr.status}</span>`);
            }
        })
    })
})