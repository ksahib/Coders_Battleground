function showTab(tabId) {
  // if tabId is 'ranking', redirect instead of toggling
  if (tabId === 'ranking') {
    window.location.href = '../pages/live-standings.html';
    return; 
  }

  // otherwise do your normal in‑page tab switch:
  var tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}
