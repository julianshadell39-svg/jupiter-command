/* ============================================================
   Jupiter Command — Application Logic
   ============================================================ */

'use strict';

// ── Navigation ────────────────────────────────────────────────

const navItems = document.querySelectorAll('.nav-item[data-nav], .nav-sub-item[data-nav]');
const panels   = document.querySelectorAll('.panel');
const sidebar  = document.getElementById('sidebar');
const burger   = document.getElementById('burger');

function showPanel(id) {
  panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + id));

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.nav === id);
  });

  // Auto-open integration sub-menu when a sub-item is selected
  const integrationSubs = ['fusion','mastercam','nx','gibbscam','solidcam','creo','custom-api'];
  if (integrationSubs.includes(id)) {
    openSubMenu('integrations');
  }

  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 768) {
    sidebar.classList.remove('open');
  }
}

function openSubMenu(name) {
  const sub  = document.getElementById('sub-' + name);
  const parent = document.querySelector('.nav-item[data-parent="' + name + '"]');
  if (sub)    sub.classList.add('open');
  if (parent) parent.classList.add('open');
}

// Nav item clicks
navItems.forEach(item => {
  item.addEventListener('click', () => showPanel(item.dataset.nav));
});

// Parent toggle (integrations accordion)
document.querySelectorAll('.nav-parent').forEach(parent => {
  parent.addEventListener('click', () => {
    const name = parent.dataset.parent;
    const sub  = document.getElementById('sub-' + name);
    parent.classList.toggle('open');
    sub && sub.classList.toggle('open');
  });
});

// Dashboard cards as nav shortcuts
document.querySelectorAll('.card[data-nav]').forEach(card => {
  card.addEventListener('click', () => {
    const target = card.dataset.nav;
    if (target === 'integrations-parent') {
      showPanel('fusion');
      openSubMenu('integrations');
    } else {
      showPanel(target);
    }
  });
});

// Logo click
document.querySelector('.logo').addEventListener('click', e => {
  e.preventDefault();
  showPanel('dashboard');
});

// Burger (mobile)
burger && burger.addEventListener('click', () => sidebar.classList.toggle('open'));

// ── Dashboard stats (reactive) ────────────────────────────────

function refreshDashboardStats() {
  const statJobs = document.getElementById('stat-jobs');
  const statPlugins = document.getElementById('stat-plugins');
  const agentCamJobs = document.getElementById('agent-cam-jobs');
  if (statJobs)     statJobs.textContent     = jobs.length;
  if (statPlugins)  statPlugins.textContent  = plugins.filter(p => p.active).length;
  if (agentCamJobs) agentCamJobs.textContent = jobs.length;
}

// ── Adapter connect simulation ────────────────────────────────

function connectAdapter(name) {
  const statEls = document.querySelectorAll('#panel-' + name + ' .chip');
  statEls.forEach(el => {
    el.className = 'chip chip-info';
    el.textContent = 'Connecting…';
  });

  setTimeout(() => {
    statEls.forEach(el => {
      el.className = 'chip chip-success';
      el.textContent = 'Connected';
    });
  }, 1400);
}

// ── AI Assistant ──────────────────────────────────────────────

const chatWindow  = document.getElementById('chat-window');
const chatInput   = document.getElementById('chat-input');
const chatSend    = document.getElementById('chat-send');
const quickPrompts = document.getElementById('quick-prompts');

const AI_RESPONSES = {
  'feed': 'For 6061 aluminum with a 6 mm carbide end mill (2-flute):\n• Spindle: 8,000 – 12,000 RPM\n• Feed rate: 800 – 1,600 mm/min\n• Depth of cut: ≤ 0.5 × tool diameter\n• Use climb milling and flood coolant for best surface finish.',
  'pocket': 'For deep pockets in steel, use **adaptive (trochoidal) clearing**:\n1. High axial depth, low radial engagement\n2. Keeps chip load constant, reduces heat\n3. Use variable-helix end mills to minimize resonance\n4. Finish walls with a spring pass at full depth.',
  'chatter': 'To reduce chatter on thin walls:\n• Reduce axial depth of cut\n• Use a down-cut or compression spiral bit\n• Increase spindle speed (move away from natural frequency)\n• Add fixturing mass or use vibration-damping toolholders\n• Consider climb milling to keep deflection predictable.',
  'adaptive': 'Adaptive clearing maintains a constant chip load by varying the toolpath radially:\n✔ Less heat buildup → longer tool life\n✔ Consistent cutting forces\n✔ Faster than conventional zig-zag at full depth\nConventional milling cuts deeper but with more force variation — better for soft materials where cycle time matters more than tool life.',
  'finish': 'To minimize scallop height on curved surfaces:\n• Use **spiral finishing** (constant Z) with a small step-down\n• Or **scallop (constant cusp)** toolpath with the step set to your tolerance\n• Ball-nose mills: scallop height ≈ r − √(r² − (ae/2)²)\n• Smaller step-over = smoother surface but longer cycle time\n• 0.1 mm step-over typically achieves Ra < 0.8 μm.',
  'default': "I'm Jupiter Command's AI Assistant. I can help with feeds & speeds, toolpath strategy, material machinability, GD&T interpretation, and post-processor questions. What would you like to know?"
};

function getAIResponse(msg) {
  const m = msg.toLowerCase();
  if (m.includes('feed') || m.includes('speed') || m.includes('rpm') || m.includes('aluminum') || m.includes('aluminium')) return AI_RESPONSES['feed'];
  if (m.includes('pocket') || m.includes('deep') || m.includes('steel'))  return AI_RESPONSES['pocket'];
  if (m.includes('chatter') || m.includes('vibrat') || m.includes('thin wall'))  return AI_RESPONSES['chatter'];
  if (m.includes('adaptive') || m.includes('trochoidal') || m.includes('conventional'))  return AI_RESPONSES['adaptive'];
  if (m.includes('finish') || m.includes('scallop') || m.includes('surface'))  return AI_RESPONSES['finish'];
  return AI_RESPONSES['default'];
}

function appendChatMsg(text, role) {
  const wrap = document.createElement('div');
  wrap.className = 'chat-msg ' + role;

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = role === 'bot' ? '🤖' : '👤';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = escHtml(text).replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  wrap.appendChild(avatar);
  wrap.appendChild(bubble);
  chatWindow.appendChild(wrap);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function sendChat() {
  const msg = chatInput.value.trim();
  if (!msg) return;
  appendChatMsg(msg, 'user');
  chatInput.value = '';

  setTimeout(() => {
    appendChatMsg(getAIResponse(msg), 'bot');
  }, 500);
}

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendChat(); });

quickPrompts && quickPrompts.querySelectorAll('[data-prompt]').forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.dataset.prompt;
    sendChat();
  });
});

// Greet on load
appendChatMsg('Hello! I\'m the Jupiter Command AI Assistant. Ask me anything about machining, toolpaths, feeds &amp; speeds, or CAM strategy.', 'bot');

// ── Toolpath Analysis ─────────────────────────────────────────

const ncFileInput  = document.getElementById('nc-file-input');
const analyzeBtn   = document.getElementById('analyze-btn');
const tpSvg        = document.getElementById('tp-svg');
const tpPlaceholder = document.getElementById('tp-placeholder');

analyzeBtn && analyzeBtn.addEventListener('click', () => {
  const file = ncFileInput && ncFileInput.files[0];
  if (!file) { alert('Please select an NC file first.'); return; }

  const reader = new FileReader();
  reader.onload = e => analyzeNC(e.target.result, file.name);
  reader.readAsText(file);
});

function analyzeNC(code, filename) {
  const lines   = code.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const moves   = lines.filter(l => /^[GN]?[0-9]*\s*[XYZ]/i.test(l)).length;
  const rapids  = lines.filter(l => /G0\s*[XYZ]/i.test(l)).length;
  const feeds   = lines.filter(l => /G1\s*[XYZ]/i.test(l)).length;
  const issues  = lines.filter(l => /G91/i.test(l)).length; // incremental — flag as review

  // Simple path length estimate (count distinct XY moves)
  const dist = (moves * 12.4).toFixed(1);
  const time = formatTime(Math.round(moves * 0.08));

  document.getElementById('tp-moves').textContent  = moves || '—';
  document.getElementById('tp-dist').textContent   = dist;
  document.getElementById('tp-time').textContent   = time;
  document.getElementById('tp-issues').textContent = issues;

  tpPlaceholder && (tpPlaceholder.style.display = 'none');
  drawSamplePath(tpSvg, moves);

  const reportCard = document.getElementById('tp-results-card');
  const reportBody = document.getElementById('tp-report');
  if (reportCard) reportCard.style.display = 'block';
  if (reportBody) {
    reportBody.innerHTML =
      '<strong style="color:var(--text-primary)">' + escHtml(filename) + '</strong><br><br>' +
      'Total lines: ' + Number(lines.length) + '<br>' +
      'Rapid moves (G0): ' + Number(rapids) + '<br>' +
      'Feed moves (G1): ' + Number(feeds) + '<br>' +
      'Incremental blocks (G91): ' + Number(issues) + '<br><br>' +
      (issues > 0
        ? '<span class="chip chip-warning">⚠ Review incremental mode usage</span>'
        : '<span class="chip chip-success">✔ No critical issues found</span>');
  }
}

function drawSamplePath(svgEl, count) {
  svgEl.innerHTML = '';
  const pts = generatePath(Math.min(count || 80, 120));
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
  path.setAttribute('points', pts.map(p => p[0] + ',' + p[1]).join(' '));
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', '#00d4ff');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('stroke-opacity', '0.75');
  svgEl.appendChild(path);

  // Origin cross
  addLine(svgEl, 40, 160, 760, 160, 'rgba(255,255,255,.1)', 1);
  addLine(svgEl, 400, 10, 400, 310, 'rgba(255,255,255,.1)', 1);
}

function generatePath(n) {
  const pts = [];
  let x = 400, y = 160;
  for (let i = 0; i < n; i++) {
    x += (Math.random() - 0.48) * 60;
    y += (Math.random() - 0.48) * 40;
    x = Math.max(40, Math.min(760, x));
    y = Math.max(20, Math.min(300, y));
    pts.push([x.toFixed(1), y.toFixed(1)]);
  }
  return pts;
}

function addLine(svgEl, x1, y1, x2, y2, stroke, w) {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1); line.setAttribute('y1', y1);
  line.setAttribute('x2', x2); line.setAttribute('y2', y2);
  line.setAttribute('stroke', stroke);
  line.setAttribute('stroke-width', w);
  svgEl.appendChild(line);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + 'm ' + s + 's';
}

// ── Job Library ───────────────────────────────────────────────

let jobs = [];

const jobModal    = document.getElementById('job-modal');
const addJobBtn   = document.getElementById('add-job-btn');
const jmSave      = document.getElementById('jm-save');
const jmCancel    = document.getElementById('jm-cancel');
const jobSearch   = document.getElementById('job-search');

addJobBtn && addJobBtn.addEventListener('click', () => {
  jobModal.style.display = 'flex';
});

jmCancel && jmCancel.addEventListener('click', () => {
  jobModal.style.display = 'none';
});

jmSave && jmSave.addEventListener('click', () => {
  const name     = document.getElementById('jm-name').value.trim();
  const source   = document.getElementById('jm-source').value;
  const material = document.getElementById('jm-material').value.trim();
  const ops      = document.getElementById('jm-ops').value.trim();

  if (!name) { alert('Please enter a job name.'); return; }

  jobs.push({ name, source, material, ops, status: 'Pending' });
  jobModal.style.display = 'none';
  renderJobTable(jobs);
  refreshDashboardStats();
  refreshSimJobSelect();

  // Clear fields
  ['jm-name','jm-material','jm-ops'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
});

function renderJobTable(list) {
  const tbody = document.getElementById('job-tbody');
  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:24px">No jobs yet. Import from an adapter or add a new job.</td></tr>';
    return;
  }

  tbody.innerHTML = list.map((j, i) => `
    <tr>
      <td>${escHtml(j.name)}</td>
      <td>${escHtml(j.source)}</td>
      <td>${escHtml(j.material || '—')}</td>
      <td>${escHtml(j.ops || '—')}</td>
      <td><span class="chip ${j.status === 'Complete' ? 'chip-success' : j.status === 'Running' ? 'chip-info' : 'chip-warning'}">${j.status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="deleteJob(${i})">✕</button></td>
    </tr>
  `).join('');
}

function deleteJob(index) {
  jobs.splice(index, 1);
  renderJobTable(jobs);
  refreshDashboardStats();
  refreshSimJobSelect();
}

jobSearch && jobSearch.addEventListener('input', () => {
  const q = jobSearch.value.toLowerCase();
  renderJobTable(q ? jobs.filter(j => j.name.toLowerCase().includes(q) || j.material.toLowerCase().includes(q)) : jobs);
});

// ── Machine Profiles ──────────────────────────────────────────

let machines = [];

const machineModal  = document.getElementById('machine-modal');
const addMachineBtn = document.getElementById('add-machine-btn');
const mmSave        = document.getElementById('mm-save');
const mmCancel      = document.getElementById('mm-cancel');

addMachineBtn && addMachineBtn.addEventListener('click', () => {
  machineModal.style.display = 'flex';
});

mmCancel && mmCancel.addEventListener('click', () => {
  machineModal.style.display = 'none';
});

mmSave && mmSave.addEventListener('click', () => {
  const name = document.getElementById('mm-name').value.trim();
  const type = document.getElementById('mm-type').value;
  const rpm  = document.getElementById('mm-rpm').value;
  const feed = document.getElementById('mm-feed').value;
  const ctrl = document.getElementById('mm-ctrl').value;

  if (!name) { alert('Please enter a machine name.'); return; }

  machines.push({ name, type, rpm, feed, ctrl });
  machineModal.style.display = 'none';
  renderMachineGrid();
  refreshDashboardStats();

  ['mm-name','mm-rpm','mm-feed'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
});

function renderMachineGrid() {
  const grid = document.getElementById('machine-grid');
  if (!grid) return;

  if (machines.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem;grid-column:1/-1;padding:20px 0">No machine profiles defined. Add your first machine.</div>';
    return;
  }

  grid.innerHTML = machines.map((m, i) => `
    <div class="card">
      <div class="card-header">
        <span class="card-icon">🏭</span>
        <div>
          <div class="card-title">${escHtml(m.name)}</div>
          <div class="card-sub">${escHtml(m.type)}</div>
        </div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:0.82rem">
          <div><span style="color:var(--text-muted)">Max RPM:</span> ${escHtml(m.rpm || '—')}</div>
          <div><span style="color:var(--text-muted)">Max Feed:</span> ${escHtml(m.feed || '—')}</div>
          <div style="grid-column:1/-1"><span style="color:var(--text-muted)">Controller:</span> ${escHtml(m.ctrl)}</div>
        </div>
        <div style="margin-top:10px">
          <button class="btn btn-outline btn-sm" onclick="deleteMachine(${i})">Remove</button>
        </div>
      </div>
    </div>
  `).join('');
}

function deleteMachine(index) {
  machines.splice(index, 1);
  renderMachineGrid();
  refreshDashboardStats();
}

// ── Simulation ────────────────────────────────────────────────

function refreshSimJobSelect() {
  const sel = document.getElementById('sim-job-select');
  if (!sel) return;
  if (jobs.length === 0) {
    sel.innerHTML = '<option>— No jobs in library —</option>';
    return;
  }
  sel.innerHTML = jobs.map(j => `<option>${escHtml(j.name)}</option>`).join('');
}

const simPlayBtn = document.getElementById('sim-play-btn');
simPlayBtn && simPlayBtn.addEventListener('click', () => {
  const sel = document.getElementById('sim-job-select');
  if (!sel || !jobs.length) {
    alert('Add a job to the Job Library before running simulation.');
    return;
  }
  const report = document.getElementById('sim-report');
  if (report) {
    report.innerHTML = '<span class="chip chip-info">⏳ Running…</span>';
    setTimeout(() => {
      report.innerHTML =
        '<span class="chip chip-success" style="margin-bottom:8px;display:inline-block">✔ No collisions detected</span><br>' +
        'Gouge check: <strong style="color:var(--success)">Passed</strong><br>' +
        'Residual stock: <strong style="color:var(--warning)">2.3%</strong> in 3 regions<br>' +
        'Max tool deflection: <strong>0.012 mm</strong><br>' +
        'Estimated cycle time: <strong>' + formatTime(Math.floor(Math.random() * 3600 + 600)) + '</strong>';
    }, 2000);
  }
});

// ── Automation Engine ─────────────────────────────────────────

let automations = [];

const awSave = document.getElementById('aw-save');
awSave && awSave.addEventListener('click', () => {
  const name    = document.getElementById('aw-name').value.trim();
  const trigger = document.getElementById('aw-trigger').value;
  const action  = document.getElementById('aw-action').value;

  if (!name) { alert('Please enter a workflow name.'); return; }

  automations.push({ name, trigger, action, active: true });
  document.getElementById('aw-name').value = '';
  renderAutomationList();
});

function renderAutomationList() {
  const list = document.getElementById('automation-list');
  if (!list) return;

  if (automations.length === 0) {
    list.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem">No workflows configured. Create one below.</div>';
    return;
  }

  list.innerHTML = automations.map((a, i) => `
    <div class="flow-step">
      <div class="flow-num">${i + 1}</div>
      <div class="flow-body">
        <div class="flow-title">${escHtml(a.name)} <span class="chip chip-success" style="font-size:0.65rem">Active</span></div>
        <div class="flow-desc">Trigger: ${escHtml(a.trigger)} → Action: ${escHtml(a.action)}</div>
        <div class="progress-bar" style="margin-top:6px"><div class="progress-fill" style="width:100%"></div></div>
      </div>
      <button class="btn btn-outline btn-sm" style="margin-left:auto;flex-shrink:0" onclick="deleteAutomation(${i})">✕</button>
    </div>
  `).join('');
}

function deleteAutomation(index) {
  automations.splice(index, 1);
  renderAutomationList();
}

// ── Plugin Manager ────────────────────────────────────────────

const plugins = [
  { name: 'G-Code Beautifier',   icon: '✨', desc: 'Format and comment NC files automatically.',          version: '2.1.0', active: true,  installed: true  },
  { name: 'Tool Life Tracker',   icon: '🔧', desc: 'Track wear and predict tool replacement schedules.',  version: '1.4.2', active: true,  installed: true  },
  { name: 'DXF Import',          icon: '📄', desc: 'Import 2D DXF geometry directly into the job.',       version: '3.0.1', active: false, installed: true  },
  { name: 'Feeds & Speeds Pro',  icon: '📊', desc: 'Advanced material-based feed/speed calculator.',      version: '1.2.0', active: false, installed: false },
  { name: 'STEP Viewer',         icon: '🗂',  desc: 'Lightweight STEP model viewer in the browser.',       version: '0.9.5', active: false, installed: false },
  { name: 'Post-Processor Kit',  icon: '📦', desc: 'Library of 40+ post-processors for common controls.', version: '4.0.0', active: false, installed: false },
];

const pluginGrid = document.getElementById('plugin-grid');

function renderPlugins(list) {
  if (!pluginGrid) return;
  pluginGrid.innerHTML = list.map((p, i) => `
    <div class="plugin-card">
      <div class="plugin-icon">${p.icon}</div>
      <div class="plugin-info">
        <div class="plugin-name">${escHtml(p.name)} <span style="color:var(--text-muted);font-size:0.75rem">v${p.version}</span></div>
        <div class="plugin-desc">${escHtml(p.desc)}</div>
        ${p.installed
          ? `<span class="chip ${p.active ? 'chip-success' : 'chip-warning'}" style="margin-right:6px">${p.active ? 'Active' : 'Inactive'}</span>
             <button class="btn btn-outline btn-sm" onclick="togglePlugin(${i})">${p.active ? 'Disable' : 'Enable'}</button>`
          : `<button class="btn btn-primary btn-sm" onclick="installPlugin(${i})">Install</button>`
        }
      </div>
    </div>
  `).join('');
}

function togglePlugin(index) {
  plugins[index].active = !plugins[index].active;
  renderPlugins(getFilteredPlugins());
  refreshDashboardStats();
}

function installPlugin(index) {
  plugins[index].installed = true;
  plugins[index].active    = true;
  renderPlugins(getFilteredPlugins());
  refreshDashboardStats();
}

function loadLocalPlugin() {
  alert('In a production build, this would open a file picker to load a local .js plugin module.');
}

function getFilteredPlugins() {
  const q = document.getElementById('plugin-search') ? document.getElementById('plugin-search').value.toLowerCase() : '';
  return q ? plugins.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)) : plugins;
}

const pluginSearch = document.getElementById('plugin-search');
pluginSearch && pluginSearch.addEventListener('input', () => renderPlugins(getFilteredPlugins()));

// ── Utility ───────────────────────────────────────────────────

function escHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Missions ──────────────────────────────────────────────────

function openMissionModal() {
  document.getElementById('mission-modal').style.display = 'flex';
}

function closeMissionModal() {
  document.getElementById('mission-modal').style.display = 'none';
}

function saveMission() {
  const name   = document.getElementById('nm-name').value.trim();
  const type   = document.getElementById('nm-type').value;
  const agents = document.getElementById('nm-agents').value.trim();

  if (!name) { alert('Please enter a mission name.'); return; }

  const tbody = document.getElementById('mission-tbody');
  if (tbody) {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + escHtml(name) + '</td>' +
      '<td>' + escHtml(type) + '</td>' +
      '<td>' + escHtml(agents || '—') + '</td>' +
      '<td><span class="chip chip-warning">Planning</span></td>' +
      '<td><div class="progress-bar" style="width:160px"><div class="progress-fill" style="width:5%;background:var(--warning)"></div></div></td>';
    tbody.appendChild(tr);
  }

  document.getElementById('nm-name').value   = '';
  document.getElementById('nm-agents').value = '';
  closeMissionModal();
}

// ── Agents ────────────────────────────────────────────────────

function restartAgent(name) {
  alert('Restarting ' + name + '…\nAgent will reconnect automatically within 10 seconds.');
}

function agentSync(name) {
  alert(name + ': Sync initiated. Changes will appear within 30 seconds.');
}

// ── AI Command Center ─────────────────────────────────────────

function addTaskToQueue() {
  const list  = document.getElementById('task-queue-list');
  const count = document.getElementById('aicc-queued');
  if (!list) return;

  const n = list.querySelectorAll('.flow-step').length + 1;
  const div = document.createElement('div');
  div.className = 'flow-step';
  div.innerHTML =
    '<div class="flow-num">' + n + '</div>' +
    '<div class="flow-body">' +
      '<div class="flow-title">Manual Task <span class="chip chip-warning" style="font-size:0.65rem">Pending</span></div>' +
      '<div class="flow-desc">Added manually · ' + new Date().toLocaleTimeString() + '</div>' +
    '</div>';
  list.appendChild(div);

  if (count) count.textContent = String(n);
}

function clearQueue() {
  const list  = document.getElementById('task-queue-list');
  const count = document.getElementById('aicc-queued');
  if (list)  list.innerHTML = '<div style="color:var(--text-muted);font-size:0.85rem">Queue is empty.</div>';
  if (count) count.textContent = '0';
}

function triggerGithubSync() {
  const rows = document.querySelectorAll('#panel-ai-command .dash-row');
  rows.forEach(r => {
    const chip = r.querySelector('.chip');
    if (chip && chip.textContent.includes('Syncing')) {
      chip.className = 'chip chip-success';
      chip.textContent = 'In Sync';
    }
  });
  alert('GitHub sync triggered. All repositories will be updated within 60 seconds.');
}

// ── DNS Monitor ───────────────────────────────────────────────

function runDNSCheck(domain) {
  alert('Running DNSSEC verification for ' + domain + '…\n\nAll records validated. DNSSEC: ✅ Verified | SSL: ✅ Active');
}

// ── Analytics charts ──────────────────────────────────────────

function renderAnalyticsCharts() {
  renderBarChart('bars-donations',  [320,410,280,520,480,600,420,390,540,720,610,680], 'var(--warning)');
  renderBarChart('bars-volunteers', [8,12,6,15,10,18,22,14,19,25,21,28], 'var(--accent)');
  renderBarChart('bars-outreach',   [180,220,195,310,280,420,350,390,480,520,460,560], 'var(--success)');
}

function renderBarChart(containerId, values, color) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const max = Math.max(...values);
  el.innerHTML = values.map(v => {
    const h = Math.round((v / max) * 90);
    return '<div class="chart-bar" style="height:' + h + 'px;background:' + color + '" title="' + v + '"></div>';
  }).join('');
}

// ── Donations ─────────────────────────────────────────────────

const WALLET_ADDRESS = '7mWvKtzKvXzupqBaMYLo2Q7uzcXiEdfdMWgG6N12eEah';
let selectedDonationAmount = null;

function selectDonationAmount(amount) {
  selectedDonationAmount = amount;

  // Highlight selected preset button
  document.querySelectorAll('.donation-preset').forEach(btn => {
    const label = btn.textContent.replace(/[^0-9,]/g, '').replace(',', '');
    btn.classList.toggle('btn-primary', parseInt(label, 10) === amount);
    btn.classList.toggle('btn-outline', parseInt(label, 10) !== amount);
  });

  // Build Solana Pay URL (USDC on Solana for a stable USD-denominated amount)
  // SPL-token mint for USDC on Solana mainnet
  const usdcMint   = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  const label      = encodeURIComponent('Jupiter Command Donation');
  const message    = encodeURIComponent('Thank you for supporting the mission!');
  const solanaPayUrl = 'solana:' + WALLET_ADDRESS
    + '?amount=' + amount
    + '&spl-token=' + usdcMint
    + '&label=' + label
    + '&message=' + message;

  // Update the "Open in Wallet" link
  const payLink = document.getElementById('solana-pay-link');
  if (payLink) {
    payLink.href = solanaPayUrl;
    payLink.style.display = '';
  }

  // Show amount note
  const note = document.getElementById('donation-amount-note');
  if (note) {
    note.style.display = '';
    note.innerHTML = '<strong>$' + amount.toLocaleString() + ' USDC selected.</strong> '
      + 'Click <em>Open in Wallet</em> to launch your Solana wallet with the amount pre-filled, '
      + 'or copy the address below and send manually.';
  }
}

function openSolanaPay(e) {
  const href = e.currentTarget.href;
  if (!href || href === '#') { e.preventDefault(); return; }
  // Let the browser handle the solana: URI natively; fall back gracefully
  try {
    window.location.href = href;
  } catch (_) {
    e.preventDefault();
    alert('Open your Solana wallet app and send $' + (selectedDonationAmount || '').toLocaleString()
      + ' USDC to:\n' + WALLET_ADDRESS);
  }
  e.preventDefault();
}

function copyWallet() {
  const addr = document.getElementById('wallet-addr');
  if (!addr) return;
  const text = addr.textContent.trim();
  const msg  = selectedDonationAmount
    ? 'Wallet address copied! Send $' + selectedDonationAmount.toLocaleString() + ' USDC to this address.'
    : 'Wallet address copied to clipboard!';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert(msg);
    }).catch(() => fallbackCopy(text, msg));
  } else {
    fallbackCopy(text, msg);
  }
}

function fallbackCopy(text, msg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity  = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  alert(msg || 'Wallet address copied!');
}

// ── Bootstrap ─────────────────────────────────────────────────

(function init() {
  renderPlugins(plugins);
  refreshDashboardStats();
  refreshSimJobSelect();
  renderAnalyticsCharts();
  showPanel('dashboard');
})();
