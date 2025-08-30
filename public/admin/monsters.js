const $ = (sel) => document.querySelector(sel);
const err = (msg) => { const e = $('#error'); if (e) e.textContent = msg || ''; };

function escapeHtml(s=''){return s.replace(/[&<>"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));}
function escapeAttr(s=''){return s.replace(/"/g,'&quot;');}

// --- Image preview wireup ---
(function wirePreview(){
  const input = $('#imageUrl');
  const img   = $('#previewImg');
  if (!input || !img) return;
  const apply = () => { img.src = input.value.trim(); };
  input.addEventListener('input', apply);
  input.addEventListener('blur', apply);
})();

// --- Fetch all monsters ---
async function fetchMonsters(){
  const res = await fetch('/api/monster', { credentials:'include' });
  if (!res.ok) throw new Error('Failed to load monsters');
  return res.json();
}

// --- Render table ---
function renderTable(items){
  const body = $('#listBody');
  if (!body) return;

  if (!items || items.length === 0){
    body.innerHTML = `<tr><td colspan="6" style="color:#6b7280;">No monsters yet.</td></tr>`;
    return;
  }

  body.innerHTML = items.map(m => `
    <tr>
      <td>${escapeHtml(m.name)}</td>
      <td>${escapeHtml(m.tier)}</td>
      <td>${m.minutes}</td>
      <td><span class="tag">${escapeHtml(m.scope)}</span></td>
      <td>
        ${m.imageUrl ? `<img src="${escapeAttr(m.imageUrl)}" alt="" style="height:38px;border-radius:8px;">` : '-'}
      </td>
      <td><button class="btn-danger" data-id="${m.id}">Delete</button></td>
    </tr>
  `).join('');

  body.querySelectorAll('button[data-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (!confirm('Delete this monster?')) return;
      const res = await fetch(`/api/monster/${id}`, { method:'DELETE', credentials:'include' });
      if (!res.ok){
        const j = await res.json().catch(()=>({}));
        return err(j.message || 'Delete failed');
      }
      refreshList();
    });
  });
}

async function refreshList(){
  try {
    err('');
    const items = await fetchMonsters();
    renderTable(items);
  } catch (e) {
    err(e.message || 'Could not load list');
  }
}

// --- Create monster ---
$('#monsterForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  err('');

  const name     = $('#monsterName')?.value.trim();
  const tier     = $('#tier')?.value;               // QUICK | STANDARD | LONG
  const minutes  = parseInt($('#minutes')?.value,10);
  const scope    = $('#scope')?.value;              // SOLO | PARTY
  const imageUrl = $('#imageUrl')?.value.trim();

  if (!name || !tier || !minutes || !scope || !imageUrl){
    return err('name, tier, minutes, scope, and image are required.');
  }

  try {
    const res = await fetch('/api/monster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, tier, minutes, scope, imageUrl }),
    });
    const data = await res.json().catch(()=> ({}));
    if (!res.ok) return err(data.message || 'Create failed');

    // Reset only the name (keep tier, minutes, etc. for faster entry)
    $('#monsterName').value = '';
    refreshList();
  } catch {
    err('Create failed');
  }
});

// Initial load
document.addEventListener('DOMContentLoaded', refreshList);
