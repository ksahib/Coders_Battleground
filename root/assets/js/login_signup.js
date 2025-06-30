

const loginSection = document.querySelector('.login-section');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');

registerLink.addEventListener('click', () => {
  loginSection.classList.add('active');
});

loginLink.addEventListener('click', () => {
  loginSection.classList.remove('active');
});

signInBtn.addEventListener('click', () => {
  window.location.href = '../pages/home.html';
});