require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });

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
setInterval(() => {
  seconds++;
  const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs = String(seconds % 60).padStart(2, '0');
  $('#timer').text(`${mins}:${secs}`);
}, 1000);

document.addEventListener("DOMContentLoaded", () => {
  const roomId = new URLSearchParams(window.location.search).get('interview_id');
  const userRole = new URLSearchParams(window.location.search).get('role') || 'interviewer';
  
  if (!roomId) {
    alert('Room ID is missing.');
    return;
  }

  if (userRole === 'candidate') {
    document.getElementById('interviewer-box').style.display = 'none';
  } else {
    document.getElementById('candidate-box').style.display = 'none';
  }

  const domain = 'meet.jit.si';
  const containerId = userRole === 'candidate' ? 'jitsi-candidate' : 'jitsi-interviewer';

  const jitsiOptions = {
    roomName: roomId,
    parentNode: document.getElementById(containerId),
    width: '100%',
    height: '100%',
    interfaceConfigOverwrite: { SHOW_JITSI_WATERMARK: false },
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false
    }
  };

  const api = new JitsiMeetExternalAPI(domain, jitsiOptions);

  api.addEventListener('videoConferenceJoined', () =>
    console.log(`✅ ${userRole} joined ${roomId}`)
  );
});
