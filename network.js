window.NETWORK_LINKS = [
  { name: 'Calc HQ',                    url: 'https://calc-hq.com/', description: 'Finance calculator network hub', live: true },
  { name: 'BizDayChecker',              url: 'https://bizdaychecker.com/', description: 'Business day calculator', live: true },
  { name: 'Bank Cutoff Checker',        url: 'https://bankcutoffchecker.com/', description: 'Bank cutoff time checker', live: true },
  { name: 'Salary vs Inflation',        url: 'https://salaryvsinflation.com/', description: 'Does your raise beat inflation?', live: true },
  { name: 'Hourly to Salary Calc',      url: 'https://hourly2salarycalc.com/', description: 'Hourly rate to annual salary', live: true },
  { name: 'Payroll Date Checker',       url: 'https://payrolldatechecker.com/', description: 'Payroll processing date calculator', live: true },
  { name: '1099 vs W-2 Calculator',     url: 'https://1099vsw2calc.com/', description: 'Compare contractor vs employee take-home', live: true },
  { name: 'Freelance Income Calc',      url: 'https://freelanceincomecalc.com/', description: 'Freelance rate to annual income', live: true },
  { name: 'Quarterly Tax Calc',         url: 'https://quarterlytaxcalc.com/', description: 'Estimate quarterly estimated taxes', live: true },
  { name: 'Total Comp Calc',            url: 'https://totalcompcalc.com/', description: 'Compare total job offer compensation', live: true },
  { name: 'Overtime Pay Calc',          url: 'https://overtimepaycalc.com/', description: 'Calculate overtime pay', live: true },
  { name: 'After-Tax Salary Calc',      url: 'https://aftertaxsalarycalc.com/', description: 'Estimate after-tax take-home salary', live: true }
];

window.validateNetworkConfig = function validateNetworkConfig() {
  const liveLinks = NETWORK_LINKS.filter(link => link.live);
  const uniqueUrls = new Set(liveLinks.map(link => link.url));
  if (uniqueUrls.size !== liveLinks.length) {
    throw new Error('Duplicate live links found in network.js');
  }
};

window.renderFooter = function renderFooter(currentDomain) {
  validateNetworkConfig();
  const footerTarget = document.getElementById('site-footer');
  if (!footerTarget) {
    return;
  }

  const liveLinks = NETWORK_LINKS
    .filter(link => link.live)
    .filter(link => !link.url.includes(currentDomain));

  const relatedToolsHtml = liveLinks.length
    ? '<ul class="footer-links">' + liveLinks.map(link => (
        '<li><a href="' + link.url + '">' + link.name + '</a><span>' + link.description + '</span></li>'
      )).join('') + '</ul>'
    : '<p class="footer-empty">No related tools are listed yet.</p>';

  footerTarget.innerHTML = `
    <div class="footer-grid">
      <div>
        <h2>Related tools</h2>
        ${relatedToolsHtml}
      </div>
      <div>
        <h2>Contact</h2>
        <p><a href="mailto:${window.SITE_CONFIG.partnershipsEmail}">${window.SITE_CONFIG.partnershipsEmail}</a></p>
      </div>
    </div>
    <p class="footer-meta">${window.SITE_CONFIG.siteName} · Estimates run locally in your browser.</p>
  `;
};
