function getSavedCodeFromCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === `savedCode_${name}`) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

let editor;
const urlParams = new URLSearchParams(window.location.search);
const problemName = urlParams.get("name");

require(['vs/editor/editor.main'], function () {
  const savedCode = getSavedCodeFromCookie(problemName);
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: savedCode || `// Write your solution here`,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    automaticLayout: true,
  });

  
  editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    document.cookie = `savedCode_${problemName}=${encodeURIComponent(code)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  });

  document.getElementById('language-select').addEventListener('change', function () {
    const newLang = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), newLang);
  });
});



$problem_holder=$(".problem-description-section");
$(document).ready(function(){
    $.ajax({
      url: "http://localhost/Server/problem_desc.php",
    method: "GET",
    data: { name: problemName },
    dataType: "json",
    success: function (problem) {
      const html=` <h2>Problem: ${problem.name}</h2>
      <p${problem.description}.</p>

      <h4>Example:</h4>
      <pre><code>Input: ${problem.input}  
Output: ${problem.output}</code></pre>

      `
     $problem_holder.append(html);
    }

    })
})