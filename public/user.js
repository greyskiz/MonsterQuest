// function showError(msg) {
//   const el = document.getElementById('error');
//   if (el) el.textContent = msg || '';
// }
// function showSuccess(msg) {
//   const el = document.getElementById('success');
//   if (el) el.textContent = msg || '';
// }

// // GET current user; optional redirect on fail
// async function loadCurrentUser({ onSuccess, onFailRedirect } = {}) {
//   try {
//     const res = await fetch('/api/users/user', { credentials: 'include' });
//     if (!res.ok) throw new Error('Unauthorized');
//     const { user } = await res.json();
//     if (typeof onSuccess === 'function') onSuccess(user);
//     return user;
//   } catch (err) {
//     if (onFailRedirect) window.location.href = onFailRedirect;
//     else showError('Please log in first.');
//     throw err;
//   }
// }

// // PATCH /api/users/user
// async function updateProfile({ username, email }) {
//   try {
//     const res = await fetch('/api/users/user', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ username, email })
//     });
//     const data = await res.json().catch(() => ({}));
//     if (!res.ok) return showError(data.message || 'Failed to update profile.');
//     showSuccess('Profile updated.');
//   } catch (err) {
//     console.error(err);
//     showError('Something went wrong.');
//   }
// }

// // PATCH /api/users/user/password
// async function changePassword({ oldPassword, newPassword }) {
//   try {
//     const res = await fetch('/api/users/user/password', {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include',
//       body: JSON.stringify({ oldPassword, newPassword })
//     });
//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       return showError(data.message || 'Failed to change password.');
//     }
//     showSuccess('Password updated.');
//   } catch (err) {
//     console.error(err);
//     showError('Something went wrong.');
//   }
// }

// // DELETE /api/users/user
// async function deleteAccount() {
//   try {
//     const res = await fetch('/api/users/user', {
//       method: 'DELETE',
//       credentials: 'include'
//     });
//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       return showError(data.message || 'Failed to delete account.');
//     }
//     // Clear any client state and redirect to signup
//     localStorage.clear();
//     window.location.href = '/signup.html';
//   } catch (err) {
//     console.error(err);
//     showError('Something went wrong.');
//   }
// }


function showError(msg) {
  const el = document.getElementById('error');
  if (el) el.textContent = msg || '';
}
function showSuccess(msg) {
  //const el = document.getElementById('success');
  // if (el) el.textContent = msg || '';
  alert(msg);
}

// ==========================
// User Functions (username/email only)
// ==========================
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
    showSuccess('User info updated.');
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}

// ==========================
// Avatar Functions (name/image only)
// ==========================
async function loadAvatar() {
  try {
    const res = await fetch('/api/avatar', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load avatar');
    const { avatar } = await res.json();
    document.getElementById('avatarName').value = avatar.name || '';
    document.getElementById('avatarUrl').value = avatar.imageUrl || '';
    document.getElementById('avatarNamePreview').textContent = avatar.name || 'Your Avatar';
    document.getElementById('avatarImg').src = avatar.imageUrl || '/placeholder.png';
  } catch (err) {
    console.error(err);
    showError('Could not load avatar.');
  }
}

async function updateAvatar({ name, imageUrl }) {
  try {
    const res = await fetch('/api/avatar', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, imageUrl })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return showError(data.message || 'Failed to update avatar.');
    showSuccess('Avatar updated.');
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}

// ==========================
// Password + Delete (unchanged)
// ==========================
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

// async function deleteAccount() { //without deleting avatar
//   try {
//     const res = await fetch('/api/users/user', {
//       method: 'DELETE',
//       credentials: 'include'
//     });
//     if (!res.ok) {
//       const data = await res.json().catch(() => ({}));
//       return showError(data.message || 'Failed to delete account.');
//     }
//     localStorage.clear();
//     window.location.href = '/signup.html';
//   } catch (err) {
//     console.error(err);
//     showError('Something went wrong.');
//   }
// }



// ==========================
// Avatar Preview Live Update
// ==========================

async function deleteAccount() {
  try {
    // Delete avatar first
    await fetch('/api/avatar', {
      method: 'DELETE',
      credentials: 'include'
    }).catch(err => console.warn('Avatar deletion failed:', err));

    // Delete user account
    const res = await fetch('/api/users/user', {
      method: 'DELETE',
      credentials: 'include'
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return showError(data.message || 'Failed to delete account.');
    }

    localStorage.clear();
    window.location.href = '/signup.html';
  } catch (err) {
    console.error(err);
    showError('Something went wrong.');
  }
}


function setupAvatarPreview() {
  const avatarNameInput = document.getElementById('avatarName');
  const avatarUrlInput = document.getElementById('avatarUrl');
  const previewImg = document.getElementById('avatarImg');
  const previewName = document.getElementById('avatarNamePreview');

  if (avatarNameInput && previewName) {
    avatarNameInput.addEventListener('input', () => {
      previewName.textContent = avatarNameInput.value || 'Your Avatar';
    });
  }

  if (avatarUrlInput && previewImg) {
    avatarUrlInput.addEventListener('input', () => {
      previewImg.src = avatarUrlInput.value || '/placeholder.png';
    });
  }
}

// ==========================
// Shop Items
// ==========================
// async function loadShopItems() {
//   try {
//     const res = await fetch('/api/shop/my-items', { credentials: 'include' });
//     if (!res.ok) throw new Error('Failed to fetch items');
//     const { items } = await res.json();
//     renderShopItems(items || []);
//   } catch (err) {
//     console.error(err);
//     showError('Could not load shop items.');
//   }
// }

// function renderShopItems(items) {
//   const container = document.getElementById('shopItems');
//   if (!container) return;

//   container.innerHTML = '';
//   if (items.length === 0) {
//     container.innerHTML = '<p>No items purchased yet.</p>';
//     return;
//   }

//   items.forEach(item => {
//     const div = document.createElement('div');
//     div.className = 'shop-item';
//     div.innerHTML = `
//       <img src="${item.imageUrl || '/placeholder.png'}" alt="${item.name}"/>
//       <strong>${item.name}</strong>
//       <p>${item.description || ''}</p>
//     `;
//     container.appendChild(div);
//   });
// }

// ==========================
// Page setup
// ==========================
document.addEventListener('DOMContentLoaded', async () => {
  setupAvatarPreview();

  // Load user info
  try {
    const user = await loadCurrentUser({ onFailRedirect: '/login.html' });
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
  } catch (_) {}

  // Load avatar
  await loadAvatar();

  // Hook update buttons
  document.getElementById('updateUserBtn')?.addEventListener('click', async () => {
    await updateProfile({
      username: document.getElementById('username').value,
      email: document.getElementById('email').value
    });
  });

  document.getElementById('updateAvatarBtn')?.addEventListener('click', async () => {
    await updateAvatar({
      name: document.getElementById('avatarName').value,
      imageUrl: document.getElementById('avatarUrl').value
    });
  });

  // Load shop items
  //await loadShopItems();
});
