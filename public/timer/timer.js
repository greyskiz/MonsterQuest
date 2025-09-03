/* ----------------------- small helpers ----------------------- */
function qsParam(name, def = '') {
  const u = new URL(window.location.href);
  return u.searchParams.get(name) ?? def;
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) {
    let text = '';
    try { text = await res.text(); } catch {}
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

async function patchJSON(url, body) {
  const res = await fetch(url, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {})
  });
  if (!res.ok) {
    let text = '';
    try { text = await res.text(); } catch {}
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el;
}

/* ----------------------- DOM refs ---------------------------- */
const displayEl = $('display');
const startBtn  = $('start');
const pauseBtn  = $('pause');
const resetBtn  = $('reset');
const finishBtn = $('finish');

const nameEl = document.getElementById('monsterName');
const imgEl  = document.getElementById('monsterImg');

/* ----------------------- URL data ---------------------------- */
const minutes     = Number(qsParam('minutes', '10')) || 10;
const monsterId   = qsParam('monsterId', '');
const monsterName = qsParam('name', '');
const img         = qsParam('img', '');

if (nameEl) nameEl.textContent = monsterName || '...';
if (imgEl)  imgEl.src = img || '/assets/placeholder.png';

/* ----------------------- timer state ------------------------- */
let totalSeconds = minutes * 60;
let remaining    = totalSeconds;
let elapsed      = 0;            // seconds elapsed in this encounter
let ticking      = null;         // setInterval handle
let heartbeat    = null;         // heartbeat interval
let encounterId  = null;

const ENCOUNTER_KEY = 'mq_encounter_id';

/* ----------------------- render ------------------------------ */
function render() {
  const m = Math.floor(remaining / 60).toString().padStart(2, '0');
  const s = (remaining % 60).toString().padStart(2, '0');
  displayEl.textContent = `${m}:${s}`;
}
render();

/* ----------------------- engine ------------------------------ */
function startTicking() {
  stopTicking();
  ticking = setInterval(() => {
    remaining = Math.max(0, remaining - 1);
    elapsed   = Math.min(totalSeconds, elapsed + 1);
    render();

    if (remaining <= 0) {
      stopTicking();
      completeEncounter(true).catch(console.error);
    }
  }, 1000);
}

function stopTicking() {
  if (ticking) {
    clearInterval(ticking);
    ticking = null;
  }
}

function startHeartbeat() {
  stopHeartbeat();
  heartbeat = setInterval(() => {
    if (!encounterId) return;
    patchJSON(`/api/encounter/${encounterId}/heartbeat`, { elapsed })
      .catch(err => console.warn('heartbeat failed', err.message));
  }, 30_000);
}

function stopHeartbeat() {
  if (heartbeat) {
    clearInterval(heartbeat);
    heartbeat = null;
  }
}

/* ----------------------- API flows --------------------------- */
async function startEncounter() {
  // if we already started (e.g., page refresh), reuse stored id
  encounterId = localStorage.getItem(ENCOUNTER_KEY);

  if (!encounterId) {
    // You may have only name in URL; send whichever you have.
    const payload = {};
    if (monsterId)   payload.monsterId   = monsterId;
    if (monsterName) payload.monsterName = monsterName;

    if (!payload.monsterId && !payload.monsterName) {
      alert('Missing monsterId/monsterName in timer URL');
      return;
    }

    const data = await postJSON('/api/encounter/start', payload);
    encounterId = data.encounterId;
    localStorage.setItem(ENCOUNTER_KEY, encounterId);

    // If backend returns planned minutes, you can sync here:
    if (typeof data.plannedMinutes === 'number' && data.plannedMinutes > 0) {
      totalSeconds = data.plannedMinutes * 60;
      remaining = Math.max(remaining, totalSeconds); // keep current if larger
      render();
    }
  }

  startTicking();
  startHeartbeat();
}

async function pauseEncounter() {
  if (!encounterId) return;
  stopTicking();
  await patchJSON(`/api/encounter/${encounterId}/pause`, {});
}

async function resumeEncounter() {
  if (!encounterId) return;
  await patchJSON(`/api/encounter/${encounterId}/resume`, {});
  startTicking();
}

async function resetEncounter() {
  if (!encounterId) return;
  stopTicking();
  stopHeartbeat();
  try {
    await patchJSON(`/api/encounter/${encounterId}/reset`, {});
  } catch (e) {
    console.error(e);
  }
  localStorage.removeItem(ENCOUNTER_KEY);
  encounterId = null;
  elapsed   = 0;
  remaining = totalSeconds;
  render();
}

async function completeEncounter(win) {
  if (!encounterId) return;
  stopTicking();
  stopHeartbeat();
  try {
    await patchJSON(`/api/encounter/${encounterId}/complete`, { win: !!win });
  } catch (e) {
    console.error(e);
    alert('Failed to complete encounter');
    return;
  }
  localStorage.removeItem(ENCOUNTER_KEY);
  encounterId = null;
  alert(win ? 'Encounter completed! 🎉' : 'Session ended early.');
  window.location.href = '/home.html';
}

/* ----------------------- events ------------------------------ */
startBtn.addEventListener('click', async () => {
  try { await startEncounter(); }
  catch (e) {
    console.error(e);
    alert('Failed to start encounter');
  }
});

pauseBtn.addEventListener('click', async () => {
  try {
    if (ticking) {
      await pauseEncounter();
    } else {
      await resumeEncounter();
    }
  } catch (e) {
    console.error(e);
    alert('Failed to toggle pause');
  }
});

resetBtn.addEventListener('click', async () => {
  if (!confirm('Abandon this encounter and reset the timer?')) return;
  try { await resetEncounter(); }
  catch (e) {
    console.error(e);
    alert('Failed to reset');
  }
});

finishBtn.addEventListener('click', async () => {
  if (!confirm('Finish early?')) return;
  try { await completeEncounter(false); }
  catch (e) {
    console.error(e);
    alert('Failed to finish early');
  }
});

/* Try to persist last elapsed on unload (best-effort). */
window.addEventListener('beforeunload', () => {
  try {
    if (!encounterId) return;
    const payload = JSON.stringify({ elapsed });
    // best-effort beacon; okay if it fails
    navigator.sendBeacon?.(`/api/encounter/${encounterId}/heartbeat`, new Blob([payload], { type: 'application/json' }));
  } catch {}
});
