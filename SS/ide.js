require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

let editor;
require(['vs/editor/editor.main'], function () {
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: `// Write your solution here`,
    language: 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    automaticLayout: true,
  });

  // Language selector changes the editor language dynamically
  document.getElementById('language-select').addEventListener('change', function () {
    const newLang = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), newLang);
  });
});
