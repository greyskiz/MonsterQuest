function showError(msg) { const el = document.getElementById('error'); if (el) el.textContent = msg || ''; }
function showSuccess(msg) { const el = document.getElementById('success'); if (el) el.textContent = msg || ''; }

async function requireAdmin() {
  const res = await fetch('/api/users/user', { credentials: 'include' });
  if (!res.ok) throw new Error('Unauthorized');
  const { user } = await res.json();
  if (user.role !== 'ADMIN') throw new Error('Forbidden');
  const badge = document.getElementById('adminUser');
  if (badge) badge.textContent = `${user.username} (ADMIN)`;
  return user;
}

async function listTemplates() {
  const tbody = document.getElementById('templatesTbody');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="5" class="muted">Loading…</td></tr>`;
  try {
    const res = await fetch('/api/monster-templates', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load templates');
    const { templates } = await res.json();

    if (!templates || templates.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="muted">No templates yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    templates.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${t.name}</td>
        <td><span class="badge">${t.tier}</span></td>
        <td>${t.minutes}</td>
        <td>${t.baseCoins ?? '-'}</td>
        <td><button class="danger inline" data-id="${t.id}">Delete</button></td>
      `;
      tbody.appendChild(tr);
    });

    tbody.querySelectorAll('button.danger').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        if (!confirm('Delete this template?')) return;
        try {
          const delRes = await fetch(`/api/monster-templates/${id}`, {
            method: 'DELETE',
            credentials: 'include'
          });
          if (!delRes.ok) {
            const data = await delRes.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to delete template');
          }
          showSuccess('Template deleted.');
          listTemplates();
        } catch (err) {
          console.error(err);
          showError(err.message || 'Delete failed.');
        }
      });
    });
  } catch (err) {
    console.error(err);
    showError(err.message || 'Failed to load templates.');
  }
}

async function createTemplate(payload) {
  const res = await fetch('/api/monster-templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Create failed');
  }
  return res.json();
}

async function promoteUser(identifier) {
  const res = await fetch('/api/admin/promote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ identifier })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || 'Promotion failed');
  }
  return res.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await requireAdmin();
    await listTemplates();
  } catch (err) {
    showError('Access denied: ' + err.message);
    setTimeout(() => { window.location.href = '/login.html'; }, 1500);
    return;
  }

  const createForm = document.getElementById('createTemplateForm');
  if (createForm) {
    createForm.addEventListener('submit', async e => {
      e.preventDefault();
      showError(''); showSuccess('');
      const payload = {
        name: createForm.querySelector('#name').value.trim(),
        tier: createForm.querySelector('#tier').value,
        minutes: parseInt(createForm.querySelector('#minutes').value, 10),
        baseCoins: parseInt(createForm.querySelector('#baseCoins').value || '0', 10),
        imageUrl: createForm.querySelector('#imageUrl').value.trim() || null,
      };
      try {
        await createTemplate(payload);
        showSuccess('Template created.');
        createForm.reset();
        listTemplates();
      } catch (err) { showError(err.message); }
    });
  }

  const promoteForm = document.getElementById('promoteForm');
  if (promoteForm) {
    promoteForm.addEventListener('submit', async e => {
      e.preventDefault();
      showError(''); showSuccess('');
      const idVal = promoteForm.querySelector('#userIdentifier').value.trim();
      if (!idVal) return showError('Please enter a username or email.');
      try {
        await promoteUser(idVal);
        showSuccess('User promoted to admin.');
        promoteForm.reset();
      } catch (err) { showError(err.message); }
    });
  }

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try { await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' }); } catch {}
      localStorage.clear();
      window.location.href = '/login.html';
    });
  }
});
