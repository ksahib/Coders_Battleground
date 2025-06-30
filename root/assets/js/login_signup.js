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

signInBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Please fill in both email and password.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  window.location.href = '../pages/home.html';
});
