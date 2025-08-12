let allProblems = [];

function renderProblems(problems) {
  const $tableBody = $('#problem-list');
  $tableBody.empty();
  problems.forEach(problem => {
    const row = `
      <tr>
        <th scope="row">${problem.problem_id}</th>
        <td><a href="Problem_desc.html?name=${encodeURIComponent(problem.name)}" style="text-decoration:none;">${problem.name}</a></td>
        <td>
          <span class="badge ${
            problem.difficulty === 'Easy' ? 'bg-success' :
            problem.difficulty === 'Medium' ? 'bg-warning text-dark' :
            'bg-danger'
          }">${problem.difficulty}</span>
        </td>
      </tr>`;
    $tableBody.append(row);
  });
}

function fetchProblems(offset = 0, limit = 15) {
  $.ajax({
    url: "http://localhost/Coders_Battleground/Server/view_problem.php",
    method: "GET",
    dataType: "json",
    data: { offset, limit },
    success: function (data) {
      console.log(data);
      allProblems = data;
      renderProblems(allProblems);
    },
    error: () => {
      $('#problem-list').html('<tr><td colspan="3" class="text-danger">Failed to load problems.</td></tr>');
    }
  });
}

$(document).ready(function () {
  fetchProblems(); 

  $('#search-box').on('input', function () {
    const keyword = $(this).val().toLowerCase();
    const filtered = allProblems.filter(p => p.name.toLowerCase().includes(keyword));
    renderProblems(filtered);

    const $suggestions = $('#suggestions');
    $suggestions.empty();
    if (keyword.length > 0) {
      filtered.slice(0, 5).forEach(p => {
        $suggestions.append(`<li class="list-group-item list-group-item-dark suggestion-item">${p.name}</li>`);
      });
    }
  });

  $(document).on('click', '.suggestion-item', function () {
    const name = $(this).text();
    $('#search-box').val(name).trigger('input');
    $('#suggestions').empty();
  });

  $('.dropdown-item[data-sort]').on('click', function () {
    const sort = $(this).data('sort');
    let sorted = [...allProblems];
    if (sort === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'difficulty') {
      const diffOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
      sorted.sort((a, b) => diffOrder[a.difficulty] - diffOrder[b.difficulty]);
    }
    renderProblems(sorted);
  });

  $(document).on('click', '.range-option', function () {
    const offset = parseInt($(this).data('offset'));
    const limit = parseInt($(this).data('limit'));
    fetchProblems(offset, limit);
  });

  // Featured Cards

  // Load tags
  const $tagContainer = $("#tag_holder_row");
  $.ajax({
    url: "http://localhost/Coders_Battleground/Server/get_tags.php",
    method: "GET",
    dataType: "json",
    success: function(tags) {
      $tagContainer.empty();
      tags.forEach(tag => {
        const $tag = $(`<div id="tag_card"><a href="tag_problems.html?tag=${encodeURIComponent(tag.tag_name)}" style="text-decoration:none;color:black;"><strong>${tag.tag_name}</strong></a></div>`);
        $tagContainer.append($tag);
      });
    },
    error: () => {
      $tagContainer.html('<p class="text-danger">Failed to load tags.</p>');
    }
  });
});
