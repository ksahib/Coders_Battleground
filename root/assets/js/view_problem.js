$(document).ready(function(){
    function loadProblems(){
        $.ajax({
            url: "http://localhost/Server/view_problem.php",
            method: "GET",
            dataType: "json",
            success: function (problems){
                
                $("#problems-list").empty();
                problems.forEach(problem => {
                    const html=`
            <li class="problem-item" data-id="${problem.problem_id}">
              <div class="problem-title fw-bold">${problem.name}</div>
              <div class="problem-desc mb-1">${problem.description}</div>
              <div class="problem-difficulty badge bg-secondary">${problem.difficulty}</div>
              <div class="problem-actions">
                <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
              </div>
            </li>
          `; 
             $("#problems-list").append(html);
                    
            });
            },
            error: () => {
        $('#problems-list').html('<li class="text-danger">Failed to load problems.</li>');
      }

        })
    }
loadProblems();
  
    $('#problems-list').on('click', '.edit-btn', function () {
    const item = $(this).closest('li');
    const name = item.find('.problem-title').text();
    const desc = item.find('.problem-desc').text();
    const diff = item.find('.problem-difficulty').text();

    item.find('.problem-title').replaceWith(`<input class="form-control problem-title-input" value="${name}">`);
    item.find('.problem-desc').replaceWith(`<textarea class="form-control problem-desc-input">${desc}</textarea>`);
    item.find('.problem-difficulty').replaceWith(`<input class="form-control problem-difficulty-input" value="${diff}">`);

    $(this).text('Save').removeClass('edit-btn btn-warning').addClass('save-btn btn-success');
  })

   $('#problems-list').on('click', '.save-btn', function () {
    const item = $(this).closest('li');
    const id = item.data('id');
    const newName = item.find('.problem-title-input').val();
    const newDesc = item.find('.problem-desc-input').val();
    const newDiff = item.find('.problem-difficulty-input').val();

    $.ajax({
      url: "http://localhost/Server/submit_problem.php",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        id: id,
        name: newName,
        description: newDesc,
        difficulty: newDiff,
        type: "UPDATE"
      }),
      success: function (res) {
        if (res.success) {
          item.find('.problem-title-input').replaceWith(`<div class="problem-title fw-bold">${newName}</div>`);
          item.find('.problem-desc-input').replaceWith(`<div class="problem-desc mb-1">${newDesc}</div>`);
          item.find('.problem-difficulty-input').replaceWith(`<div class="problem-difficulty badge bg-secondary">${newDiff}</div>`);
          item.find('.save-btn').text('Edit').removeClass('save-btn btn-success').addClass('edit-btn btn-warning');
        } else {
          alert('Update failed.');
        }
      },
      error: function () {
        alert('Server error during update.');
      }
    });
  });

  $('#problems-list').on('click', '.delete-btn', function () {
          const item = $(this).closest('li');
    const id = item.data('id');

    if (confirm('Are you sure you want to delete this problem?')) {
      $.ajax({
        url: "http://localhost/Server/submit_problem.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id:id,
          type: "DELETE"

         }),
        success: function (res) {
          if (res.success) {
            item.remove();
          } else {
            alert('Delete failed.');
          }
        },
        error: function () {
          alert('Server error during delete.');
        }

  })
}
})
})

