// Helpers
function showError(msg) {
  const el = document.getElementById('error');
  if (el) el.textContent = msg || '';
}

function saveAuth(token, user) {
  localStorage.setItem('token', token);
  if (user) {
    if (user.id) localStorage.setItem('userId', user.id);
    if (user.displayName) localStorage.setItem('displayName', user.displayName);
    if (user.role) localStorage.setItem('role', user.role);
    if (user.email) localStorage.setItem('email', user.email);
  }
}

function logout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

// LOGIN handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (!res.ok) return showError(data.error || 'Login failed.');

      saveAuth(data.token, data.user);

      // Redirect based on role
      if (data.user && data.user.role === 'admin') {
        window.location.href = '/admin/home.html';
      } else {
        window.location.href = '/home.html';
      }
    } catch (err) {
      console.error(err);
      showError('Something went wrong. Try again.');
    }
  });
}

// SIGNUP handler
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const displayName = document.getElementById('displayName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirm = document.getElementById('confirm').value;

    if (password !== confirm) return showError('Passwords do not match.');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password })
      });
      const data = await res.json();

      if (!res.ok) return showError(data.error || 'Sign up failed.');

      saveAuth(data.token, data.user);

      if (data.user && data.user.role === 'admin') {
        window.location.href = '/admin/home.html';
      } else {
        window.location.href = '/home.html';
      }
    } catch (err) {
      console.error(err);
      showError('Something went wrong. Try again.');
    }
  });
}
