(() => {
  const script = document.currentScript;
  const menuBase = script ? script.src : location.href;
  const legalPages = [
    ['Privacy policy', 'privacy.html'],
    ['Cookie policy', 'cookies.html'],
    ['Terms of use', 'terms.html'],
    ['Disclaimer', 'disclaimer.html'],
    ['DMCA', 'dmca.html'],
    ['Accessibility', 'accessibility.html'],
    ['Editorial policy', 'editorial.html']
  ];
  document.querySelectorAll('.topbar nav').forEach(nav => {
    if (nav.querySelector('.nav-dropdown')) return;
    const details = document.createElement('details');
    details.className = 'nav-dropdown';
    const summary = document.createElement('summary');
    summary.textContent = 'Resources';
    const panel = document.createElement('div');
    panel.className = 'nav-dropdown-panel';
    panel.setAttribute('aria-label', 'Site policies and information');
    legalPages.forEach(([label, file]) => {
      const link = document.createElement('a');
      link.href = new URL(file, menuBase).href;
      link.textContent = label;
      panel.append(link);
    });
    details.append(summary, panel);
    nav.append(details);
  });
  document.addEventListener('click', event => {
    document.querySelectorAll('.nav-dropdown[open]').forEach(menu => {
      if (!menu.contains(event.target)) menu.open = false;
    });
  });
})();
