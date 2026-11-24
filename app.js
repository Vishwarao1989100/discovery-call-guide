(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'dcg-state-v1';
  let st = { type: 'prep', done: {}, notes: {}, theme: null };
  try { Object.assign(st, JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch (e) {} };
  let cur = 0, live = false;

  function applyTheme() {
    const t = st.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = t;
  }

  function render() {
    const list = window.QUESTIONS[st.type];
    $('t-prep').classList.toggle('on', st.type === 'prep');
    $('t-switch').classList.toggle('on', st.type === 'switchup');
    $('questions').innerHTML = '';
    list.forEach(([q, hint], i) => {
      const k = st.type + i;
      const d = document.createElement('div');
      d.className = 'q' + (st.done[k] ? ' done' : '') + (i === cur ? ' cur' : '');
      d.innerHTML = `<label><input type="checkbox" ${st.done[k] ? 'checked' : ''}><span>${i + 1}. ${q}</span></label><small>${hint}</small><textarea placeholder="Notes"></textarea>`;
      const ta = d.querySelector('textarea');
      ta.value = st.notes[k] || '';
      ta.oninput = () => { st.notes[k] = ta.value; save(); };
      d.querySelector('input').onchange = e => { st.done[k] = e.target.checked; save(); render(); };
      $('questions').appendChild(d);
    });
    const n = list.filter((_, i) => st.done[st.type + i]).length;
    $('progress').textContent = n + ' / 7';
    $('fill').style.width = (n / 7 * 100) + '%';
  }

  $('t-prep').onclick = () => { st.type = 'prep'; cur = 0; save(); render(); };
  $('t-switch').onclick = () => { st.type = 'switchup'; cur = 0; save(); render(); };
  $('theme').onclick = () => { st.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; save(); applyTheme(); };
  $('live').onclick = () => { live = !live; $('app').classList.toggle('live', live); $('live').classList.toggle('on', live); $('livenav').hidden = !live; render(); };
  $('prev').onclick = () => { cur = Math.max(0, cur - 1); render(); };
  $('next').onclick = () => { cur = Math.min(6, cur + 1); render(); };
  $('new').onclick = () => { if (confirm('Clear ticks, notes and timer?')) { st.done = {}; st.notes = {}; cur = 0; save(); reset(); render(); } };
  $('copy').onclick = async () => {
    const txt = window.QUESTIONS[st.type].map(([q], i) => {
      const k = st.type + i;
      return `${st.done[k] ? '[x]' : '[ ]'} ${i + 1}. ${q}\n${st.notes[k] || ''}`;
    }).join('\n\n');
    try { await navigator.clipboard.writeText(txt); $('copy').textContent = 'Copied'; }
    catch (e) { $('copy').textContent = 'Copy failed'; }
    setTimeout(() => $('copy').textContent = 'Copy notes', 1500);
  };

  let secs = 0, iv = null;
  const show = () => $('timer').textContent = String(Math.floor(secs / 60)).padStart(2, '0') + ':' + String(secs % 60).padStart(2, '0');
  function reset() { clearInterval(iv); iv = null; secs = 0; $('tstart').textContent = '▶'; show(); }
  $('tstart').onclick = () => {
    if (iv) { clearInterval(iv); iv = null; $('tstart').textContent = '▶'; }
    else { iv = setInterval(() => { secs++; show(); }, 1000); $('tstart').textContent = '⏸'; }
  };
  $('treset').onclick = reset;

  applyTheme(); render();
})();
