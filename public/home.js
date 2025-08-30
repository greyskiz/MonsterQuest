const $ = (s)=>document.querySelector(s);

const err   = $('#error');
const tier  = $('#tier');
const scope = $('#scope');
const list  = $('#list');

async function api(path) {
  const res = await fetch(path, { credentials:'include' });
  if (!res.ok) throw new Error('Failed to load monsters');
  return res.json();
}

async function load() {
  err.textContent = '';
  const qs = new URLSearchParams();
  if (tier.value !== 'ALL')  qs.set('tier', tier.value);
  if (scope.value !== 'ALL') qs.set('scope', scope.value);

  const { monsters } = await api('/api/monster?' + qs.toString());

  list.innerHTML = monsters.length
    ? monsters.map(m => `
        <div class="card wide">
          <img class="img" src="${m.imageUrl || '/assets/placeholder.png'}" alt="">
          <div>
            <h3 style="margin:0 0 6px;">${m.name}</h3>
            <div style="color:#666;">${m.tier} • ${m.minutes} min • ${m.scope}</div>
          </div>
          <a class="btn"
             href="/timer/timer.html?name=${encodeURIComponent(m.name)}&minutes=${m.minutes}&img=${encodeURIComponent(m.imageUrl||'')}">
             Start Session
          </a>
        </div>`).join('')
    : `<div class="card">No monsters yet. Ask an admin to add some.</div>`;
}

$('#refresh').addEventListener('click', () => load().catch(e => (err.textContent = e.message)));
$('#logoutBtn').addEventListener('click', () => logout());

(async () => {
  try {
    const u = localStorage.getItem('username') || '';
    if (u) $('#welcome').textContent = 'Welcome, ' + u;
    await load();
  } catch (e) {
    err.textContent = e.message;
  }
})();