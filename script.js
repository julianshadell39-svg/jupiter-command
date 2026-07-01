const STORAGE_KEYS = {
  donations: 'hopespring_donations',
  updates: 'hopespring_updates',
  funnel: 'hopespring_funnel'
};

const PAYMENT_LINKS = {
  stripe: {
    'one-time': '#demo-stripe-one-time',
    monthly: '#demo-stripe-monthly'
  },
  paypal: {
    'one-time': '#demo-paypal-one-time',
    monthly: '#demo-paypal-monthly'
  }
};

const defaultUpdates = [
  'Installed filtration systems at 2 schools in Kisumu County.',
  'Trained 18 local maintenance volunteers for long-term upkeep.'
];

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function setupMenu() {
  const button = document.querySelector('.menu-toggle');
  const nav = document.getElementById('site-nav');
  if (!button || !nav) return;

  button.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}

function trackFunnelStep(step) {
  const funnel = readStorage(STORAGE_KEYS.funnel, {
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
    completed: 0
  });
  const key = `step${step}`;
  if (funnel[key] !== undefined) funnel[key] += 1;
  writeStorage(STORAGE_KEYS.funnel, funnel);
}

function computeMetrics() {
  const donations = readStorage(STORAGE_KEYS.donations, []);
  const funnel = readStorage(STORAGE_KEYS.funnel, {
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
    completed: 0
  });

  const totalAmount = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const recurringCount = donations.filter((d) => d.frequency === 'monthly').length;
  const conversionRate = funnel.step1 > 0 ? ((funnel.completed / funnel.step1) * 100).toFixed(1) : '0.0';
  const recurringRate = donations.length > 0 ? ((recurringCount / donations.length) * 100).toFixed(1) : '0.0';
  const avgDonation = donations.length > 0 ? (totalAmount / donations.length).toFixed(2) : '0.00';

  const dropOff = {
    'Step 1 → 2': funnel.step1 > 0 ? `${(((funnel.step1 - funnel.step2) / funnel.step1) * 100).toFixed(1)}%` : '0.0%',
    'Step 2 → 3': funnel.step2 > 0 ? `${(((funnel.step2 - funnel.step3) / funnel.step2) * 100).toFixed(1)}%` : '0.0%',
    'Step 3 → 4': funnel.step3 > 0 ? `${(((funnel.step3 - funnel.step4) / funnel.step3) * 100).toFixed(1)}%` : '0.0%'
  };

  return {
    donationCount: donations.length,
    totalAmount,
    avgDonation,
    conversionRate,
    recurringRate,
    dropOff
  };
}

function renderMetrics() {
  const metrics = computeMetrics();
  const fields = [
    ['Total donations', String(metrics.donationCount)],
    ['Average donation', `${metrics.avgDonation}`],
    ['Donation conversion rate', `${metrics.conversionRate}%`],
    ['Recurring donor rate', `${metrics.recurringRate}%`],
    ['Drop-off (1→2)', metrics.dropOff['Step 1 → 2']],
    ['Drop-off (2→3)', metrics.dropOff['Step 2 → 3']],
    ['Drop-off (3→4)', metrics.dropOff['Step 3 → 4']]
  ];

  const renderList = (node) => {
    if (!node) return;
    node.innerHTML = fields
      .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
      .join('');
  };

  renderList(document.getElementById('public-metrics'));
  renderList(document.getElementById('admin-metrics'));
}

function renderUpdates() {
  const updates = readStorage(STORAGE_KEYS.updates, defaultUpdates);
  writeStorage(STORAGE_KEYS.updates, updates);

  const list = document.getElementById('impact-updates');
  if (!list) return;

  list.innerHTML = updates.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
}

function renderDonationsTable() {
  const rows = readStorage(STORAGE_KEYS.donations, []);
  const tableBody = document.getElementById('donations-table');
  if (!tableBody) return;

  tableBody.innerHTML = rows
    .slice()
    .reverse()
    .map(
      (d) => `
      <tr>
        <td>${escapeHtml(d.date)}</td>
        <td>${escapeHtml(d.fullName)}</td>
        <td>${escapeHtml(d.email)}</td>
        <td>${escapeHtml(d.frequency)}</td>
        <td>${escapeHtml(d.amount)}</td>
        <td>${escapeHtml(d.currency)}</td>
        <td>${escapeHtml(d.provider)}</td>
      </tr>
    `
    )
    .join('');
}

function toCsvLine(value) {
  const escaped = String(value ?? '').replace(/"/g, '""');
  return `"${escaped}"`;
}

function exportCsv() {
  const donations = readStorage(STORAGE_KEYS.donations, []);
  const header = ['date', 'fullName', 'email', 'frequency', 'amount', 'currency', 'provider'];
  const lines = [
    header.join(','),
    ...donations.map((d) => header.map((key) => toCsvLine(d[key])).join(','))
  ];

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `donations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function donationSummary(formData) {
  return `
    <p><strong>Donor:</strong> ${escapeHtml(formData.fullName || '-')}</p>
    <p><strong>Email:</strong> ${escapeHtml(formData.email || '-')}</p>
    <p><strong>Plan:</strong> ${escapeHtml(formData.frequency || '-')}</p>
    <p><strong>Amount:</strong> ${escapeHtml(formData.amount || '-')} ${escapeHtml(formData.currency || '')}</p>
    <p><strong>Provider:</strong> ${escapeHtml(formData.provider || '-')}</p>
  `;
}

function getFormData(form) {
  return Object.fromEntries(new FormData(form).entries());
}

function requiredFieldsForStep(step) {
  if (step === 1) return ['frequency', 'currency', 'amount'];
  if (step === 2) return ['fullName', 'email', 'country'];
  if (step === 3) return ['provider'];
  if (step === 4) return ['acceptTerms'];
  return [];
}

function validateStep(form, step) {
  const data = getFormData(form);
  const fields = requiredFieldsForStep(step);
  const missing = fields.some((field) => !String(data[field] || '').trim());
  if (missing) return false;

  if (step === 1 && Number(data.amount) <= 0) return false;
  if (step === 2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.email))) return false;
  return true;
}

function saveDonation(data) {
  const donations = readStorage(STORAGE_KEYS.donations, []);
  const record = {
    ...data,
    amount: Number(data.amount),
    date: new Date().toISOString().slice(0, 10),
    receiptId: crypto.randomUUID()
  };
  donations.push(record);
  writeStorage(STORAGE_KEYS.donations, donations);

  const funnel = readStorage(STORAGE_KEYS.funnel, {
    step1: 0,
    step2: 0,
    step3: 0,
    step4: 0,
    completed: 0
  });
  funnel.completed += 1;
  writeStorage(STORAGE_KEYS.funnel, funnel);

  return record;
}

function fakePaymentRedirect(provider, frequency) {
  const link = PAYMENT_LINKS[provider]?.[frequency];
  if (!link) return false;
  return true;
}

function setupDonationForm() {
  const form = document.getElementById('donation-form');
  if (!form) return;

  const status = document.getElementById('donation-status');
  const preview = document.getElementById('confirmation-preview');
  const stepIndicators = [...document.querySelectorAll('.stepper li')];
  const panels = [...form.querySelectorAll('.form-panel')];
  const amountButtons = [...form.querySelectorAll('.amount-btn')];
  const amountInput = document.getElementById('amount');

  let currentStep = 1;
  trackFunnelStep(1);

  function moveStep(targetStep) {
    currentStep = targetStep;
    panels.forEach((panel) => {
      panel.classList.toggle('active', Number(panel.dataset.panel) === targetStep);
    });
    stepIndicators.forEach((step) => {
      step.classList.toggle('active', Number(step.dataset.step) === targetStep);
    });

    if (targetStep > 1) trackFunnelStep(targetStep);

    preview.innerHTML = donationSummary(getFormData(form));
  }

  amountButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      amountButtons.forEach((candidate) => candidate.classList.remove('active'));
      btn.classList.add('active');
      amountInput.value = btn.dataset.amount || '';
    });
  });

  form.querySelectorAll('[data-next]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!validateStep(form, currentStep)) {
        status.textContent = 'Please complete all required fields before continuing.';
        return;
      }
      status.textContent = '';
      moveStep(Math.min(4, currentStep + 1));
    });
  });

  form.querySelectorAll('[data-prev]').forEach((button) => {
    button.addEventListener('click', () => {
      status.textContent = '';
      moveStep(Math.max(1, currentStep - 1));
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!validateStep(form, 4)) {
      status.textContent = 'Please accept terms to complete your donation.';
      return;
    }

    const data = getFormData(form);
    fakePaymentRedirect(data.provider, data.frequency);
    const saved = saveDonation(data);

    status.textContent = `Thank you! Donation complete. Receipt #${saved.receiptId.slice(0, 8)} has been emailed to ${saved.email}.`;

    form.reset();
    amountButtons.forEach((btn) => btn.classList.remove('active'));
    moveStep(1);

    renderDonationsTable();
    renderMetrics();
  });
}

function setupAdminControls() {
  const exportBtn = document.getElementById('export-csv');
  const seedBtn = document.getElementById('seed-demo');
  const updateForm = document.getElementById('update-form');

  exportBtn?.addEventListener('click', exportCsv);

  seedBtn?.addEventListener('click', () => {
    const existing = readStorage(STORAGE_KEYS.donations, []);
    if (existing.length > 0) return;

    const seed = [
      {
        date: '2026-06-20',
        fullName: 'Maria K',
        email: 'maria@example.com',
        frequency: 'one-time',
        amount: 50,
        currency: 'USD',
        provider: 'stripe'
      },
      {
        date: '2026-06-23',
        fullName: 'Alex T',
        email: 'alex@example.com',
        frequency: 'monthly',
        amount: 30,
        currency: 'EUR',
        provider: 'paypal'
      }
    ];

    writeStorage(STORAGE_KEYS.donations, seed);
    writeStorage(STORAGE_KEYS.funnel, {
      step1: 10,
      step2: 8,
      step3: 7,
      step4: 6,
      completed: 2
    });

    renderDonationsTable();
    renderMetrics();
  });

  updateForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('update-input');
    const value = String(input?.value || '').trim();
    if (!value) return;

    const updates = readStorage(STORAGE_KEYS.updates, defaultUpdates);
    updates.unshift(value);
    writeStorage(STORAGE_KEYS.updates, updates.slice(0, 8));

    if (input) input.value = '';
    renderUpdates();
  });
}

function bootstrap() {
  document.getElementById('year').textContent = String(new Date().getFullYear());
  setupMenu();
  setupDonationForm();
  setupAdminControls();
  renderUpdates();
  renderDonationsTable();
  renderMetrics();
}

document.addEventListener('DOMContentLoaded', bootstrap);
