const $ = (s) => document.querySelector(s);

const listEl   = $('#list');
const errEl    = $('#error');

const nameEl   = $('#name');
const tierEl   = $('#tier');
const minEl    = $('#minutes');
const scopeEl  = $('#scope');
const imgEl    = $('#imageUrl');
const prevImg  = $('#previewImg');

const fltTier  = $('#fltTier');
const fltScope = $('#fltScope');

function showError(msg){ errEl.textContent = msg || ''; }

imgEl.addEventListener('input', () => {
  prevImg.src = imgEl.value || '/assets/placeholder.png';
});

async function api(path, opts = {}) {
  const res = await fetch(path, { credentials: 'include', ...opts });
  if (!res.ok) {
    let msg = 'Request failed';
    try { const d = await res.json(); msg = d.message || msg; } catch {}
    throw new Error(msg);
  }
  return res.json().catch(() => ({}));
}

async function load() {
  showError('');
  const qs = new URLSearchParams();
  if (fltTier.value !== 'ALL')  qs.set('tier', fltTier.value);
  if (fltScope.value !== 'ALL') qs.set('scope', fltScope.value);

  const { monsters } = await api(`/api/monster/admin?${qs.toString()}`);

  listEl.innerHTML = monsters.length
    ? monsters.map(m => `
      <div class="row">
        <div>${m.name}</div>
        <div>${m.tier}</div>
        <div>${m.minutes} min</div>
        <div>${m.scope}</div>
        <div>
          <button class="btn btn-muted" data-del="${m.id}">Delete</button>
        </div>
      </div>`).join('')
    : `<div class="row"><div style="grid-column:1/6;color:#666;">No monsters yet.</div></div>`;
}

$('#refreshBtn').addEventListener('click', () => load());

listEl.addEventListener('click', async (e) => {
  const id = e.target.dataset.del;
  if (!id) return;
  if (!confirm('Delete this monster?')) return;
  try {
    showError('');
    await fetch(`/api/monster/${id}`, { method: 'DELETE', credentials: 'include' });
    await load();
  } catch (err) { showError(err.message); }
});

$('#createBtn').addEventListener('click', async () => {
  try {
    showError('');
    const body = {
      name: nameEl.value.trim(),
      tier: tierEl.value,               
      minutes: Number(minEl.value),
      scope: scopeEl.value,             
      imageUrl: imgEl.value.trim(),
    };
    if (!body.name || !body.tier || !body.minutes || !body.scope || !body.imageUrl) {
      return showError('Please fill all required fields.');
    }
    await api('/api/monster', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    nameEl.value = '';
    imgEl.value = '';
    prevImg.src = '/assets/placeholder.png';
    await load();
  } catch (err) { showError(err.message); }
});

// initial
load().catch(err => showError(err.message));