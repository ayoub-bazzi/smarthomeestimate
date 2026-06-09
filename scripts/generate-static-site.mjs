import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const site = {
  name: 'Smart Home Estimate',
  domain: 'https://smarthomeestimate.com',
  description: 'Interactive home repair calculators for high-ticket residential projects.'
};

const nav = [
  ['/', 'Home'],
  ['/foundation-repair-cost/crack-calculator/', 'Foundation'],
  ['/foundation-repair-cost/pier-and-beam-calculator/', 'Pier & Beam'],
  ['/roofing-cost/calculator/', 'Roofing'],
  ['/hvac-cost/replacement-calculator/', 'HVAC'],
  ['/plumbing-cost/service-estimator/', 'Plumbing'],
  ['/plumbing-cost/septic-tank-calculator/', 'Septic'],
  ['/about/', 'About'],
  ['/contact/', 'Contact']
];

const calculators = [
  {
    key: 'foundation',
    path: 'foundation-repair-cost/crack-calculator/index.html',
    url: '/foundation-repair-cost/crack-calculator/',
    title: 'Foundation Crack Repair Cost Calculator',
    metaTitle: 'Foundation Crack Repair Cost Calculator | 2026 Structural Pricing Guide',
    metaDescription: 'Calculate foundation crack repair costs using symptom type, crack quantity, and a regional zip-code labor index.',
    keyword: 'foundation crack repair cost',
    accent: 'emerald',
    snippet: 'Foundation crack repair commonly ranges from a few hundred dollars for minor sealing to several thousand dollars for structural reinforcement. This calculator estimates a planning range from visible crack type, quantity, and regional labor conditions.',
    intro: 'Foundation cracks can be cosmetic, moisture-related, or an early sign of structural movement. Use this estimator to build a practical planning range before requesting a licensed inspection.',
    calculator: foundationCalculator(),
    sections: [
      section('What Determines a Foundation Repair Invoice?', [
        'Crack orientation is the first diagnostic signal. Vertical hairline cracks are often shrinkage-related, stair-step cracks can indicate differential settlement, and horizontal cracks can signal lateral soil pressure.',
        'Repair methods change the price quickly. Epoxy injection, carbon-fiber strapping, slabjacking, helical piers, and tiebacks are very different scopes of work.',
        table([
          ['Repair Method', 'Typical Range', 'Common Use'],
          ['Polyurethane or epoxy injection', '$350 - $900 per crack', 'Minor non-structural water sealing'],
          ['Carbon-fiber wall straps', '$700 - $1,500 per strap', 'Stabilizing mild wall bowing'],
          ['Helical or resistance piers', '$1,200 - $3,000 per pier', 'Lifting settled footings to stable bearing'],
          ['Slabjacking or foam lifting', '$2,000 - $6,000 total', 'Leveling settled concrete slabs']
        ])
      ]),
      section('Warning Signs Worth Inspecting', [
        bulletList([
          'Doors or windows sticking in several rooms.',
          'Gaps opening between drywall, trim, ceilings, or exterior brick.',
          'Floors that slope noticeably or feel newly uneven.',
          'Water intrusion near the crack after heavy rain.'
        ])
      ]),
      contractorGuidelines([
        'Ask for a third-party structural engineer report before major lifting or underpinning.',
        'Confirm the contractor carries insurance that specifically covers structural foundation work.',
        'Request a written transferable warranty for piering or underpinning scopes.'
      ])
    ],
    faqs: [
      ['Are foundation cracks normal?', 'Yes. Fine vertical cracks under 1/8 inch can be normal concrete shrinkage, but widening, stair-step, or horizontal cracks should be evaluated by a qualified professional.'],
      ['Why does a foundation crack?', 'Foundations crack when concrete shrinks, soil settles unevenly, drainage changes, or hydrostatic pressure pushes against foundation walls.'],
      ['Is this calculator a contractor quote?', 'No. It provides a planning estimate only. Site conditions, soil behavior, access, permits, and engineering requirements can change final pricing.']
    ]
  },
  {
    key: 'pierbeam',
    path: 'foundation-repair-cost/pier-and-beam-calculator/index.html',
    url: '/foundation-repair-cost/pier-and-beam-calculator/',
    title: 'Pier & Beam Foundation Repair & House Leveling Cost Calculator',
    metaTitle: 'Pier & Beam Foundation Repair Cost Calculator | 2026 House Leveling Guide',
    metaDescription: 'Estimate pier and beam foundation repair and house leveling costs from project scope, footprint, and crawl space access.',
    keyword: 'pier and beam foundation repair cost',
    accent: 'amber',
    snippet: 'Pier and beam repair prices depend on whether the project is simple reshimming, timber remediation, or full pier reconstruction. This calculator estimates a planning range from repair scope, home footprint, and crawl space clearance.',
    intro: 'Crawl space foundations rely on piers, beams, joists, and sill plates working together. Sagging floors usually point to moisture, settlement, access, or load-transfer problems that must be priced carefully.',
    calculator: pierBeamCalculator(),
    sections: [
      section('The Core Elements of a Pier and Beam System', [
        bulletList([
          'Footings distribute the vertical load into stable soil.',
          'Piers support the main beams and keep the living floor elevated.',
          'Sill plates and girders carry the structural frame.',
          'Floor joists support the subfloor and finished flooring.'
        ])
      ]),
      section('Primary Cost Variables', [
        table([
          ['Variable', 'Mechanical Influence', 'Budget Impact'],
          ['Wood rot remediation', 'Damaged beams, joists, or sill plates must be replaced.', 'Often adds $1,500 - $5,000.'],
          ['Pier failure', 'Sinking or cracked supports need excavation and reconstruction.', 'Often $1,000 - $3,000 per support.'],
          ['Restricted crawl space access', 'Low clearance slows crews and may require hand excavation.', 'Can add about 30% labor overhead.']
        ])
      ]),
      contractorGuidelines([
        'Request floor-elevation mapping before and after leveling.',
        'Separate timber replacement pricing from general leveling labor.',
        'Address drainage or moisture sources so the repair is not temporary.'
      ])
    ],
    faqs: [
      ['How do contractors level a pier and beam house?', 'They use hydraulic jacks to lift the frame gradually, then stabilize it with shims, repaired beams, or replacement piers depending on the cause.'],
      ['How much does pier and beam foundation repair cost?', 'Many projects fall between $2,000 and $15,000, while severe rot or multiple failed piers can push higher.'],
      ['What causes a crawl space foundation to sag?', 'Common causes include soft soil, poor drainage, high moisture, wood rot, undersized supports, or shifting piers.']
    ]
  },
  {
    key: 'septic',
    path: 'plumbing-cost/septic-tank-calculator/index.html',
    url: '/plumbing-cost/septic-tank-calculator/',
    title: 'Septic Tank Installation Cost Calculator',
    metaTitle: 'Septic Tank Installation Cost Calculator | 2026 Price Estimator',
    metaDescription: 'Estimate septic tank installation costs by bedroom count, tank material, and system architecture.',
    keyword: 'septic tank installation cost',
    accent: 'emerald',
    snippet: 'Septic installation pricing depends on household capacity, tank material, drain field design, soil behavior, and local health department rules. This calculator gives a planning range before engineering or permit review.',
    intro: 'A septic system is a site-specific wastewater infrastructure project. Use this estimator to compare conventional, aerobic, and engineered mound system budgets.',
    calculator: septicCalculator(),
    sections: [
      section('What Factors Dictate Septic System Cost?', [
        'Bedroom count is commonly used as a code proxy for peak wastewater flow and required tank volume.',
        'Soil percolation, water table depth, setbacks, and drain field size often matter more than the tank itself.',
        table([
          ['System Type', 'Typical Range', 'Best Application'],
          ['Conventional anaerobic', '$3,500 - $10,000', 'Deep permeable soil with low water table'],
          ['Aerobic treatment unit', '$10,000 - $20,000', 'Small yards, shallow bedrock, or sensitive sites'],
          ['Mound system', '$12,000 - $17,000+', 'Dense clay, high water table, or poor native soil']
        ])
      ]),
      contractorGuidelines([
        'Verify state or county onsite wastewater licensing.',
        'Clarify who manages perc testing and health department permits.',
        'Get a written excavation contingency rate for unexpected rock, roots, or buried debris.'
      ])
    ],
    faqs: [
      ['How much does it cost to pump a septic tank?', 'A residential pump-out often ranges from $250 to $600 depending on tank size, access, and local disposal fees.'],
      ['How much does it cost to install a septic tank?', 'A complete basic system often lands around $3,500 to $12,500, while engineered systems can reach $15,000 to $22,000 or more.'],
      ['How much does it cost to replace only the tank?', 'Tank-only replacement often ranges from $3,000 to $7,000 when the drain field is reusable and access is straightforward.']
    ]
  },
  {
    key: 'roofing',
    path: 'roofing-cost/calculator/index.html',
    url: '/roofing-cost/calculator/',
    title: 'Roofing Cost Calculator',
    metaTitle: 'Roofing Cost Calculator | 2026 Roof Replacement Price',
    metaDescription: 'Calculate roof replacement cost from roofing material, footprint, pitch, tear-off, and complexity.',
    keyword: 'roofing cost calculator',
    accent: 'amber',
    snippet: 'Roof replacement pricing is driven by material, surface area, pitch, tear-off requirements, decking condition, and roof complexity. This calculator estimates a practical planning range before contractor bids.',
    intro: 'Roofing estimates are more accurate when the calculator accounts for pitch and tear-off, not only house footprint. Use this tool to compare asphalt and metal roof budgets.',
    calculator: roofingCalculator(),
    sections: [
      section('Key Cost Drivers in Roof Replacement', [
        'Material choice changes the installed cost and expected service life. 3-tab asphalt is usually the budget option, architectural asphalt is the common middle tier, and standing seam metal is a premium long-life system.',
        'Pitch increases actual roof surface area and can slow production when crews need additional fall-protection setup.',
        table([
          ['Material', 'Average Installed Cost', 'Typical Lifespan'],
          ['Basic 3-tab asphalt', '$4 - $6 per sq. ft.', '15 - 25 years'],
          ['Architectural asphalt', '$4.50 - $8 per sq. ft.', '20 - 30 years'],
          ['Standing seam metal', '$8 - $14 per sq. ft.', '40 - 70 years'],
          ['Natural slate', '$15 - $30 per sq. ft.', '60 - 100+ years']
        ])
      ]),
      contractorGuidelines([
        'Confirm tear-off, dumpster, driveway protection, and daily clean-up responsibilities.',
        'Specify underlayment, drip edge, flashing, and ice/water shield details in writing.',
        'Separate manufacturer material warranties from contractor workmanship warranties.'
      ])
    ],
    faqs: [
      ['How much does it cost to replace a shingle roof?', 'Many asphalt shingle roof replacements range from $7,500 to $16,000, with larger or steeper projects costing more.'],
      ['How much does it cost to replace a metal roof?', 'Metal roof installation commonly ranges from $12,000 to $28,000, with premium standing seam systems priced higher per square foot.'],
      ['What should be included in a roof quote?', 'A quote should list tear-off, underlayment, flashing, primary roofing material, ventilation, clean-up, warranties, and any decking replacement rate.']
    ]
  },
  {
    key: 'hvac',
    path: 'hvac-cost/replacement-calculator/index.html',
    url: '/hvac-cost/replacement-calculator/',
    title: 'HVAC Replacement Cost Calculator',
    metaTitle: 'HVAC Replacement Cost Calculator | 2026 Systems Price Estimator',
    metaDescription: 'Estimate HVAC replacement costs from system type, home size, SEER2 efficiency, and ductwork status.',
    keyword: 'hvac replacement cost',
    accent: 'emerald',
    snippet: 'HVAC replacement costs depend on system type, home size, equipment efficiency, ductwork condition, and local code requirements. This calculator gives a planning range, not a Manual J design.',
    intro: 'Heating and cooling replacement is an integrated equipment and air-distribution project. Use this estimator to compare split systems, heat pumps, and furnace-only replacement.',
    calculator: hvacCalculator(),
    sections: [
      section('Technical Factors That Determine HVAC Invoices', [
        'Equipment sizing should be confirmed with a Manual J load calculation rather than guessed from the old unit.',
        'Higher SEER2 equipment costs more upfront but can reduce energy use in the right home and climate.',
        table([
          ['System Class', 'Average Installed Range', 'Best Application'],
          ['Standard gas furnace', '$3,000 - $6,500', 'Cold climates with gas service'],
          ['Central air conditioner', '$3,500 - $7,500', 'Cooling-focused replacement'],
          ['Air-source heat pump', '$6,000 - $13,000', 'All-electric heating and cooling'],
          ['Complete HVAC plus ducts', '$9,000 - $18,000+', 'Older homes or major retrofits']
        ])
      ]),
      contractorGuidelines([
        'Ask for a written Manual J load calculation.',
        'Verify EPA Section 608 refrigerant handling certification.',
        'Confirm the AHRI matched system number for split-system replacements.'
      ])
    ],
    faqs: [
      ['How much does it cost to replace an HVAC system?', 'A complete residential HVAC replacement often ranges from $6,000 to $12,500, with ductwork or high-efficiency upgrades increasing the total.'],
      ['How much does it cost to replace a furnace?', 'Furnace-only replacement commonly ranges from $2,500 to $6,500 depending on capacity, efficiency, venting, and access.'],
      ['How much does it cost to install an electric heat pump?', 'Air-source heat pump installation often ranges from $5,500 to $13,000 depending on size, efficiency, and electrical requirements.']
    ]
  },
  {
    key: 'plumbing',
    path: 'plumbing-cost/service-estimator/index.html',
    url: '/plumbing-cost/service-estimator/',
    title: 'Plumbing Cost Estimator',
    metaTitle: 'Plumbing Cost Estimator | 2026 Repair & Installation Rates',
    metaDescription: 'Estimate plumbing service costs for fixture work, water heater replacement, drain clearing, and emergency repair.',
    keyword: 'plumbing cost estimator',
    accent: 'emerald',
    snippet: 'Plumbing repair pricing depends on service type, fixture count, urgency, access, and local labor rates. This calculator provides a practical planning range before a licensed plumber inspects the issue.',
    intro: 'Plumbing work can be a simple fixture swap or a disruptive access problem hidden behind walls, slabs, or landscaping. Use this tool to estimate common residential service budgets.',
    calculator: plumbingCalculator(),
    sections: [
      section('Primary Cost Variables in Plumbing Invoices', [
        'Material and access drive the labor. PEX can be faster to route than copper, while slab leaks or buried sewer failures require demolition or excavation.',
        'Emergency dispatch adds overhead because technicians are pulled from after-hours rotations.',
        table([
          ['Service', 'Average Range', 'Typical Window'],
          ['Fixture swap or repair', '$150 - $450', '1 - 2 hours'],
          ['Main drain hydro-jetting', '$350 - $900', '2 - 4 hours'],
          ['Tank water heater replacement', '$1,200 - $2,500', '3 - 5 hours'],
          ['Emergency slab leak repair', '$2,000 - $5,000+', '1 - 3 days']
        ])
      ]),
      contractorGuidelines([
        'Verify active plumbing licensing for your jurisdiction.',
        'Clarify flat-rate pricing versus hourly billing before work begins.',
        'Request video inspection evidence before approving sewer excavation.'
      ])
    ],
    faqs: [
      ['How much do plumbers charge per hour?', 'Licensed plumbers often charge $45 to $150 per hour, plus a service call or diagnostic fee in many markets.'],
      ['How much does water heater replacement cost?', 'A standard tank water heater replacement often ranges from $1,200 to $2,500, while tankless systems can cost more.'],
      ['How much does a main sewer backup cost to fix?', 'Basic snaking may cost $200 to $450, hydro-jetting often ranges from $400 to $900, and collapsed lines can require much larger excavation budgets.']
    ]
  }
];

const pages = [
  homepage(),
  ...calculators.map(calculatorPage),
  aboutPage(),
  contactPage(),
  privacyPage(),
  termsPage()
];

for (const page of pages) {
  const target = join(root, page.path);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, page.html, 'utf8');
}

function layout({ title, metaTitle, metaDescription, url, keyword, body, schema = [], extraHead = '' }) {
  const absolute = site.domain + url;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.domain
    },
    ...schema
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(metaTitle || title)}</title>
  <meta name="description" content="${escapeHtml(metaDescription)}">
  <meta name="robots" content="index,follow">
  <link rel="canonical" href="${absolute}">
  <meta property="og:title" content="${escapeHtml(metaTitle || title)}">
  <meta property="og:description" content="${escapeHtml(metaDescription)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${absolute}">
  <link rel="icon" type="image/svg+xml" href="/assets/images/icon.svg">
  <link rel="icon" type="image/png" href="/assets/images/icon.png">
  <link rel="apple-touch-icon" href="/assets/images/icon.png">
  ${extraHead}
  <link rel="preload" href="/assets/css/styles.css" as="style">
  <link rel="stylesheet" href="/assets/css/styles.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header class="border-b border-dashed border-dashed relative z-50">
    <div class="site-shell flex items-center justify-between py-4">
      <div class="flex items-center">
        <a href="/" class="font-serif text-3xl font-normal tracking-tight text-ink pr-6 md:pr-10 md:border-r md:border-dashed">
          ${site.name}
        </a>
      </div>
      
      <button id="mobile-menu-toggle" class="md:hidden flex items-center p-2 text-ink" aria-label="Toggle Navigation">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
      </button>

      <nav aria-label="Primary navigation" class="hidden md:flex flex-wrap gap-x-4 gap-y-2 items-center pl-6 text-sm lg:text-base lg:gap-x-6">
        ${nav.map(([href, label]) => `<a class="nav-link font-medium text-ink hover:text-brand transition-colors" href="${href}">${label}</a>`).join('')}
      </nav>
    </div>

    <div id="mobile-menu" class="hidden absolute top-full left-0 right-0 mx-auto max-w-sm mt-2 p-6 bg-ivory border border-dashed rounded-xl shadow-soft md:hidden">
      <div class="flex flex-col gap-4 text-center">
        ${nav.map(([href, label]) => `<a class="text-xl font-serif text-ink hover:text-brand" href="${href}">${label}</a>`).join('')}
      </div>
    </div>
  </header>
  ${body}
  <footer class="border-t border-dashed border-dashed py-10 mt-10">
    <div class="site-shell grid gap-8 md:grid-cols-[1.5fr_1fr]">
      <div>
        <p class="font-serif text-lg text-ink">${site.name}</p>
        <p class="mt-3 max-w-2xl text-sm text-ink/70">Free planning calculators for residential repair budgets. Estimates are educational planning ranges and are not binding contractor bids, engineering reports, or legal advice.</p>
      </div>
      <nav aria-label="Footer navigation" class="grid grid-cols-2 gap-3">
        <a class="footer-link" href="/about/">About</a>
        <a class="footer-link" href="/contact/">Contact</a>
        <a class="footer-link" href="/privacy-policy/">Privacy Policy</a>
        <a class="footer-link" href="/terms-of-service/">Terms of Service</a>
      </nav>
    </div>
  </footer>
  <script>
    const btn = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (btn && menu) {
      btn.addEventListener('click', () => {
        menu.classList.toggle('hidden');
        if(menu.classList.contains('hidden')) {
          btn.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>';
        } else {
          btn.innerHTML = '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>';
        }
      });
    }
  </script>
  <script src="/assets/js/site.js" defer></script>
</body>
</html>`;
}

function hero(page) {
  return `<section class="hero-band">
  <div class="site-shell py-14 md:py-20">
    <p class="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-brand">${escapeHtml(page.keyword)}</p>
    <h1 class="max-w-4xl font-serif text-4xl font-normal leading-tight tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">${escapeHtml(page.title)}</h1>
    <p class="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80">${escapeHtml(page.intro)}</p>
    <div class="semantic-snippet">${escapeHtml(page.snippet)}</div>
  </div>
</section>`;
}

function calculatorPage(page) {
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      '@id': `${site.domain}${page.url}#webapp`,
      url: `${site.domain}${page.url}`,
      name: page.title,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      about: { '@type': 'Thing', name: 'Home Repair Estimation Metrics' }
    },
    faqSchema(page.faqs)
  ];

  const body = `${hero(page)}
<main>
  <section class="site-shell grid gap-8 py-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)] lg:items-start">
    <article class="calculator-panel" aria-labelledby="${page.key}-calculator-heading">
      <div class="mb-6 flex items-center justify-between gap-4">
        <h2 id="${page.key}-calculator-heading">Calculate Real-Time Costs</h2>
        <p class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600" data-progress>Step 1 of 3</p>
      </div>
      ${page.calculator}
    </article>
    ${leadPanel(page)}
  </section>
  <article class="site-shell article-body pb-16">
    ${page.sections.join('\n')}
    ${faqBlock(page.faqs)}
  </article>
</main>`;

  return {
    path: page.path,
    html: layout(pageMeta(page, body, schema))
  };
}

function pageMeta(page, body, schema) {
  return {
    title: page.title,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    url: page.url,
    keyword: page.keyword,
    body,
    schema
  };
}

function foundationCalculator() {
  return calculatorShell('foundation', `
    ${step(1, 'Physical Symptom Profiling', `
      ${radioCards('crackType', [
        ['hairline', 'Hairline / Vertical Fracture', 'Width less than 1/8 inch. Common concrete shrinkage or minor early settling.', true],
        ['stair', 'Diagonal / Stair-Step Fracture', 'Runs through brick or block mortar joints and may indicate localized settlement.'],
        ['horizontal', 'Horizontal Fracture', 'Runs across basement, slab, or crawlspace walls and may indicate lateral soil pressure.']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Spatial Quantity Profiling', `
      ${numberInput('zones', 'How many distinct crack zones require remediation?', 1, 20, 1)}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Geographic Cost Indexing', `
      ${zipInput()}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function pierBeamCalculator() {
  return calculatorShell('pierbeam', `
    ${step(1, 'Structural Repair Scope', `
      ${radioCards('scope', [
        ['reshim', 'Minor Reshimming & Stabilization', 'Existing piers are sound. Requires steel or hardwood shims to level joists.', true],
        ['timber', 'Leveling with Timber Remediation', 'Includes leveling plus replacement of minor rotten beams, sill plates, or joists.'],
        ['underpin', 'Pier Reconstruction / Underpinning', 'Requires lifting, replacing broken piers, or adding deeper footers.']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Foundation Footprint', `
      ${rangeInput('area', 'Total Footprint Area of the Structure', 600, 4000, 100, 1500, 'sq. ft.')}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Crawl Space Access Context', `
      ${selectInput('clearance', 'Local Crawl Space Access', [
        ['standard', 'Standard accessible clearance greater than 18 inches'],
        ['tight', 'Tight or restricted clearance less than 18 inches']
      ])}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function septicCalculator() {
  return calculatorShell('septic', `
    ${step(1, 'Property Sizing / Volume Metrics', `
      ${selectInput('bedrooms', 'Bedrooms / Tank Volume', [
        ['1-2', '1 to 2 bedrooms / 750 gallon tank'],
        ['3-4', '3 to 4 bedrooms / 1,000 gallon tank', true],
        ['5', '5 bedrooms / 1,200 gallon tank'],
        ['6plus', '6+ bedrooms / 1,500 gallon tank']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Tank Engineering Material', `
      ${radioCards('material', [
        ['concrete', 'Precast Concrete Tank', 'Durable and long-lived; requires heavy equipment access.', true],
        ['plastic', 'Polyethylene / Plastic Tank', 'Lightweight and corrosion-resistant with easier positioning.'],
        ['fiberglass', 'Fiberglass Tank', 'Durable and useful where soils may shift.']
      ])}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Mechanical System Architecture', `
      ${selectInput('system', 'Treatment System Type', [
        ['conventional', 'Conventional anaerobic gravity system'],
        ['aerobic', 'Aerobic treatment system'],
        ['mound', 'Engineered mound or pressure distribution system']
      ])}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function roofingCalculator() {
  return calculatorShell('roofing', `
    ${step(1, 'Material Selection', `
      ${radioCards('material', [
        ['asphalt3', 'Basic 3-Tab Asphalt Shingles', 'Budget option with a typical lifespan of 15 to 25 years.', true],
        ['architectural', 'Premium Architectural Shingles', 'Dimensional profile with better wind resistance and 20 to 30 year lifespan.'],
        ['metal', 'Standing Seam Metal Roofing', 'Premium interlocking panel system with 40 to 70 year lifespan.']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Footprint Area & Pitch Factors', `
      ${rangeInput('area', 'Estimated Ground Floor Footprint Area', 1000, 4000, 100, 2000, 'sq. ft.')}
      ${radioCards('pitch', [
        ['low', 'Low Slope / Flat Roof', 'Area multiplier accounts for a simpler low-slope profile.'],
        ['standard', 'Standard Walkable Slope', 'Common gable or hip roof profile.', true],
        ['steep', 'Steep / Non-Walkable Slope', 'Includes extra surface area and safety rigging labor.']
      ])}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Structural Complexity Adjustments', `
      ${checkbox('tearoff', 'Existing roof requires full tear-off and disposal')}
      ${checkbox('complex', 'Multiple valleys, skylights, or chimney penetrations are present')}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function hvacCalculator() {
  return calculatorShell('hvac', `
    ${step(1, 'System Configuration Archetype', `
      ${radioCards('systemType', [
        ['split', 'Complete Split System', 'Central AC plus gas furnace for standard dual-fuel replacement.', true],
        ['heatpump', 'Electric Heat Pump System', 'All-electric heating and cooling with inverter options.'],
        ['furnace', 'Furnace Change-Out Only', 'Replaces only the heating unit while retaining compatible AC components.']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Living Space Footprint', `
      ${rangeInput('area', 'Total Conditioned Living Space', 1000, 4000, 100, 1800, 'sq. ft.')}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Efficiency & Air Duct Status', `
      ${selectInput('efficiency', 'SEER2 Efficiency Rating', [
        ['standard', 'Standard efficiency / 14-15 SEER2'],
        ['high', 'High efficiency / 16-18 SEER2'],
        ['ultra', 'Ultra-high inverter efficiency / 19+ SEER2']
      ])}
      ${checkbox('ducts', 'Requires new air duct installation or extensive duct repairs')}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function plumbingCalculator() {
  return calculatorShell('plumbing', `
    ${step(1, 'Core Service Category', `
      ${radioCards('service', [
        ['fixture', 'Standard Fixture Repair / Replacement', 'Faucet, toilet, garbage disposal, or internal valve work.', true],
        ['waterheater', 'Water Heater Replacement', 'Standard 40 to 50-gallon tank water heater swap.'],
        ['drain', 'Main Drain Line Clog / Hydro-Jetting', 'Heavy snake or hydro-jetting service for main sewer backup.'],
        ['emergency', 'Emergency Burst Pipe Dispatch', 'Immediate isolation and repair of active water or sewer rupture.']
      ])}
      ${stepNav(false, true)}
    `)}
    ${step(2, 'Severity & Fixture Count', `
      ${numberInput('quantity', 'Number of fixture units or repair zones', 1, 5, 1)}
      ${radioCards('timing', [
        ['standard', 'Standard Scheduled Business Hours', 'Normal service timing and dispatch.', true],
        ['afterhours', 'After-Hours / Weekend Emergency Call', 'Includes emergency timing multiplier.']
      ])}
      ${stepNav(true, true)}
    `)}
    ${step(3, 'Geographic Labor Indexing', `
      ${zipInput()}
      ${resultPanel()}
      ${estimateEmailForm()}
      ${stepNav(true, false)}
    `)}
  `);
}

function calculatorShell(key, inner) {
  return `<div data-calculator="${key}">
  <div data-calculator-form class="space-y-6">
    ${inner}
  </div>
</div>`;
}

function step(number, label, inner) {
  return `<section class="calc-step${number === 1 ? ' is-active' : ''}" data-step="${number}"${number === 1 ? '' : ' hidden'}>
  <span class="step-label">Step ${number}: ${label}</span>
  <div class="space-y-5">${inner}</div>
</section>`;
}

function radioCards(name, items) {
  return `<fieldset class="choice-grid">
    <legend class="sr-only">${name}</legend>
    ${items.map(([value, title, detail, checked]) => `<label class="choice-card">
      <input type="radio" name="${name}" value="${value}"${checked ? ' checked' : ''}>
      <span><strong>${title}</strong><span>${detail}</span></span>
    </label>`).join('')}
  </fieldset>`;
}

function rangeInput(name, label, min, max, stepValue, value, suffix) {
  return `<label class="block">
    <span class="mb-2 block text-sm font-bold text-slate-700">${label}: <strong class="text-[#8b5036]" data-range-output="${name}">${value.toLocaleString('en-US')}</strong> ${suffix}</span>
    <input class="w-full accent-emerald-500" type="range" name="${name}" min="${min}" max="${max}" step="${stepValue}" value="${value}">
  </label>`;
}

function numberInput(name, label, min, max, value) {
  return `<label class="block">
    <span class="mb-2 block text-sm font-bold text-slate-700">${label}</span>
    <input class="form-control" type="number" name="${name}" min="${min}" max="${max}" value="${value}" inputmode="numeric">
  </label>`;
}

function zipInput() {
  return `<label class="block">
    <span class="mb-2 block text-sm font-bold text-slate-700">Enter your 5-digit US ZIP code</span>
    <input class="form-control" type="text" name="zip" pattern="[0-9]{5}" minlength="5" maxlength="5" placeholder="90210" inputmode="numeric" autocomplete="postal-code">
  </label>`;
}

function selectInput(name, label, options) {
  return `<label class="block">
    <span class="mb-2 block text-sm font-bold text-slate-700">${label}</span>
    <select class="form-control" name="${name}">
      ${options.map(([value, text, selected]) => `<option value="${value}"${selected ? ' selected' : ''}>${text}</option>`).join('')}
    </select>
  </label>`;
}

function checkbox(name, text) {
  return `<label class="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
    <input class="mt-1 h-4 w-4 accent-emerald-500" type="checkbox" name="${name}">
    <span class="text-sm font-semibold text-slate-800">${text}</span>
  </label>`;
}

function resultPanel() {
  return `<section class="result-box" data-result-panel>
    <h3>Your Planning Estimate</h3>
    <output class="estimate-value" data-result>$0 - $0</output>
    <p class="mt-2 text-sm text-slate-700" data-result-summary>Adjust inputs to refine your estimate.</p>
    <p class="mt-3 text-xs leading-relaxed text-slate-500">This is an educational planning range, not a binding quote or professional engineering assessment.</p>
  </section>`;
}

function estimateEmailForm() {
  return `<form data-estimate-email class="mt-6 rounded-lg border border-slate-200 bg-white p-5">
    <h3>Email My Itemized Estimate</h3>
    <p class="mt-2 text-sm text-slate-600">Optional: send the current estimate details to your inbox for project planning.</p>
    <div class="honeypot" aria-hidden="true"><label>Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
    <input type="hidden" name="projectType">
    <input type="hidden" name="estimatedCost">
    <input type="hidden" name="estimatePayload">
    <div class="mt-4 grid gap-3 md:grid-cols-2">
      <label><span class="sr-only">Name</span><input class="form-control" name="firstName" placeholder="Name" required></label>
      <label><span class="sr-only">Email</span><input class="form-control" type="email" name="email" placeholder="Email" required></label>
      <label class="md:col-span-2"><span class="sr-only">Phone</span><input class="form-control" type="tel" name="phone" placeholder="Optional: Enter your number for text copy alerts"></label>
    </div>
    <button class="btn-primary mt-4" type="submit">Email Me My Itemized Estimate PDF</button>
    <p class="mt-3 text-sm text-slate-600" data-form-status aria-live="polite"></p>
  </form>`;
}

function stepNav(showPrev, showNext) {
  return `<div class="flex flex-wrap gap-3 pt-2">
    ${showPrev ? '<button class="btn-secondary" type="button" data-prev>Back</button>' : ''}
    ${showNext ? '<button class="btn-primary" type="button" data-next>Continue</button>' : ''}
  </div>`;
}

function leadPanel(page) {
  return `<aside class="rounded-3xl border border-dashed border-dashed bg-[#f3f0e6] p-8 lg:sticky lg:top-6" aria-label="Local contractor quote information">
    <h2 class="font-serif text-3xl font-normal tracking-tight text-ink">Compare Local Contractor Quotes</h2>
    <p class="mt-4 text-base leading-relaxed text-ink/80">Local permits, access, materials, and code requirements can move real bids beyond any online planning model. Use your estimate as a baseline before speaking with licensed local providers.</p>
    <div class="mt-6 rounded-xl bg-white p-6 shadow-sm border border-dashed border-dashed text-ink">
      <p class="font-bold text-ink">Affiliate quote form placeholder</p>
      <p class="mt-2 text-sm text-ink/70">Insert the approved pay-per-lead widget here when the partner script or iframe endpoint is available.</p>
    </div>
  </aside>`;
}

function section(title, blocks) {
  return `<section class="content-card">
    <h2>${title}</h2>
    <div class="mt-5 space-y-5">${blocks.map(block => typeof block === 'string' && !block.trim().startsWith('<') ? `<p>${block}</p>` : block).join('\n')}</div>
  </section>`;
}

function table(rows) {
  const [head, ...body] = rows;
  return `<div class="overflow-x-auto"><table>
    <thead><tr>${head.map(cell => `<th>${cell}</th>`).join('')}</tr></thead>
    <tbody>${body.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

function bulletList(items) {
  return `<ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>`;
}

function contractorGuidelines(items) {
  return section('Professional Guidelines for Reviewing Contractor Bids', [bulletList(items)]);
}

function faqBlock(faqs) {
  return `<section class="mt-16 mx-auto max-w-4xl">
    <h2 class="text-center font-serif text-4xl mb-12 text-ink">Frequently Asked Questions</h2>
    <div class="faq-list border-t border-dashed border-dashed">
      ${faqs.map(([q, a], i) => `
        <details class="group border-b border-dashed border-dashed py-6 [&_summary::-webkit-details-marker]:hidden">
          <summary class="flex cursor-pointer items-center justify-between gap-4 font-medium text-brand">
            <div class="flex items-center gap-6">
              <span class="text-brand font-serif text-xl">${String(i+1).padStart(2, '0')}</span>
              <span class="text-brand text-lg">${q}</span>
            </div>
            <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-dashed border-brand/50 bg-brand/10 text-brand group-open:rotate-180 transition-transform">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </span>
          </summary>
          <div class="mt-4 pl-12 pr-12 text-ink/80 leading-relaxed">${a}</div>
        </details>
      `).join('')}
    </div>
  </section>`;
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(([name, text]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text }
    }))
  };
}

function homepage() {
  const cards = calculators.map(page => `
    <article class="directory-card">
      <h2 class="text-xl">${page.title.replace(' Cost Calculator', '').replace(' Calculator', '')}</h2>
      <p class="mt-3 text-sm">${page.snippet}</p>
      <a class="mt-5 inline-flex text-sm font-bold text-[#8b5036] hover:underline" href="${page.url}">Launch calculator</a>
    </article>`).join('');

  const body = `<section class="bg-[#e8e2c4]">
    <div class="site-shell grid min-h-[calc(100vh-80px)] gap-10 py-10 lg:grid-cols-[0.9fr_1.35fr] lg:items-center lg:py-12">
      <div class="relative z-10">
        <p class="mb-8 text-sm font-semibold uppercase tracking-[0.28em] text-[#8b5036]">home repair cost estimator</p>
        <h1 class="max-w-2xl font-serif text-4xl font-normal leading-[1.06] tracking-tight text-slate-950 sm:text-5xl md:text-5xl lg:text-[3.75rem]">Smart Home Estimate</h1>
        <p class="mt-8 max-w-xl text-lg leading-relaxed text-slate-700">Estimate high-ticket residential repair budgets with focused calculators for roofing, foundations, septic systems, HVAC, and plumbing.</p>
        <div class="mt-8 rounded-2xl border border-[#8b5036]/20 bg-white/70 p-5 text-sm leading-relaxed text-slate-700 shadow-[0_24px_70px_rgba(80,50,35,0.14)] backdrop-blur">This hub provides free planning ranges for major home repair categories. Each calculator uses visible project variables and simple regional multipliers so homeowners can prepare before requesting local bids.</div>
        <a class="mt-8 inline-flex min-h-12 items-center rounded-full bg-[#8b5036] px-7 text-sm font-bold text-white shadow-[0_14px_32px_rgba(139,80,54,0.28)] transition hover:bg-[#73402b] focus:outline-none focus:ring-4 focus:ring-[#8b5036]/25" href="#calculator-directory">Explore Calculators</a>
      </div>
      <div class="relative">
        <div class="absolute -left-5 top-10 hidden h-52 w-52 rounded-full border border-[#8b5036]/20 lg:block"></div>
        <figure class="relative overflow-hidden rounded-[1.75rem] bg-white p-3 shadow-[0_30px_90px_rgba(51,35,27,0.24)]">
          <img src="/assets/images/aerial-property-roof-optimization-estimate.webp" width="2206" height="1445" loading="eager" fetchpriority="high" decoding="async" title="Smart Home Estimate – Automated Property Structural Valuation Hub" alt="Aerial drone rendering of residential property structures displaying dynamic automated cost estimates and local roof profile planning metrics." class="aspect-[2206/1445] w-full rounded-[1.25rem] object-cover">
        </figure>
        <div class="absolute -bottom-8 left-4 right-4 md:right-auto md:-bottom-6 md:left-6 md:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-[0_22px_60px_rgba(51,35,27,0.20)]">
          <p class="text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.18em] text-[#8b5036]">preliminary estimate</p>
          <p class="mt-1 md:mt-2 text-lg md:text-xl font-bold tracking-tight text-slate-950">$24k - $54k roof scenarios</p>
          <p class="mt-1 md:mt-2 text-xs md:text-sm text-slate-600">Planning data before contractor calls.</p>
        </div>
      </div>
    </div>
  </section>
  <main>
    <section id="calculator-directory" class="site-shell py-12">
      <h2>Select Your Core Structural System Category</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">${cards}</div>
    </section>
    <section class="site-shell article-body pb-16">
      ${section('Why Use Variable-Driven Calculators?', [
        'Static national averages often miss the reality of local labor rates, material availability, access conditions, and code requirements. These tools expose the major variables so users understand why bids differ.',
        bulletList(['Dynamic sizing based on square footage, bedroom count, quantity, or system type.', 'Regional cost indexing where ZIP code is relevant.', 'Plain-language diagnostic choices instead of contractor jargon.'])
      ])}
      ${faqBlock([
        ['How accurate are these calculators?', 'They provide planning ranges based on simplified field variables. Final pricing requires an on-site inspection and a written contractor scope.'],
        ['Why do local contractor quotes differ from online averages?', 'Insurance, labor, disposal, permits, access, and local code rules can create meaningful regional price differences.'],
        ['Is there a fee to use the calculators?', 'No. The baseline estimate tools are open-access and do not require payment or email submission.']
      ])}
    </section>
  </main>`;

  return {
    path: 'index.html',
    html: layout({
      title: 'Smart Home Estimate',
      metaTitle: 'Smart Home Estimate | 2026 Guides',
      metaDescription: 'Estimate high-ticket home repair costs with free static calculators for roofing, foundation, septic, HVAC, and plumbing projects.',
      url: '/',
      keyword: 'home repair cost estimator',
      body,
      extraHead: '<link rel="preload" as="image" href="/assets/images/aerial-property-roof-optimization-estimate.jpg" imagesrcset="/assets/images/aerial-property-roof-optimization-estimate.jpg">',
      schema: [faqSchema([
        ['How accurate are these calculators?', 'They provide planning ranges based on simplified field variables. Final pricing requires an on-site inspection and a written contractor scope.'],
        ['Is there a fee to use the calculators?', 'No. The baseline estimate tools are open-access and do not require payment or email submission.']
      ])]
    })
  };
}

function aboutPage() {
  const body = `${simpleHero('About Our Editorial Standards & Estimation Practices', 'Learn how the calculators are structured, reviewed, and framed for responsible homeowner planning.', 'Our calculators are built to make early budgeting more transparent. They are educational software tools, not a substitute for professional inspection, engineering, or binding contractor bids.')}
  <main class="site-shell article-body py-12">
    <section class="rounded-r-2xl border-l-4 border-dashed border-brand bg-brand/5 p-6 text-ink shadow-[0_24px_70px_rgba(5,67,43,0.10)]">
      <h2>Our Estimation Approach</h2>
      <p class="mt-3">The platform uses visible property variables, trade-specific formulas, and conservative regional indexing to help homeowners prepare for informed contractor conversations.</p>
    </section>
    ${section('The Engineering Behind the Calculators', [
      bulletList(['Variable-driven math instead of one flat national average.', 'Clear assumptions exposed through form inputs and result summaries.', 'Quarterly-ready data structures so cost assumptions can be reviewed as material and labor conditions change.'])
    ])}
    ${section('Why Pricing Transparency Matters', [
      'Major home repairs are stressful and expensive. A neutral planning range helps users recognize when a bid is plausible, when the scope needs clarification, and when a licensed specialist should inspect the property.'
    ])}
    ${faqBlock([
      ['Who manages the calculations?', 'The formulas are maintained as editorial software assumptions for planning purposes and should be reviewed periodically against current market data.'],
      ['How often should costs be updated?', 'The cost arrays are structured so they can be reviewed quarterly or whenever material, labor, or code conditions shift materially.'],
      ['Are you affiliated with contractors?', 'The site is an independent informational resource. Any third-party quote routing is governed by the partner network terms and disclosures.']
    ])}
  </main>`;
  return staticPage('about/index.html', '/about/', 'About Our Editorial Standards & Structural Estimation Practices', 'Learn how our home repair calculators are structured, reviewed, and responsibly presented.', body);
}

function contactPage() {
  const body = `${simpleHero('Contact Our Project Estimation & Editorial Team', 'Submit technical feedback, calculator corrections, or general site inquiries.', 'Use this channel for website and editorial questions. For precise repair pricing, request an inspection from a licensed local contractor.')}
  <main class="site-shell py-12">
    <section class="mx-auto max-w-xl content-card">
      <h2>Submit Your Message Online</h2>
      <form data-contact-form class="mt-6 space-y-4">
        <div class="honeypot" aria-hidden="true"><label>Company <input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>
        <label class="block"><span class="mb-2 block text-sm font-bold text-ink/80">Full Name</span><input class="form-control" type="text" name="name" placeholder="John Doe" required></label>
        <label class="block"><span class="mb-2 block text-sm font-bold text-ink/80">Email Address</span><input class="form-control" type="email" name="email" placeholder="john@smarthomeestimate.com" required></label>
        ${selectInput('inquiry', 'Inquiry Classification', [
          ['feedback', 'General Website Feedback / Technical Glitch Report'],
          ['pricing', 'Calculator Logic / Structural Pricing Corrections'],
          ['network', 'Local Contractor Lead Network Inquiries']
        ])}
        <label class="block"><span class="mb-2 block text-sm font-bold text-slate-700">Message</span><textarea class="form-control" name="message" rows="5" placeholder="Type your message here..." required></textarea></label>
        <button class="btn-primary" type="submit">Send Message</button>
        <p class="text-sm text-slate-600" data-form-status aria-live="polite"></p>
      </form>
    </section>
    <section class="mx-auto mt-10 max-w-3xl article-body">
      ${section('Communication Priorities', [
        bulletList(['Technical platform failures are treated as high-priority website issues.', 'Licensed trade professionals can submit pricing corrections for editorial review.', 'Contractor network concerns should include any partner tracking references available.'])
      ])}
    </section>
  </main>`;
  return staticPage('contact/index.html', '/contact/', 'Contact Our Project Estimation & Editorial Team', 'Contact the editorial support team for calculator feedback, corrections, and website inquiries.', body);
}

function privacyPage() {
  const body = `${simpleHero('Privacy Policy', 'Effective Date: June 9, 2026', 'Calculator inputs are processed locally in the browser unless a user voluntarily submits a form to a third-party or serverless endpoint.')}
  <main class="site-shell article-body py-12">
    ${section('1. Information We Collect and Process', [
      'Calculator variables such as square footage, material choices, and symptom selections are processed client-side to produce estimates. ZIP codes may be used to apply broad regional labor multipliers.',
      'Optional email forms submit only the information the user provides for estimate delivery or contractor matching workflows.'
    ])}
    ${section('2. Third-Party Contractor Matching Funnels', [
      'When users interact with clearly labeled quote or affiliate forms, those submissions may be handled by partner networks under their own privacy policies. Users should review partner disclosures before submitting personal information.'
    ])}
    ${section('3. Server Logs, Cookies, and Analytics', [
      table([
        ['Event', 'Data Type', 'Purpose'],
        ['Server telemetry', 'IP address, user agent, timestamps', 'Security and operational reliability'],
        ['Core Web Vitals', 'Performance timings', 'Improving speed and usability'],
        ['Local cookies or storage', 'Small browser values', 'Remembering calculator preferences where enabled']
      ])
    ])}
    ${section('4. Third-Party Links', ['External websites are governed by their own terms and privacy practices.'])}
    ${section('5. Policy Updates', ['This policy may be revised as the platform, compliance requirements, or third-party integrations change.'])}
  </main>`;
  return staticPage('privacy-policy/index.html', '/privacy-policy/', 'Privacy Policy | Smart Home Estimate', 'Review how calculator inputs, optional forms, cookies, and third-party quote tools are handled.', body);
}

function termsPage() {
  const body = `${simpleHero('Terms of Service', 'Effective Date: June 9, 2026', 'The calculators provide educational planning estimates only. They are not binding quotes, engineering reports, legal advice, or contractor-client agreements.')}
  <main class="site-shell article-body py-12">
    ${section('1. Informational Estimator Disclaimer', [
      'All calculators and pricing matrices are preliminary educational tools. Real project costs can vary due to hidden damage, access, code requirements, permits, environmental conditions, and contractor scope.'
    ])}
    ${section('2. No Contractor-Client Relationship', [
      'Using this website does not create a contractor, advisor, engineering, or professional services relationship. The platform does not perform physical repairs or employ field crews.'
    ])}
    ${section('3. Permitted Platform Usage', [
      table([
        ['Prohibited Action', 'Reason'],
        ['Automated scraping', 'Protects site availability and editorial assets'],
        ['Unauthorized commercial framing', 'Prevents misleading third-party presentation'],
        ['Misrepresenting estimates as binding quotes', 'Protects users from incorrect reliance']
      ])
    ])}
    ${section('4. Limitation of Liability', [
      'To the maximum extent allowed by law, the platform is not liable for repair decisions, contractor disputes, budget changes, or property outcomes based on calculator outputs.'
    ])}
    ${section('5. Modifications to Digital Services', [
      'The platform may revise calculators, assumptions, page paths, or integrations as the service evolves.'
    ])}
  </main>`;
  return staticPage('terms-of-service/index.html', '/terms-of-service/', 'Terms of Service & Calculator Disclaimer | Estimation Matrix', 'Review the informational disclaimers and liability boundaries for the home repair calculator platform.', body);
}

function simpleHero(title, intro, snippet) {
  return `<section class="hero-band"><div class="site-shell py-14 md:py-20"><h1 class="max-w-4xl font-serif text-4xl font-normal leading-tight tracking-tight text-ink md:text-5xl lg:text-[3.5rem]">${title}</h1><p class="mt-6 max-w-3xl text-lg leading-relaxed text-ink/80">${intro}</p><div class="semantic-snippet">${snippet}</div></div></section>`;
}

function staticPage(path, url, metaTitle, metaDescription, body) {
  return {
    path,
    html: layout({
      title: metaTitle.replace(' | Smart Home Estimate', '').replace(' | Estimation Matrix', ''),
      metaTitle,
      metaDescription,
      url,
      keyword: 'home repair cost estimator',
      body,
      schema: []
    })
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}


