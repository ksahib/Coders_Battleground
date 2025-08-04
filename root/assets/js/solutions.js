function escapeHTML(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const problemName = urlParams.get("name");

  $.ajax({
    url: "http://localhost/Coders_Battleground/Server/get_solutions.php",
    method: "GET",
    data: { name: problemName },
    dataType: "json",
    success: function (solutions) {
      console.log(solutions);

      if (!Array.isArray(solutions) || solutions.length === 0) {
        $("#solutions-list").html('<div class="text-muted">No solutions submitted yet.</div>');
        return;
      }

      solutions.forEach(sol => {
        const safeCode = `<pre><code class="language-${escapeHTML(sol.langauge || "text").toLowerCase()}">${escapeHTML(sol.code || "")}</code></pre>`;
        const safeLang = escapeHTML(sol.langauge || "Unknown");
        const safeUser = escapeHTML(sol.username || sol.email || "Anonymous");
        const safeName = escapeHTML(sol.name || "Unnamed Problem");

        const solutionHTML = `
          <div class="solution-card mb-4 p-3 border rounded">
            <div class="solution-meta d-flex justify-content-between mb-2">
              <div><strong>${safeLang}</strong> solution by <em>${safeUser}</em></div>
            </div>
            <div class="solution-code">${safeCode}</div>
          </div>
        `;

        $("#problem-name").text(safeName);
        $("#solutions-list").append(solutionHTML);
      });

      // Highlight code blocks
      if (typeof hljs !== 'undefined') {
        hljs.highlightAll();
      }
    },
    error: function () {
      $("#solutions-list").html('<div class="text-danger">Failed to load solutions.</div>');
    }
  });
});
