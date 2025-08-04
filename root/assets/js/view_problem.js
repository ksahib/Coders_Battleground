$(document).ready(function () {
  function loadProblems() {
    $.ajax({
      url: "http://localhost/Coders_Battleground/Server/view_problem.php",
      method: "GET",
      dataType: "json",
      success: function (problems) {
        $("#problems-list").empty();
        problems.forEach(problem => {
          const item = $("<li>").addClass("problem-item").attr("data-id", problem.problem_id);

          
          $("<div>").addClass("problem-title fw-bold").text(problem.name).appendTo(item);

          
          $("<div>").addClass("problem-desc mb-1").text(problem.description).appendTo(item);

      
          $("<div>").addClass("problem-difficulty badge bg-secondary").text(problem.difficulty).appendTo(item);

          
          const actions = $("<div>").addClass("problem-actions");
          $("<button>").addClass("btn btn-sm btn-warning edit-btn").text("Edit").appendTo(actions);
          $("<button>").addClass("btn btn-sm btn-danger delete-btn").text("Delete").appendTo(actions);
          actions.appendTo(item);

          $("#problems-list").append(item);
        });
      },
      error: () => {
        $('#problems-list').html('<li class="text-danger">Failed to load problems.</li>');
      }
    });
  }

  loadProblems();

  // Edit button
  $('#problems-list').on('click', '.edit-btn', function () {
    const item = $(this).closest('li');
    const name = item.find('.problem-title').text();
    const desc = item.find('.problem-desc').text();
    const diff = item.find('.problem-difficulty').text();

    item.find('.problem-title').replaceWith(`<input class="form-control problem-title-input" value="${$('<div>').text(name).html()}">`);
    item.find('.problem-desc').replaceWith(`<textarea class="form-control problem-desc-input">${$('<div>').text(desc).html()}</textarea>`);
    item.find('.problem-difficulty').replaceWith(`<input class="form-control problem-difficulty-input" value="${$('<div>').text(diff).html()}">`);

    $(this).text('Save').removeClass('edit-btn btn-warning').addClass('save-btn btn-success');
  });

  // Save button
  $('#problems-list').on('click', '.save-btn', function () {
    const item = $(this).closest('li');
    const id = item.data('id');
    const newName = item.find('.problem-title-input').val();
    const newDesc = item.find('.problem-desc-input').val();
    const newDiff = item.find('.problem-difficulty-input').val();

    $.ajax({
      url: "http://localhost/Coders_Battleground/Server/submit_problem.php",
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
          item.find('.problem-title-input').replaceWith(`<div class="problem-title fw-bold">${$('<div>').text(newName).html()}</div>`);
          item.find('.problem-desc-input').replaceWith(`<div class="problem-desc mb-1">${$('<div>').text(newDesc).html()}</div>`);
          item.find('.problem-difficulty-input').replaceWith(`<div class="problem-difficulty badge bg-secondary">${$('<div>').text(newDiff).html()}</div>`);
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

  // Delete button
  $('#problems-list').on('click', '.delete-btn', function () {
    const item = $(this).closest('li');
    const id = item.data('id');

    if (confirm('Are you sure you want to delete this problem?')) {
      $.ajax({
        url: "http://localhost/Coders_Battleground/Server/submit_problem.php",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({ id: id, type: "DELETE" }),
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
      });
    }
  });
});
