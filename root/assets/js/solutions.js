$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const problemName = urlParams.get("name");

  $.ajax({
    url: "http://localhost/Server/get_solutions.php",
    method: "GET",
    data: { name: problemName },
    dataType: "json",
    success: function (solutions) {
      if (!Array.isArray(solutions) || solutions.length === 0) {
        $("#solutions-list").html('<div class="text-muted">No solutions submitted yet.</div>');
        return;
      }
      console.log(solutions);
      solutions.forEach(sol => {
        const solutionHTML = `
          <div class="solution-card">
            <div class="solution-meta d-flex justify-content-between">
              <div><strong>${sol.langauge}</strong> solution by <em>${sol.username}</em></div>
              
            </div>
            <div class="solution-code">${sol.code_text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")}</div>
          </div>
        `;
        $("#problem-name").text(sol.name);
        $("#solutions-list").append(solutionHTML);
      });
    },
    error: function () {
      $("#solutions-list").html('<div class="text-danger">Failed to load solutions.</div>');
    }
  });
});
