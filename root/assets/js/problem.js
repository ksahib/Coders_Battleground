let problemData = {};

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const problemName = urlParams.get("name");

  if (!problemName) {
    $('#problem-title').text("No problem name provided in URL.");
    return;
  }

  $.ajax({
    url: "http://localhost/Server/problem_desc.php",
    method: "GET",
    data: { name: problemName },
    dataType: "json",
    success: function (problem) {
      problemData = {
        title: problem.name,
        difficulty: problem.difficulty,
       
        description: `
          <p>${problem.description}</p>

          <h4>Example:</h4>
          <pre><code>Input: ${problem.input}<br>Output: ${problem.output}</code></pre>
        `
      };

      $('#problem-title').text(problemData.title);
      $('#problem-difficulty')
        .text(problemData.difficulty)
        .addClass(problemData.difficulty); 

      
      $('#problem-description').html(problemData.description);
      $('.try-button').attr('href', `IDE.html?name=${encodeURIComponent(problem.name)}`);
      $('#solution').attr('href', `solutions.html?name=${encodeURIComponent(problem.name)}`);
    },
    error: function () {
      $('#problem-title').text("Failed to load problem details.");
    }
  });
});
