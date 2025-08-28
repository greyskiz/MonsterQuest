function showError(msg) {
  const el = document.getElementById('error');
  if (el) el.textContent = msg || '';
}

function setSessionUser(user) {
  // Store only username-centric info (no token, no authoritative role)
  localStorage.setItem('username', user.username || '');
  localStorage.setItem('email', user.email || '');
  localStorage.setItem('userId', user.id || '');
}


async function fetchMe() {
  const res = await fetch('/api/auth/me', { method: 'GET', credentials: 'include' }); 
  if (!res.ok) throw new Error('Failed to fetch profile');
  const data = await res.json();
  return data.user;
}

async function finishAuthFlow() {
  try {
    const user = await fetchMe();
    setSessionUser(user);
    if (user.role === 'ADMIN') window.location.href = '/admin/home.html';
    else window.location.href = '/home.html';
  } catch (err) {
    console.error(err);
    showError('Could not load your profile. Try again.');
  }
}

window.logout = async function () {
  try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
  localStorage.clear();
  window.location.href = '/login.html';
};

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const username = loginForm.querySelector('#username')?.value.trim();
    const password = loginForm.querySelector('#password')?.value;
    if (!username || !password) return showError('Please enter username and password.');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',                                 
        body: JSON.stringify({ username, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return showError(data.message || data.error || 'Login failed.');
      await finishAuthFlow();
    } catch (err) {
      console.error(err);
      showError('Something went wrong. Try again.');
    }
  });
}

// SIGNUP
const signupForm = document.getElementById('signupForm');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const username = signupForm.querySelector('#username')?.value.trim();
    const email = signupForm.querySelector('#email')?.value.trim();
    const password = signupForm.querySelector('#password')?.value;
    const confirm  = signupForm.querySelector('#confirm')?.value;

    if (!username) return showError('Please enter a username.');
    if (!email)    return showError('Please enter an email.');
    if (!password) return showError('Please enter a password.');
    if (password !== confirm) return showError('Passwords do not match.');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, email, password }) 
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return showError(data.message || data.error || 'Sign up failed.');
      await finishAuthFlow();
    } catch (err) {
      console.error(err);
      showError('Something went wrong. Try again.');
    }
  });
}

