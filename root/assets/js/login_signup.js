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

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}


 document.addEventListener('DOMContentLoaded', () => {
      const loginBox = document.querySelector('#loginForm').closest('.form-container');
      const signupBox = document.querySelector('#signupBox');

      document.querySelectorAll('.register-link').forEach(el =>
        el.addEventListener('click', () => {
          loginBox.classList.add('d-none');
          signupBox.classList.remove('d-none');
        })
      );

      document.querySelectorAll('.login-link').forEach(el =>
        el.addEventListener('click', () => {
          signupBox.classList.add('d-none');
          loginBox.classList.remove('d-none');
        })
      );

      // Login Form Submission
      const loginForm = document.getElementById('loginForm');
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loginError = document.getElementById('loginError');
        const email = loginForm.email.value.trim();
        if(!validateEmail(email))
        {
           loginError.textContent='Please enter a valid Email';
           return;
        }
        console.log(email);
        const password = loginForm.password.value.trim();
        if (!email || !password) {
          loginError.textContent = 'Please fill in both fields.';
          return;
        }

        try {
          const resp = await fetch('http://localhost/Coders_Battleground/Server/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password })
          });
          const data = await resp.json();
          console.log(data);
          if (data.success) {
            window.location.href = data.role === 'company' ? 'admin-dashboard.html' : 'home.html';
          } else {
            loginError.textContent = data.error || 'Login failed.';
          }
        } catch (err) {
          loginError.textContent = 'Server error.';
        }
      });

      // Signup Form Submission
      const signupForm = document.getElementById('signupForm');
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = signupForm.username.value.trim();
        const email = signupForm.email.value.trim();
        const password = signupForm.password.value.trim();
        const role = signupForm.role.value;
        const signupError = document.getElementById('signupError');
        signupError.textContent = '';

        if (!username || !email || !password || !role) {
          signupError.textContent = 'Please complete all fields.';
          return;
        }

        // const xhr = new XMLHttpRequest();
        // xhr.open('POST', 'http://localhost/Server/signup.php', true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.withCredentials = true;
        // xhr.onreadystatechange = () => {
        //   if (xhr.readyState === XMLHttpRequest.DONE) {
        //     try {
        //       const res = JSON.parse(xhr.responseText);
        //       if (res.success) {
        //         window.location.href = 'home.html';
        //       } else {
        //         signupError.textContent = res.error || 'Signup failed.';
        //       }
        //     } catch (err) {
        //       signupError.textContent = 'Invalid server response.';
        //     }
        //   }
        // };
        // xhr.onerror = () => signupError.textContent = 'Server error.';
        // xhr.send(JSON.stringify({ username, email, password }));
        try {
          const resp = await fetch('http://localhost/Coders_Battleground/Server/signup.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username,email, password,role })
          });
          const data = await resp.json();
          console.log(data);
          if (data.success) {
            window.location.href = 'login_signup.html';
          } else {
            loginError.textContent = data.error || 'Signup failed.';
          }
        } catch (err) {
          loginError.textContent = 'Server error.';
        }
      });
    });