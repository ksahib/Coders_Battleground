function showTab(tabId) {
  if (tabId === 'ranking') {
    window.location.href = '../pages/live-standings.html';
    return; 
  }

  var tabs = document.querySelectorAll('.tab-content');
  tabs.forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
}
