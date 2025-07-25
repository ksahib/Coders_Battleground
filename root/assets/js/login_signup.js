const loginSection = document.querySelector('.login-section');
const registerLink = document.querySelector('.register-link');
const loginLink = document.querySelector('.login-link');
const signInBtn = document.getElementById('signInBtn');

registerLink.addEventListener('click', () => {
  loginSection.classList.add('active');
});

loginLink.addEventListener('click', () => {
  loginSection.classList.remove('active');
});
