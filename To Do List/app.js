let events = JSON.parse(localStorage.getItem('agendaku-events') || '[]');
let notes = JSON.parse(localStorage.getItem('agendaku-notes') || '[]');
let trash = JSON.parse(localStorage.getItem('agendaku-trash') || '[]');
let selectedColor = 'blue';
let activePopupId = null;
let editingId = null;
let currentTab = 'weekly';

// Week offset from today
let weekOffset = 0;

const COLORS = {
  blue: { cls: 'ev-blue', hex: '#2563EB', bg: '#EFF6FF' },
  purple: { cls: 'ev-purple', hex: '#8B5CF6', bg: '#EDE9FE' },
  green: { cls: 'ev-green', hex: '#10B981', bg: '#D1FAE5' },
  amber: { cls: 'ev-amber', hex: '#F59E0B', bg: '#FEF3C7' },
  pink: { cls: 'ev-pink', hex: '#EC4899', bg: '#FCE7F3' },
  red: { cls: 'ev-red', hex: '#EF4444', bg: '#FEE2E2' },
};

function save() {
  localStorage.setItem('agendaku-events', JSON.stringify(events));
  localStorage.setItem('agendaku-notes', JSON.stringify(notes));
  localStorage.setItem('agendaku-trash', JSON.stringify(trash));
}

// ── Date helpers ─────────────────────────────────────────────────────────
function getWeekDates(offset = 0) {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - day + (offset * 7));
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function fmt(d) {
  return d.toISOString().split('T')[0];
}

function fmtLabel(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(d) {
  return fmt(d) === fmt(new Date());
}

function dayLabel(d) {
  return d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
}

// ── Hours ──────────────────────────────────────────────────────────────────
const HOURS = [];
for (let h = 7; h <= 21; h++) {
  HOURS.push(h);
}

// ── Build calendar ─────────────────────────────────────────────────────────
function buildCalendar() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  const days = getWeekDates(weekOffset);

  // Update labels
  const label = `${fmtLabel(days[0])} – ${fmtLabel(days[6])}, ${days[0].getFullYear()}`;
  document.getElementById('period-label').textContent = label;
  document.getElementById('week-sub').textContent =
    days[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) +
    ' – ' + days[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  // Header
  const hdr = document.createElement('div');
  hdr.className = 'cal-header';
  hdr.style.display = 'contents';

  const corner = document.createElement('div');
  corner.textContent = days[0].getFullYear();
  corner.style.cssText = 'font-size:11px;color:var(--muted-color);font-weight:600;';
  hdr.appendChild(corner);

  days.forEach(d => {
    const dh = document.createElement('div');
    dh.innerHTML = `<div>${dayLabel(d)}</div><div class="day-num">${d.getDate()}</div>`;
    if (isToday(d)) dh.classList.add('today');
    hdr.appendChild(dh);
  });
  grid.appendChild(hdr);

  // Time column + day columns
  HOURS.forEach(h => {
    // time
    const tc = document.createElement('div');
    tc.className = 'time-col';
    const ts = document.createElement('div');
    ts.className = 'time-slot';
    ts.textContent = `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? 'AM' : 'PM'}`;
    tc.appendChild(ts);
    grid.appendChild(tc);

    // cells for each day
    days.forEach(d => {
      const dc = document.createElement('div');
      dc.className = 'day-col';

      const cell = document.createElement('div');
      cell.className = 'cell';
      const dateStr = fmt(d);
      cell.onclick = () => {
        closePopup();
        openCreateModal(dateStr, `${String(h).padStart(2, '0')}:00`);
      };
      dc.appendChild(cell);

      // events for this day/hour
      const dayEvents = events.filter(ev => {
        if (ev.date !== dateStr) return false;
        const sh = parseInt(ev.start.split(':')[0]);
        return sh === h;
      });

      dayEvents.forEach(ev => {
        const sh = parseInt(ev.start.split(':')[0]);
        const sm = parseInt(ev.start.split(':')[1]);
        const eh = parseInt(ev.end.split(':')[0]);
        const em = parseInt(ev.end.split(':')[1]);
        const startMin = (sh - h) * 60 + sm;
        const durMin = (eh - sh) * 60 + (em - sm);
        const top = (startMin / 60) * 64;
        const height = Math.max((durMin / 60) * 64 - 2, 22);

        const el = document.createElement('div');
        el.className = `event ${COLORS[ev.color || 'blue'].cls}`;
        el.style.cssText = `top:${top}px;height:${height}px;`;
        el.innerHTML = `<div>${ev.title}</div><div class="ev-time">${ev.start} – ${ev.end}</div>`;
        el.onclick = (e) => { e.stopPropagation(); showPopup(ev.id, e); };
        dc.appendChild(el);
      });

      // Now line
      if (isToday(d) && weekOffset === 0) {
        const now = new Date();
        if (now.getHours() === h) {
          const nl = document.createElement('div');
          nl.className = 'now-line';
          nl.style.top = `${(now.getMinutes() / 60) * 64}px`;
          nl.innerHTML = '<div class="now-dot"></div>';
          dc.appendChild(nl);
        }
      }

      grid.appendChild(dc);
    });
  });
}

// ── Popup ──────────────────────────────────────────────────────────────────
function showPopup(id, e) {
  const ev = events.find(x => x.id === id);
  if (!ev) return;
  activePopupId = id;
  const popup = document.getElementById('ev-popup');
  document.getElementById('ep-title').textContent = ev.title;
  document.getElementById('ep-time').textContent = `${ev.date} · ${ev.start} – ${ev.end}`;
  const cat = document.getElementById('ep-cat');
  cat.textContent = ev.category || 'Event';
  cat.style.background = COLORS[ev.color || 'blue'].bg;
  cat.style.color = COLORS[ev.color || 'blue'].hex;
  document.getElementById('ep-notes').textContent = ev.notes || '';
  const btnComp = document.getElementById('ep-btn-complete');
  if (btnComp) {
    btnComp.textContent = ev.isCompleted ? 'Mark Pending' : 'Complete';
    btnComp.style.color = ev.isCompleted ? '#f59e0b' : '#10b981';
    btnComp.style.borderColor = ev.isCompleted ? '#f59e0b' : '#10b981';
  }
  // position
  const rect = e.target.getBoundingClientRect();
  popup.style.top = `${rect.bottom + 8}px`;
  popup.style.left = `${Math.min(rect.left, window.innerWidth - 260)}px`;
  popup.classList.add('open');
  e.stopPropagation();
}

function closePopup() {
  document.getElementById('ev-popup').classList.remove('open');
  activePopupId = null;
}

document.addEventListener('click', () => closePopup());
document.getElementById('ev-popup').addEventListener('click', e => e.stopPropagation());

function editEvent() {
  const ev = events.find(x => x.id === activePopupId);
  if (!ev) return;
  closePopup();
  editingId = ev.id;
  document.getElementById('ev-title').value = ev.title;
  document.getElementById('ev-date').value = ev.date;
  document.getElementById('ev-start').value = ev.start;
  document.getElementById('ev-end').value = ev.end;
  document.getElementById('ev-category').value = ev.category || 'blue';
  document.getElementById('ev-notes').value = ev.notes || '';
  pickColorByName(ev.color || 'blue');
  openModal('create-overlay');
}

function deleteEvent() {
  const ev = events.find(x => x.id === activePopupId);
  if (!ev) return;
  trash.push({ ...ev, deletedAt: new Date().toISOString() });
  events = events.filter(x => x.id !== activePopupId);
  save();
  closePopup();
  buildCalendar();
}

// ── Create/Edit modal ──────────────────────────────────────────────────────
function openCreateModal(dateStr, startTime) {
  editingId = null;
  document.getElementById('ev-title').value = '';
  document.getElementById('ev-date').value = dateStr || fmt(new Date());
  document.getElementById('ev-start').value = startTime || '09:00';
  document.getElementById('ev-end').value = startTime ? `${String(parseInt(startTime) + 1).padStart(2, '0')}:00` : '10:00';
  document.getElementById('ev-notes').value = '';
  document.getElementById('ev-category').value = 'blue';
  pickColorByName('blue');
  openModal('create-overlay');
}

function saveEvent() {
  const title = document.getElementById('ev-title').value.trim();
  const date = document.getElementById('ev-date').value;
  const start = document.getElementById('ev-start').value;
  const end = document.getElementById('ev-end').value;
  const cat = document.getElementById('ev-category').value;
  const notes = document.getElementById('ev-notes').value.trim();

  if (!title) { document.getElementById('ev-title').focus(); return; }
  if (!date) { document.getElementById('ev-date').focus(); return; }

  if (editingId) {
    const ev = events.find(x => x.id === editingId);
    if (ev) { ev.title = title; ev.date = date; ev.start = start; ev.end = end; ev.category = cat; ev.color = selectedColor; ev.notes = notes; }
    editingId = null;
  } else {
    events.push({ id: Date.now().toString(), title, date, start, end, category: cat, color: selectedColor, notes });
  }

  save();
  closeModal('create-overlay');
  buildCalendar();
}

// ── Color picker ───────────────────────────────────────────────────────────
function pickColor(el, color) {
  document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
  el.classList.add('selected');
  selectedColor = color;
}

function pickColorByName(color) {
  document.querySelectorAll('.color-swatch').forEach(s => {
    s.classList.toggle('selected', s.dataset.c === color);
  });
  selectedColor = color;
}

// ── Modals ─────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  editingId = null;
}
function closeIfBg(e, id) {
  if (e.target === document.getElementById(id)) closeModal(id);
}

// ── Navigation ─────────────────────────────────────────────────────────────
function prevWeek() { weekOffset--; buildCalendar(); }
function nextWeek() { weekOffset++; buildCalendar(); }
function goToday() { weekOffset = 0; buildCalendar(); }

// ── Tabs ───────────────────────────────────────────────────────────────────
function setTab(tab, el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentTab = tab;
  if (tab === 'monthly') buildMonthly();
  else if (tab === 'yearly') buildYearly();
  else buildCalendar();
}

function buildMonthly() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(7, 1fr)';

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  DAY_NAMES.forEach(d => {
    const h = document.createElement('div');
    h.style.cssText = 'padding:8px;text-align:center;font-size:12px;font-weight:700;color:var(--muted-color);border-bottom:1px solid var(--border-color);border-right:1px solid var(--border-color);background:var(--bg-card);position:sticky;top:0;z-index:2;';
    h.textContent = d;
    grid.appendChild(h);
  });

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement('div');
    empty.style.cssText = 'border-right:1px solid var(--border-color);border-bottom:1px solid var(--border-color);min-height:80px;background:var(--bg-main);';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const isT = dateStr === fmt(new Date());
    cell.style.cssText = 'border-right:1px solid var(--border-color);border-bottom:1px solid var(--border-color);min-height:80px;padding:10px;cursor:pointer;transition:background .12s;';
    cell.onmouseenter = () => cell.style.background = 'var(--secondary-color)';
    cell.onmouseleave = () => cell.style.background = '';
    cell.onclick = () => openCreateModal(dateStr);

    const num = document.createElement('div');
    num.textContent = d;
    num.style.cssText = `font-size:13px;font-weight:700;margin-bottom:4px;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;${isT ? 'background:var(--primary-color);color:var(--text-on-primary);' : ''}`;
    cell.appendChild(num);

    const dayEvs = events.filter(e => e.date === dateStr).slice(0, 2);
    dayEvs.forEach(ev => {
      const dot = document.createElement('div');
      dot.style.cssText = `font-size:10.5px;font-weight:600;padding:1px 5px;border-radius:4px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;background:${COLORS[ev.color || 'blue'].bg};color:${COLORS[ev.color || 'blue'].hex};`;
      dot.textContent = ev.title;
      cell.appendChild(dot);
    });

    const extra = events.filter(e => e.date === dateStr).length - 2;
    if (extra > 0) {
      const more = document.createElement('div');
      more.textContent = `+${extra} more`;
      more.style.cssText = 'font-size:10px;color:var(--muted-color);';
      cell.appendChild(more);
    }

    grid.appendChild(cell);
  }
}

function buildYearly() {
  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

  const year = new Date().getFullYear();
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  MONTHS.forEach((m, mi) => {
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid var(--border-color);border-radius:8px;padding:12px;margin:8px;cursor:pointer;transition:background .12s;';
    card.onmouseenter = () => card.style.background = 'var(--secondary-color)';
    card.onmouseleave = () => card.style.background = '';
    card.onclick = () => { setTab('monthly', document.querySelector('.tab')); };

    const count = events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === mi;
    }).length;

    card.innerHTML = `<div style="font-weight:700;margin-bottom:6px;">${m} ${year}</div>
      <div style="font-size:12px;color:var(--muted-color);">${count} event${count !== 1 ? 's' : ''}</div>
      ${count > 0 ? `<div style="margin-top:6px;height:4px;background:var(--primary-color);border-radius:2px;width:${Math.min(count * 20, 100)}%;"></div>` : ''}`;
    grid.appendChild(card);
  });
}

// ── Export ─────────────────────────────────────────────────────────────────
function exportSchedules() {
  if (!events.length) { alert('No schedules to export.'); return; }
  const lines = ['Title,Date,Start,End,Category,Color,Notes'];
  events.forEach(e => lines.push([e.title, e.date, e.start, e.end, e.category || '', e.color || '', e.notes || ''].map(v => `"${v}"`).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'schedules.csv';
  a.click();
}

// ── Deleted ────────────────────────────────────────────────────────────────
function showDeleted() {
  if (!trash.length) { alert('No deleted schedules.'); return; }
  const msg = trash.map(e => `• ${e.title} (${e.date})`).join('\n');
  if (confirm(`Deleted schedules:\n${msg}\n\nRestore all?`)) {
    events.push(...trash.map(e => { const { deletedAt, ...rest } = e; return rest; }));
    trash = [];
    save();
    buildCalendar();
  }
}

// ── Views ──────────────────────────────────────────────────────────────────
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => {
    sec.style.display = "none";
  });
  const currentSection = document.getElementById(sectionId);
  if (currentSection) {
    currentSection.style.display = sectionId === 'dashboard-section' ? 'block' : 'flex';
  }

  const view = sectionId.split('-')[0];
  const titles = { 'calendar': 'My Calendar', 'notes': 'My Notes', 'dashboard': 'Dashboard' };
  document.getElementById('topbar-title').textContent = titles[view] || 'App';

  document.querySelectorAll('.nav-section .nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.getElementById('nav-' + view);
  if (activeNav) activeNav.classList.add('active');

  document.getElementById('view-tabs').style.display = view === 'calendar' ? 'flex' : 'none';

  if (view === 'notes') renderNotes();
  if (view === 'dashboard') renderDashboard();
}

// ── Notes ──────────────────────────────────────────────────────────────────
function openNoteModal() { openModal('note-overlay'); }

function saveNote() {
  const title = document.getElementById('note-title-input').value.trim();
  const body = document.getElementById('note-body-input').value.trim();
  if (!title) { document.getElementById('note-title-input').focus(); return; }
  notes.unshift({ id: Date.now().toString(), title, body, created: new Date().toISOString() });
  save();
  closeModal('note-overlay');
  document.getElementById('note-title-input').value = '';
  document.getElementById('note-body-input').value = '';
  renderNotes();
}

function renderNotes() {
  const list = document.getElementById('notes-list');
  if (!notes.length) {
    list.innerHTML = '<div style="text-align:center;color:var(--muted-color);padding:40px;font-size:14px;">No notes yet. Create your first one!</div>';
    return;
  }
  list.innerHTML = notes.map(n => `
    <div class="note-item">
      <div class="note-header">
        <div class="note-title">${escHtml(n.title)}</div>
        <button class="note-del" onclick="deleteNote('${n.id}')">×</button>
      </div>
      <div class="note-body">${escHtml(n.body)}</div>
      <div class="note-date">${new Date(n.created).toLocaleString()}</div>
    </div>
  `).join('');
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  save();
  renderNotes();
}

function escHtml(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Init ───────────────────────────────────────────────────────────────────
buildCalendar();

// Refresh now-line every minute
setInterval(() => { if (weekOffset === 0) buildCalendar(); }, 60000);

// ── Auth ───────────────────────────────────────────────────────────────────
let users = JSON.parse(localStorage.getItem('agendaku-users') || '[]');
if (users.length === 0) {
  users.push({ name: "Sujal", email: "test@gmail.com", password: "1111" });
  localStorage.setItem('agendaku-users', JSON.stringify(users));
}

// Convert legacy auth
if (localStorage.getItem('agendaku-auth') === 'true' && !localStorage.getItem('user')) {
  localStorage.setItem('user', JSON.stringify({ name: "Sujal", email: "sujalbpatil21@gmail.com", password: "1111" }));
  localStorage.removeItem('agendaku-auth');
}

let currentUser = JSON.parse(localStorage.getItem('user') || 'null');

function toggleAuth(view) {
  document.getElementById('login-form-container').style.display = view === 'login' ? 'block' : 'none';
  document.getElementById('register-form-container').style.display = view === 'register' ? 'block' : 'none';
}

function loadUserUI() {
  if (!currentUser) return;

  const welcomeText = document.getElementById('user-welcome-text');
  if (welcomeText) welcomeText.textContent = 'Welcome, ' + currentUser.name;

  const avatar = document.getElementById('user-avatar');
  if (avatar) {
    avatar.textContent = currentUser.name.charAt(0).toUpperCase();
    avatar.title = currentUser.name;
  }

  const sidebarName = document.getElementById('sidebar-user-name');
  if (sidebarName) sidebarName.textContent = currentUser.name;
}

function checkAuth() {
  if (currentUser) {
    showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('app-view').style.display = 'none';
  document.getElementById('login-view').style.display = 'flex';
  toggleAuth('login');
}

function showApp() {
  document.getElementById('login-view').style.display = 'none';
  document.getElementById('app-view').style.display = 'flex';
  loadUserUI();
}

function validateLogin(email, password) {
  let valid = true;
  const emailErr = document.getElementById('login-email-error');
  const passErr = document.getElementById('login-password-error');
  const genErr = document.getElementById('login-general-error');

  emailErr.classList.remove('visible');
  passErr.classList.remove('visible');
  genErr.classList.remove('visible');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailErr.textContent = 'Please enter a valid email address';
    emailErr.classList.add('visible');
    valid = false;
  }
  if (!password) {
    passErr.textContent = 'Password is required';
    passErr.classList.add('visible');
    valid = false;
  }
  return valid;
}

function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass = document.getElementById('login-password').value;

  if (!validateLogin(email, pass)) return;

  const user = users.find(u => u.email === email && u.password === pass);
  if (user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    showApp();
  } else {
    const genErr = document.getElementById('login-general-error');
    genErr.textContent = 'Invalid email or password';
    genErr.classList.add('visible');
  }
}

function validateRegister(name, email, pass, confirm) {
  let valid = true;
  const nameErr = document.getElementById('reg-name-error');
  const emailErr = document.getElementById('reg-email-error');
  const passErr = document.getElementById('reg-password-error');
  const confirmErr = document.getElementById('reg-confirm-error');
  const genErr = document.getElementById('reg-general-error');

  [nameErr, emailErr, passErr, confirmErr, genErr].forEach(e => e.classList.remove('visible'));

  if (!name) { nameErr.textContent = 'Name is required'; nameErr.classList.add('visible'); valid = false; }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) { emailErr.textContent = 'Valid email is required'; emailErr.classList.add('visible'); valid = false; }

  if (pass.length < 4) { passErr.textContent = 'Password min 4 characters'; passErr.classList.add('visible'); valid = false; }

  if (pass !== confirm) { confirmErr.textContent = 'Passwords do not match'; confirmErr.classList.add('visible'); valid = false; }

  return valid;
}

function handleRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pass = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (!validateRegister(name, email, pass, confirm)) return;

  const exists = users.find(u => u.email === email);
  if (exists) {
    const genErr = document.getElementById('reg-general-error');
    genErr.textContent = 'Email already exists';
    genErr.classList.add('visible');
    return;
  }

  users.push({ name, email, password: pass });
  localStorage.setItem('agendaku-users', JSON.stringify(users));

  document.getElementById('reg-name').value = '';
  document.getElementById('reg-email').value = '';
  document.getElementById('reg-password').value = '';
  document.getElementById('reg-confirm').value = '';

  toggleAuth('login');
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  document.getElementById('login-email').value = '';
  document.getElementById('login-password').value = '';
  showLogin();
}

checkAuth();

// ── Dashboard Logic ────────────────────────────────────────────────────────
function getTaskStats() {
  const now = new Date();
  let total = events.length;
  let completed = 0;
  let pending = 0;
  let overdue = 0;

  events.forEach(ev => {
    if (ev.isCompleted) {
      completed++;
    } else {
      pending++;
      const deadlineStr = ev.date + 'T' + ev.end;
      const deadline = new Date(deadlineStr);
      if (deadline < now) {
        overdue++;
      }
    }
  });

  return { total, completed, pending, overdue };
}

function renderDashboard() {
  const stats = getTaskStats();
  document.getElementById('dash-total').textContent = stats.total;
  document.getElementById('dash-completed').textContent = stats.completed;
  document.getElementById('dash-pending').textContent = stats.pending;
  document.getElementById('dash-overdue').textContent = stats.overdue;

  // Recent Activity (last 5 added events)
  const recentList = document.getElementById('dash-recent');
  const recentEvents = [...events].reverse().slice(0, 5); // Assuming newly added are at the end

  if (recentEvents.length === 0) {
    recentList.innerHTML = '<div style="color:var(--muted-color); font-size:14px;">No recent tasks found.</div>';
    return;
  }

  recentList.innerHTML = recentEvents.map(ev => {
    return `
      <div style="background: var(--bg-card); padding: 14px; border-radius: 10px; border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: var(--cat-${ev.color || 'blue'});"></div>
          <div>
            <div style="font-weight: 600; font-size: 14px; color: var(--text-color); text-decoration: ${ev.isCompleted ? 'line-through' : 'none'}; opacity: ${ev.isCompleted ? 0.6 : 1};">${escHtml(ev.title)}</div>
            <div style="font-size: 12px; color: var(--muted-color); margin-top: 4px;">Deadline: ${ev.date} at ${ev.end}</div>
          </div>
        </div>
        <div style="font-size: 12px; font-weight: 600; padding: 4px 8px; border-radius: 4px; background: ${ev.isCompleted ? '#d1fae5' : '#fef3c7'}; color: ${ev.isCompleted ? '#065f46' : '#92400e'};">
          ${ev.isCompleted ? 'Completed' : 'Pending'}
        </div>
      </div>
    `;
  }).join('');
}

function toggleEventComplete() {
  const ev = events.find(x => x.id === activePopupId);
  if (ev) {
    ev.isCompleted = !ev.isCompleted;
    save();
    closePopup();
    buildCalendar();
    if (document.getElementById('dashboard-section').style.display === 'block') {
      renderDashboard();
    }
  }
}
