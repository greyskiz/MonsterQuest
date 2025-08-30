(function () {
  let secs = 0;
  let remaining = 0;
  let t = null;
  const clock = document.getElementById('clock');
  const mName = document.getElementById('mName');
  const mImg  = document.getElementById('mImg');
  const mMeta = document.getElementById('mMeta');
  const done  = document.getElementById('done');

  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const r = (s % 60).toString().padStart(2, '0');
    return `${m}:${r}`;
  }

  function render() { clock.textContent = fmt(remaining); }

  function tick() {
    if (remaining <= 0) {
      clearInterval(t); t = null;
      render();
      done.style.display = 'block';
      return;
    }
    remaining -= 1;
    render();
  }

  function start() {
    if (t) return;
    if (remaining <= 0) remaining = secs;
    t = setInterval(tick, 1000);
  }
  function pause() { if (t) { clearInterval(t); t = null; } }
  function reset() { pause(); remaining = secs; done.style.display = 'none'; render(); }
  function finishEarly() { remaining = 0; tick(); }

  // wire buttons
  document.getElementById('startBtn').addEventListener('click', start);
  document.getElementById('pauseBtn').addEventListener('click', pause);
  document.getElementById('resetBtn').addEventListener('click', reset);
  document.getElementById('finishBtn').addEventListener('click', finishEarly);

  // load monster chosen on Home
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      const res = await fetch('/api/users/user', { credentials: 'include' });
      if (!res.ok) throw new Error();
    } catch {
      return (window.location.href = '/login.html');
    }

    const raw = localStorage.getItem('currentMonster');
    if (!raw) return (window.location.href = '/home.html');

    const m = JSON.parse(raw);
    mName.textContent = m.name;
    mImg.src = m.imageUrl || '/assets/placeholder.png';
    mImg.onerror = () => (mImg.src = '/assets/placeholder.png');
    mMeta.textContent = `${m.minutes} minute session`;

    secs = (m.minutes || 25) * 60;
    remaining = secs;
    render();
  });
})();
