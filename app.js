(function () {
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

  function safeNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function computeProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    let remaining = taxableIncome;
    let lowerLimit = 0;
    let total = 0;

    for (const bracket of brackets) {
      const upperLimit = bracket.upTo;
      const taxableAtThisRate = upperLimit === null
        ? remaining
        : Math.min(remaining, upperLimit - lowerLimit);

      if (taxableAtThisRate <= 0) {
        lowerLimit = upperLimit === null ? lowerLimit : upperLimit;
        continue;
      }

      total += taxableAtThisRate * bracket.rate;
      remaining -= taxableAtThisRate;
      if (remaining <= 0) break;
      lowerLimit = upperLimit;
    }

    return total;
  }

  function computeFica(grossSalary, enabled) {
    if (!enabled) return 0;
    const { socialSecurityRate, socialSecurityWageBase, medicareRate } = window.SITE_CONFIG.federalTaxData.fica;
    const socialSecurityTax = Math.min(grossSalary, socialSecurityWageBase) * socialSecurityRate;
    const medicareTax = grossSalary * medicareRate;
    return socialSecurityTax + medicareTax;
  }

  function updateResults() {
    const grossSalary = Math.max(0, safeNumber(document.getElementById('annualSalary').value));
    const filingStatus = document.getElementById('filingStatus').value;
    const includeFica = document.getElementById('includeFica').checked;

    const deduction = window.SITE_CONFIG.federalTaxData.standardDeduction[filingStatus];
    const brackets = window.SITE_CONFIG.federalTaxData.brackets[filingStatus];
    const taxableIncome = Math.max(0, grossSalary - deduction);
    const federalTax = computeProgressiveTax(taxableIncome, brackets);
    const ficaTax = computeFica(grossSalary, includeFica);
    const totalTax = federalTax + ficaTax;
    const netAnnual = Math.max(0, grossSalary - totalTax);

    const values = {
      estimatedFederalTax: federalTax,
      estimatedFica: ficaTax,
      estimatedNetAnnual: netAnnual,
      estimatedNetMonthly: netAnnual / 12,
      estimatedNetBiweekly: netAnnual / 26,
      estimatedNetWeekly: netAnnual / 52
    };

    Object.entries(values).forEach(([id, value]) => {
      document.getElementById(id).textContent = currency.format(value);
    });

    document.getElementById('exampleTaxYear').textContent = window.SITE_CONFIG.taxYearLabel;
  }

  function setDynamicMeta() {
    const titleNodes = document.querySelectorAll('[data-site-title]');
    titleNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.title;
    });
    const yearNodes = document.querySelectorAll('[data-tax-year-label]');
    yearNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.taxYearLabel;
    });
    const emailNodes = document.querySelectorAll('[data-partnerships-email]');
    emailNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.partnershipsEmail;
      if (node.tagName === 'A') {
        node.href = 'mailto:' + window.SITE_CONFIG.partnershipsEmail;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setDynamicMeta();
    renderFooter(window.SITE_CONFIG.domain);

    const form = document.getElementById('calculatorForm');
    if (form) {
      form.addEventListener('input', updateResults);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        updateResults();
      });
      updateResults();
    }
  });
})();
