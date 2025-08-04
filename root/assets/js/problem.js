let problemData = {};

$(document).ready(async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const problemName = urlParams.get("name");

  if (!problemName) {
    $('#problem-title').text("No problem name provided in URL.");
    return;
  }
  console.log(problemName);
  // $.ajax({
  //   url: "http://localhost/Coders_Battleground/Server/problem_desc.php",
  //   method: "GET",
  //   data: { name: problemName },
  //   dataType: "json",
  //   success: function (problem) {
  //     console.log(problem);
  //     problemData = {
  //       title: problem.name,
  //       difficulty: problem.difficulty,
       
  //       description: `
  //         <p>${problem.description}</p>

  //         <h4>Example:</h4>
  //         <pre><code>Input: ${problem.i}<br>Output: ${problem.o}</code></pre>
  //       `
  //     };

  //     $('#problem-title').text(problemData.title);
  //     $('#problem-difficulty')
  //       .text(problemData.difficulty)
  //       .addClass(problemData.difficulty); 

      
  //     $('#problem-description').html(problemData.description);
  //     $('.try-button').attr('href', `IDE.html?name=${encodeURIComponent(problem.name)}`);
  //     $('#solution').attr('href', `solutions.html?name=${encodeURIComponent(problem.name)}`);
  //   },
  //   error: function () {
  //     $('#problem-title').text("Failed to load problem details.");
  //   }
  // });
   try {
          const resp = await fetch(`http://localhost/Coders_Battleground/Server/problem_desc.php?title=${encodeURIComponent(problemName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
           
          });
          const problem = await resp.json();
          if (problem.success) {
            console.log(problem);
            problemData = {
        title: problem.problem.name,
        difficulty: problem.problem.difficulty,
       
        description: `
          <p>${problem.problem.description}</p>

          <h4>Example:</h4>
          <pre><code>Input: ${problem.problem.input}<br>Output: ${problem.problem.output}</code></pre>
        `
      };
      console.log(problemData);

      $('#problem-title').text(problemData.title);
      $('#problem-difficulty')
        .text(problemData.difficulty)
        .addClass(problemData.difficulty); 

      
      $('#problem-description').html(problemData.description);
      $('.try-button').attr('href', `IDE.html?name=${encodeURI(problemData.title)}`);
      $('#solution').attr('href', `solutions.html?name=${encodeURI(problemData.title)}`);
          } else {
            $('#problem-title').text("Failed to load problem details.");
          }
        } catch (err) {
          $('#problem-title').text("Server error.");
        }

});
