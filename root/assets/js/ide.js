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
function getSavedLangFromCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === `selected_lang_${name}`) {
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
  const savedlang = getSavedLangFromCookie(problemName);
  editor = monaco.editor.create(document.getElementById('editor-container'), {
    value: savedCode || `// Write your solution here`,
    language: savedlang || 'javascript',
    theme: 'vs-dark',
    fontSize: 14,
    automaticLayout: true,
  });

  editor.onDidChangeModelContent(() => {
    const code = editor.getValue();
    const lang=editor.getModel().getLanguageId();
    document.cookie = `savedCode_${problemName}=${encodeURIComponent(code)}; path=/; max-age=${7 * 24 * 60 * 60}`;
    document.cookie = `selected_lang_${problemName}=${encodeURIComponent(lang)}; path=/; max-age=${7 * 24 * 60 * 60}`;
  });

  document.getElementById('language-select').addEventListener('change', function () {
    const newLang = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), newLang);
  });
});

let languageMap = {
  "python": 71,
  "javascript": 63,
  "c": 50,
  "cpp": 54,
  "java": 62
};

const $problem_holder = $(".problem-description-section");
let expectedOutput="";
let prbId="";
$(document).ready( async function () {
  console.log(problemName);
  
//   $.ajax({
//     url: "http://localhost/Coders_Battleground/Server/problem_desc.php",
//     method: "GET",
//     data: { name: problemName },
//     dataType: "json",
//     success: function (problem) {
//       expectedOutput=problem.o;
//       prbId=problem.problem_id;
//       const html = `
//         <h2>Problem: ${problem.name}</h2>
//         <p>${problem.description}</p>
//         <h4>Example:</h4>
//         <pre><code>Input: ${problem.input}  
// Output: ${problem.output}</code></pre>
//       `;
//       $problem_holder.append(html);
//     }
//   });

   try {
          const resp = await fetch(`http://localhost/Coders_Battleground/Server/problem_desc.php?title=${encodeURIComponent(problemName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
           
          });
          const problem = await resp.json();
          if(problem.success)
          {
             expectedOutput=problem.problem.output;
      prbId=problem.problem.problem_id;
      const html = `
        <h2>Problem: ${problem.problem.name}</h2>
        <p>${problem.problem.description}</p>
        <h4>Example:</h4>
        <pre><code>Input: ${problem.problem.input}  
Output: ${problem.problem.output}</code></pre>
      `;
      $problem_holder.append(html);
          }

        
        } catch (err) {
          $('#problem-title').text("Server error.");
        }

  
  function base64Encode(str) {
    return btoa(unescape(encodeURIComponent(str)));
  }
  async function submitCode(srcCode,languageId){
    const encodedCode = base64Encode(srcCode);
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*';

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '97089eb97fmsh7de3dec8ddd5dc6p15ac47jsn34fe36578cc1',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: encodedCode
      })
    };
    const lang=editor.getModel().getLanguageId();
    const response = await fetch(url, options);
    const result = await response.json();
    const output = result.stdout ? atob(result.stdout).trim() : "";
    if (output === expectedOutput.trim()){
    //   $.post("http://localhost/Coders_Battleground/Server/submit_solution.php", {
      
    //   prbID: prbId,
    //   code: srcCode,
    //   time:result.time,
    //   mem:result.memory,
    //   lang:lang
    // });
    try{
      const resp=await fetch('http://localhost/Coders_Battleground/Server/submit_solution.php',{
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           credentials: 'include',
           body: JSON.stringify({
            prbId:prbId,
            code:srcCode,
            time:result.time,
            mem:result.memory,
            lang:lang
           })
          });
      const ans=await resp.json();
      console.log(ans);
      if(ans.success)
      { 
        alert("Problem Submitted Successfully.");
        $("#submitCode").text("Accepted");
      }

    }catch(err){
        alert("Problem Connecting to server.");
    }
      
    }

  }
  
  async function sendToCompiler(srcCode, languageId) {

    
    const encodedCode = base64Encode(srcCode);
    const url = 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*';

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '97089eb97fmsh7de3dec8ddd5dc6p15ac47jsn34fe36578cc1',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: encodedCode
      })
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log("Output:", result.stdout ? atob(result.stdout) : "No output");
      console.log("Output:\n" + (result.stdout ? atob(result.stdout) : result.stderr || result.compile_output || "Unknown error"));
     let output = `
  <h4>Output:</h4>
  <pre>${result.stdout ? atob(result.stdout) : (result.stderr || result.compile_output || "Unknown error")}</pre>
  <p><strong>Time:</strong> ${result.time ?? "N/A"} sec</p>
  <p><strong>Memory:</strong> ${result.memory ? result.memory + " KB" : "N/A"}</p>
`;

$(".io-box").html(output);


    } catch (error) {
      console.error(error);
    }
  }

  $("#runCode").on("click", function () {
    const srcCode = editor.getValue();
    const langKey = editor.getModel().getLanguageId();
    const languageId = languageMap[langKey];
    
    

    if (!languageId) {
      alert("Unsupported language selected.");
      return;
    }

    sendToCompiler(srcCode, languageId);
  });

  $("#submitCode").on("click",function(){
     const srcCode = editor.getValue();
    const langKey = editor.getModel().getLanguageId();
    const languageId = languageMap[langKey];
    
    

    if (!languageId) {
      alert("Unsupported language selected.");
      return;
    }

    submitCode(srcCode, languageId);

  })
});
