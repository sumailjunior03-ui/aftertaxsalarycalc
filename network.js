window.FORBIDDEN_DOMAINS = ["tokentodollarmargin.com", "freelanceratecalc.com"];
window.NETWORK_LINKS = [
  { domain: 'calc-hq.com',             name: 'Calc-HQ',                 url: 'https://calc-hq.com/',               description: 'Network hub',                         live: true },
  { domain: 'bizdaychecker.com',       name: 'BizDayChecker.com',       url: 'https://bizdaychecker.com/',         description: 'Business day calculator',            live: true },
  { domain: 'bankcutoffchecker.com',   name: 'BankCutoffChecker.com',   url: 'https://bankcutoffchecker.com/',     description: 'Bank cutoff time checker',           live: true },
  { domain: 'salaryvsinflation.com',   name: 'SalaryVsInflation.com',   url: 'https://salaryvsinflation.com/',     description: 'Does your raise beat inflation?',    live: true },
  { domain: 'hourly2salarycalc.com',   name: 'Hourly2SalaryCalc.com',   url: 'https://hourly2salarycalc.com/',     description: 'Hourly rate to annual salary',       live: true },
  { domain: 'payrolldatechecker.com',  name: 'PayrollDateChecker.com',  url: 'https://payrolldatechecker.com/',    description: 'Payroll processing date calculator', live: true },
  { domain: '1099vsw2calc.com',        name: '1099vsW2Calc.com',        url: 'https://1099vsw2calc.com/',          description: '1099 vs W-2 comparison calculator',  live: true },
  { domain: 'freelanceincomecalc.com', name: 'FreelanceIncomeCalc.com', url: 'https://freelanceincomecalc.com/',   description: 'Freelance rate to annual income',    live: true },
  { domain: 'quarterlytaxcalc.com',    name: 'QuarterlyTaxCalc.com',    url: 'https://quarterlytaxcalc.com/',      description: 'Estimate quarterly estimated taxes', live: true },
  { domain: 'totalcompcalc.com',       name: 'TotalCompCalc.com',       url: 'https://totalcompcalc.com/',         description: 'Compare total job offer compensation', live: true },
  { domain: 'overtimepaycalc.com',     name: 'OvertimePayCalc.com',     url: 'https://overtimepaycalc.com/',       description: 'Calculate overtime pay',             live: true },
  { domain: 'aftertaxsalarycalc.com',  name: 'AfterTaxSalaryCalc.com',  url: 'https://aftertaxsalarycalc.com/',    description: 'Estimate after-tax take-home salary', live: true }
];

(function validateNetwork() {
  var seen = Object.create(null);
  for (var i = 0; i < window.NETWORK_LINKS.length; i++) {
    var item = window.NETWORK_LINKS[i];
    if (!item || !item.domain || !item.name || !item.url || typeof item.live !== 'boolean') {
      throw new Error('Invalid NETWORK_LINKS entry at index ' + i);
    }
    var domain = String(item.domain).toLowerCase();
    if (seen[domain]) {
      throw new Error('Duplicate domain in NETWORK_LINKS: ' + domain);
    }
    if (window.FORBIDDEN_DOMAINS.indexOf(domain) !== -1) {
      throw new Error('Forbidden domain present in NETWORK_LINKS: ' + domain);
    }
    seen[domain] = true;
  }
})();

window.renderSiteHeader = function renderSiteHeader() {
  var headerTargets = document.querySelectorAll('[data-site-header-nav]');
  if (!headerTargets.length) return;

  var navHtml = [
    '<nav class="header-nav" aria-label="Primary">',
    '<a href="/">Home</a>',
    '<a href="/faq.html">FAQ</a>',
    '<a href="/privacy.html">Privacy</a>',
    '<a href="/legal.html">Legal</a>',
    '<a href="/contact.html">Contact</a>',
    '</nav>'
  ].join('');

  for (var i = 0; i < headerTargets.length; i++) {
    headerTargets[i].innerHTML = navHtml;
  }
};

window.renderFooter = function renderFooter(currentDomain) {
  var footerTarget = document.getElementById('site-footer');
  if (!footerTarget) return;

  var host = String(currentDomain || '').toLowerCase();
  var liveLinks = [];
  for (var i = 0; i < window.NETWORK_LINKS.length; i++) {
    var link = window.NETWORK_LINKS[i];
    var domain = String(link.domain).toLowerCase();
    if (link.live !== true) continue;
    if (window.FORBIDDEN_DOMAINS.indexOf(domain) !== -1) continue;
    if (host && domain === host) continue;
    liveLinks.push(link);
  }

  liveLinks.sort(function (a, b) {
    return String(a.name).localeCompare(String(b.name));
  });

  var relatedToolsHtml = '<p class="footer-empty">No related tools are listed yet.</p>';
  if (liveLinks.length) {
    relatedToolsHtml = '<ul class="footer-links">' + liveLinks.map(function (link) {
      return '<li><a href="' + link.url + '">' + link.name + '</a><span>' + link.description + '</span></li>';
    }).join('') + '</ul>';
  }

  footerTarget.innerHTML = [
    '<div class="footer-grid">',
      '<div>',
        '<h2>Site links</h2>',
        '<ul class="footer-nav-links">',
          '<li><a href="/">Home</a></li>',
          '<li><a href="/privacy.html">Privacy Policy</a></li>',
          '<li><a href="/legal.html">Legal</a></li>',
          '<li><a href="/faq.html">FAQ</a></li>',
          '<li><a href="/contact.html">Contact</a></li>',
        '</ul>',
      '</div>',
      '<div>',
        '<h2>Related tools</h2>',
        relatedToolsHtml,
      '</div>',
      '<div>',
        '<h2>Contact</h2>',
        '<p><a href="mailto:' + window.SITE_CONFIG.partnershipsEmail + '">' + window.SITE_CONFIG.partnershipsEmail + '</a></p>',
      '</div>',
    '</div>',
    '<p class="footer-meta">' + window.SITE_CONFIG.siteName + ' · Estimates run locally in your browser.</p>'
  ].join('');
};
