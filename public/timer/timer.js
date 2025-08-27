let durationMin = 0;
let remainingSec = 0;
let startedAt = null;
let timerId = null;
let currentMonster = null;

const msg = (t) => { document.getElementById('msg').textContent = t || ''; };
const fmt = (s) => {
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
};

async function fetchCurrentMonster() {
  const res = await fetch('/api/monsters/current');
  const data = await res.json();
  currentMonster = data.monster || null;
  const el = document.getElementById('current');
  if (currentMonster) {
    el.textContent = `Current Monster: ${currentMonster.name} (${currentMonster.hpRemainingMinutes}/${currentMonster.hpTotalMinutes} min)`;
  } else {
    el.textContent = 'No active monster. Ask an admin to activate one.';
  }
}

function bindButtons() {
  document.querySelectorAll('.tbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      durationMin = parseInt(btn.dataset.min, 10);
      remainingSec = durationMin * 60;
      document.getElementById('countdown').textContent = fmt(remainingSec);
      msg(`Selected ${durationMin} minutes.`);
    });
  });

  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');

  startBtn.addEventListener('click', async () => {
    if (!durationMin) return msg('Select a duration first.');
    if (!currentMonster) return msg('No active monster.');

    startedAt = new Date();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    msg('Timer started.');

    timerId = setInterval(async () => {
      remainingSec -= 1;
      document.getElementById('countdown').textContent = fmt(Math.max(remainingSec, 0));

      if (remainingSec <= 0) {
        clearInterval(timerId);
        await postSession(durationMin, startedAt, new Date(), currentMonster.id);
        msg('Session recorded. Great work.');
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    }, 1000);
  });

  stopBtn.addEventListener('click', () => {
    if (!timerId) return;
    clearInterval(timerId);
    document.getElementById('countdown').textContent = fmt(0);
    startBtn.disabled = false;
    stopBtn.disabled = true;
    msg('Timer stopped early (not recorded).');
  });
}

async function postSession(durationMin, startedAt, endedAt, monsterId) {
  const token = localStorage.getItem('token');
  if (!token) {
    msg('Not logged in.');
    window.location.href = '/login.html';
    return;
  }
  const res = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      monsterId,
      durationMin,
      startedAt,
      endedAt
    })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    msg(data.error || 'Failed to record session.');
    return;
  }
  const data = await res.json();
  currentMonster = data.monster;
  await fetchCurrentMonster();
}

window.addEventListener('DOMContentLoaded', async () => {
  if (!localStorage.getItem('token')) {
    window.location.href = '/login.html';
    return;
  }
  await fetchCurrentMonster();
  bindButtons();
});
