function showError(msg) {
  const el = document.getElementById('error');
  if (el) el.textContent = msg || '';
}
function showSuccess(msg) {
  const el = document.getElementById('success');
  if (el) el.textContent = msg || '';
}

// GET current user; optional redirect on fail
async function loadCurrentUser({ onSuccess, onFailRedirect } = {}) {
  try {
    const res = await fetch('/api/users/user', { credentials: 'include' });
    if (!res.ok) throw new Error('Unauthorized');
    const { user } = await res.json();
    if (typeof onSuccess === 'function') onSuccess(user);
    return user;
  } catch (err) {
    if (onFailRedirect) window.location.href = onFailRedirect;
    else showError('Please log in first.');
    throw err;
  }
}

// PATCH /api/users/user
async function updateProfile({ username, email }) {
  try {
    const res = await fetch('/api/users/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ username, email })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return showError(data.message || 'Failed to update profile.');
    showSuccess('Profile updated.');
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}

// PATCH /api/users/user/password
async function changePassword({ oldPassword, newPassword }) {
  try {
    const res = await fetch('/api/users/user/password', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ oldPassword, newPassword })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showError(data.message || 'Failed to change password.');
    }
    showSuccess('Password updated.');
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}

// DELETE /api/users/user
async function deleteAccount() {
  try {
    const res = await fetch('/api/users/user', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showError(data.message || 'Failed to delete account.');
    }
    // Clear any client state and redirect to signup
    localStorage.clear();
    window.location.href = '/signup.html';
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}
