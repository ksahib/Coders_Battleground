require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
// Configuration for the IDE
require(['vs/editor/editor.main'], function () {
  monaco.editor.create(document.getElementById('editor-container'), {
    value: `// You can write your code here during the interview`,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    automaticLayout: true,
    suggestOnTriggerCharacters: false,
    quickSuggestions: false,
    parameterHints: { enabled: false },
    wordBasedSuggestions: false,
    snippetSuggestions: 'none',
    minimap: { enabled: false }
  });
});

let seconds = 0;
// Function to set time
setInterval(() => {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0'); 
  const secs = String(seconds % 60).padStart(2, '0');
  $('#timer').text(`${mins}:${secs}`);
}, 1000);
