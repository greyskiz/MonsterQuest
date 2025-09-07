// ---- Helpers ----
function showError(msg) {
  const el = document.getElementById('error');
  if (el) el.textContent = msg || '';
}

// Small utility to check if a string is a valid URL
function isValidUrl(str) {
  try {
    new URL(str);
    return true;
  } catch (_) {
    return false;
  }
}

// ---- DOM references ----
const form = document.getElementById('avatarForm');
const nameInput = document.getElementById('name');
const imageUrlInput = document.getElementById('imageUrl');
const preview = document.getElementById('preview');

// ---- Live preview of avatar image ----
if (imageUrlInput) {
  imageUrlInput.addEventListener('input', () => {
    const url = imageUrlInput.value.trim();
    if (isValidUrl(url)) {
      preview.innerHTML = `<img src="${url}" alt="Avatar Preview">`;
      showError('');
    } else {
      preview.innerHTML = '';
    }
  });
}

// ---- Handle form submit ----
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('');

    const name = nameInput?.value.trim();
    const imageUrl = imageUrlInput?.value.trim();

    // Frontend validation
    if (!name) return showError('Please enter an avatar name.');
    if (!isValidUrl(imageUrl)) return showError('Please enter a valid picture URL.');

    try {
      // Call backend to create avatar
      const res = await fetch('/api/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important so session cookie is sent
        body: JSON.stringify({ name, imageUrl })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return showError(data.message || data.error || 'Could not save avatar.');

      // If successful, go to home
      window.location.href = '/home.html';
    } catch (err) {
      console.error(err);
      showError('Something went wrong. Try again.');
    }
  });
}
