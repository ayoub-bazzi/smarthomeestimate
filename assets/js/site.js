const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
});

const calculators = {
  foundation: {
    projectType: 'Foundation Crack Repair',
    defaults: { crackType: 'hairline', zones: 1, zip: '' },
    calculate(state) {
      const base = { hairline: 450, stair: 1800, horizontal: 6500 }[state.crackType] || 450;
      const zones = clampNumber(state.zones, 1, 20);
      const multiplier = zipMultiplier(state.zip, { high: 1.25, mid: 1.10, standard: 1.00 });
      const subtotal = base * zones * multiplier;
      return range(subtotal, 0.85, 1.15);
    },
    summary(state, result) {
      return `${state.zones || 1} crack zone(s), ${labelFor('crackType', state.crackType)}, ${state.zip || 'zip pending'}: ${formatRange(result)}.`;
    }
  },
  pierbeam: {
    projectType: 'Pier and Beam Repair',
    defaults: { scope: 'reshim', area: 1500, clearance: 'standard' },
    calculate(state) {
      const rate = { reshim: 1.75, timber: 3.50, underpin: 8.50 }[state.scope] || 1.75;
      const area = clampNumber(state.area, 600, 4000);
      const clearance = state.clearance === 'tight' ? 1.30 : 1.00;
      return range(rate * area * clearance, 0.90, 1.10);
    },
    summary(state, result) {
      return `${state.area || 1500} sq. ft., ${labelFor('scope', state.scope)}, ${state.clearance === 'tight' ? 'restricted access' : 'standard access'}: ${formatRange(result)}.`;
    }
  },
  septic: {
    projectType: 'Septic System Installation',
    defaults: { bedrooms: '3-4', material: 'concrete', system: 'conventional' },
    calculate(state) {
      const volume = { '1-2': 950, '3-4': 1350, '5': 1550, '6plus': 2200 }[state.bedrooms] || 1350;
      const material = { concrete: 1500, plastic: 850, fiberglass: 1700 }[state.material] || 1500;
      const system = { conventional: 4500, aerobic: 11000, mound: 13500 }[state.system] || 4500;
      return range(volume + material + system, 0.90, 1.10);
    },
    summary(state, result) {
      return `${labelFor('bedrooms', state.bedrooms)}, ${labelFor('material', state.material)}, ${labelFor('system', state.system)}: ${formatRange(result)}.`;
    }
  },
  roofing: {
    projectType: 'Roof Replacement',
    defaults: { material: 'asphalt3', area: 2000, pitch: 'standard', tearoff: false, complex: false },
    calculate(state) {
      const material = { asphalt3: 5.00, architectural: 6.50, metal: 11.00 }[state.material] || 5.00;
      const pitch = { low: 1.10, standard: 1.25, steep: 1.45 }[state.pitch] || 1.25;
      const roofArea = clampNumber(state.area, 1000, 4000) * pitch;
      const tearoff = bool(state.tearoff) ? roofArea * 2.50 : 0;
      const complex = bool(state.complex) ? 850 : 0;
      return range((roofArea * material) + tearoff + complex, 0.90, 1.10, { roofArea });
    },
    summary(state, result) {
      return `${Math.round(result.roofArea)} roof sq. ft., ${labelFor('material', state.material)}, ${labelFor('pitch', state.pitch)}: ${formatRange(result)}.`;
    }
  },
  hvac: {
    projectType: 'HVAC Replacement',
    defaults: { systemType: 'split', area: 1800, efficiency: 'standard', ducts: false },
    calculate(state) {
      const system = { split: 3.50, heatpump: 4.25, furnace: 1.85 }[state.systemType] || 3.50;
      const efficiency = { standard: 1.00, high: 1.25, ultra: 1.55 }[state.efficiency] || 1.00;
      const ducts = bool(state.ducts) ? 2800 : 0;
      return range((system * clampNumber(state.area, 1000, 4000) * efficiency) + ducts, 0.90, 1.10);
    },
    summary(state, result) {
      return `${state.area || 1800} sq. ft., ${labelFor('systemType', state.systemType)}, ${labelFor('efficiency', state.efficiency)}: ${formatRange(result)}.`;
    }
  },
  plumbing: {
    projectType: 'Plumbing Service',
    defaults: { service: 'fixture', quantity: 1, timing: 'standard', zip: '' },
    calculate(state) {
      const job = { fixture: 250, waterheater: 1650, drain: 550, emergency: 750 }[state.service] || 250;
      const quantity = state.service === 'waterheater' ? 1 : clampNumber(state.quantity, 1, 5);
      const timing = state.timing === 'afterhours' ? 1.50 : 1.00;
      const labor = zipMultiplier(state.zip, { high: 1.30, mid: 1.10, standard: 1.00 });
      return range(job * quantity * timing * labor, 0.85, 1.15);
    },
    summary(state, result) {
      return `${labelFor('service', state.service)}, ${state.service === 'waterheater' ? 1 : state.quantity || 1} unit(s), ${state.zip || 'zip pending'}: ${formatRange(result)}.`;
    }
  }
};

const labels = {
  crackType: { hairline: 'hairline or vertical fracture', stair: 'diagonal or stair-step fracture', horizontal: 'horizontal fracture' },
  scope: { reshim: 'minor reshimming', timber: 'leveling with timber remediation', underpin: 'pier reconstruction or underpinning' },
  bedrooms: { '1-2': '1 to 2 bedrooms', '3-4': '3 to 4 bedrooms', '5': '5 bedrooms', '6plus': '6 or more bedrooms' },
  material: { concrete: 'precast concrete tank', plastic: 'polyethylene tank', fiberglass: 'fiberglass tank', asphalt3: '3-tab asphalt shingles', architectural: 'architectural shingles', metal: 'standing seam metal roofing' },
  system: { conventional: 'conventional gravity system', aerobic: 'aerobic treatment system', mound: 'engineered mound system' },
  pitch: { low: 'low slope', standard: 'standard slope', steep: 'steep slope' },
  systemType: { split: 'split AC and furnace', heatpump: 'electric heat pump', furnace: 'furnace change-out' },
  efficiency: { standard: 'standard efficiency', high: 'high efficiency', ultra: 'ultra-high inverter efficiency' },
  service: { fixture: 'fixture repair or replacement', waterheater: 'water heater replacement', drain: 'main drain line service', emergency: 'emergency burst pipe repair' }
};

function labelFor(group, value) {
  return labels[group]?.[value] || value || '';
}

function range(base, low, high, extra = {}) {
  return {
    min: Math.round(base * low),
    max: Math.round(base * high),
    ...extra
  };
}

function formatRange(result) {
  return `${money.format(result.min)} - ${money.format(result.max)}`;
}

function clampNumber(value, min, max) {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function bool(value) {
  return value === true || value === 'true' || value === 'on';
}

function zipMultiplier(zip = '', rates) {
  const first = String(zip).trim().charAt(0);
  if (['0', '1', '9'].includes(first)) return rates.high;
  if (['4', '5', '6'].includes(first)) return rates.mid;
  return rates.standard;
}

function readState(form, defaults) {
  const state = { ...defaults };

  form.querySelectorAll('input, select, textarea').forEach((input) => {
    if (!input.name) return;
    if (input.type === 'radio' && !input.checked) return;
    if (input.type === 'checkbox') return;
    state[input.name] = input.value;
  });

  form.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    state[input.name] = input.checked;
  });

  return state;
}

function updateRangeLabels(form) {
  form.querySelectorAll('input[type="range"]').forEach((input) => {
    const target = form.querySelector(`[data-range-output="${input.name}"]`);
    if (target) target.textContent = Number(input.value).toLocaleString('en-US');
  });
}

function setStep(root, index) {
  const steps = [...root.querySelectorAll('.calc-step')];
  const nextIndex = Math.min(steps.length - 1, Math.max(0, index));
  root.dataset.currentStep = String(nextIndex);

  steps.forEach((step, position) => {
    step.classList.toggle('is-active', position === nextIndex);
    step.hidden = position !== nextIndex;
  });

  const progress = root.querySelector('[data-progress]');
  if (progress) progress.textContent = `Step ${nextIndex + 1} of ${steps.length}`;
}

function renderResult(root, form, config, isFinal = false) {
  const state = readState(form, config.defaults);
  const result = config.calculate(state);
  
  const output = root.querySelector('[data-result]');
  const summary = root.querySelector('[data-result-summary]');
  
  if (output) {
    const nextOutput = formatRange(result);
    if (output.textContent !== nextOutput) output.textContent = nextOutput;
  }
  
  if (summary) {
    const nextSummary = config.summary(state, result);
    if (summary.textContent !== nextSummary) summary.textContent = nextSummary;
  }
  
  if (isFinal) {
    const maxField = document.querySelector('[name="estimatedCost"]');
    const typeField = document.querySelector('[name="projectType"]');
    const payloadField = document.querySelector('[name="estimatePayload"]');

    if (maxField) maxField.value = result.max;
    if (typeField) typeField.value = config.projectType;
    if (payloadField) {
      payloadField.value = JSON.stringify({ projectType: config.projectType, state, estimate: result });
    }
  }

  const panel = root.querySelector('[data-result-panel]');
  if (panel && panel.classList.contains('hidden')) {
    panel.classList.remove('hidden');
  }
}

function initCalculator(root) {
  const key = root.dataset.calculator;
  const config = calculators[key];
  const form = root.querySelector('[data-calculator-form]');
  if (!config || !form) return;

  setStep(root, 0);
  updateRangeLabels(form);
  renderResult(root, form, config, true);

  root.addEventListener('click', (event) => {
    const next = event.target.closest('[data-next]');
    const prev = event.target.closest('[data-prev]');
    if (!next && !prev) return;
    event.preventDefault();
    const current = Number(root.dataset.currentStep || 0);
    setStep(root, current + (next ? 1 : -1));
    renderResult(root, form, config, true);
  });

  let isRendering = false;

  form.addEventListener('input', () => {
    if (!isRendering) {
      isRendering = true;
      requestAnimationFrame(() => {
        updateRangeLabels(form);
        renderResult(root, form, config, false);
        isRendering = false;
      });
    }
  });

  form.addEventListener('change', () => {
    updateRangeLabels(form);
    renderResult(root, form, config, true);
  });
}

function initEstimateForms() {
  document.querySelectorAll('form[data-estimate-email]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot?.value) return;

      if (status) status.textContent = 'Sending your estimate...';

      const payload = Object.fromEntries(new FormData(form).entries());
      try {
        const response = await fetch('/api/submit-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Request failed');
        if (status) status.textContent = 'Estimate request received. Please check your email shortly.';
        form.reset();
      } catch {
        if (status) status.textContent = 'We could not send this right now. Please try again in a moment.';
      }
    });
  });
}

function initContactForms() {
  document.querySelectorAll('form[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const honeypot = form.querySelector('[name="company"]');
      if (honeypot?.value) return;
      if (status) status.textContent = 'Thanks. Your message has been prepared for the support queue.';
      form.reset();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-calculator]').forEach(initCalculator);
  initEstimateForms();
  initContactForms();
});
