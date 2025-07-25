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

function fetchProblems() {
  $.ajax({
    url: "http://localhost/Server/view_problem.php",
    method: "GET",
    dataType: "json",
    success: function (data) {
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

  
  $('.dropdown-item').on('click', function () {
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




  // Featured Card Section
  const $container = $('#cards-row-feature');

          $container.append(createContentCard('Interview', 'Google <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #1E90FF 0%, #00FF85 100%)'));
          $container.append(createContentCard('Interview', 'Amazon <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #7F00FF 0%, #E100FF 100%)'));
          $container.append(createContentCard('Interview', 'Microsoft <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'));
          $container.append(createContentCard('Interview', 'Apple <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)'));
          $container.append(createContentCard('Interview', 'Netflix <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #ff6a88 0%, #ff99ac 50%, #6dd5ed 100%)'));
          $container.append(createContentCard('Interview', 'Conda <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)'));
          $container.append(createContentCard('Interview', 'Nvidia <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'));
          $container.append(createContentCard('Interview', 'Linux <br> Software Engineer', '18rem', '220px', '#', 'linear-gradient(135deg, #29323c 0%, #485563 100%)'));
      
});

  const $container=$("#tag_holder_row")
    $(document).ready(function(){
        $.ajax({
          url: "http://localhost/Server/get_tags.php",
          method: "GET",
          dataType: "json",
          success: function(tags){
            console.log(tags);
               $("#tag_holder_row").empty();
               tags.forEach(tag => {
                 const $tagelement=$(`<div id="tag_card"><a href="tag_problems.html?tag=${encodeURIComponent(tag.tag_name)}" style="text-decoration:none;color:black;"><strong>${tag.tag_name}</strong></a></div>`)
                 $container.append($tagelement)
               }); 
          },
          error: () => {
        $('#tag_holder_row').html('<p class="text-danger">Failed to load tags.</p>');
      }
        })})
