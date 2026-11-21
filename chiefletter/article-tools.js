(() => {
  const tool = document.querySelector('[data-article-tool]');
  if (!tool) return;
  const id = tool.dataset.articleTool;
  const key = `chiefletter:article:${id}`;
  const checks = [...tool.querySelectorAll('[data-activity-check]')];
  const note = tool.querySelector('[data-activity-note]');
  const progress = tool.querySelector('[data-activity-progress]');
  const count = tool.querySelector('[data-activity-count]');
  const status = tool.querySelector('[data-activity-status]');
  let saved = { checked: checks.map(() => false), note: '' };

  try {
    const value = localStorage.getItem(key);
    if (value) saved = { ...saved, ...JSON.parse(value) };
  } catch (_) {
    status.textContent = 'Notes are available for this visit. Browser storage is unavailable.';
  }

  note.value = saved.note || '';
  checks.forEach((check, index) => {
    check.checked = Boolean(saved.checked?.[index]);
    check.addEventListener('change', () => {
      saved.checked[index] = check.checked;
      persist();
      updateProgress();
    });
  });

  function updateProgress() {
    const done = checks.filter(check => check.checked).length;
    progress.value = done;
    count.textContent = `${done} of ${checks.length} steps`;
  }

  function persist() {
    try {
      localStorage.setItem(key, JSON.stringify(saved));
    } catch (_) {
      status.textContent = 'Browser storage is unavailable. Your changes last for this visit.';
    }
  }

  tool.querySelector('[data-activity-save]').addEventListener('click', () => {
    saved.note = note.value.trim();
    persist();
    status.textContent = 'Note saved in this browser.';
  });

  tool.querySelector('[data-activity-clear]').addEventListener('click', () => {
    saved = { checked: checks.map(() => false), note: '' };
    checks.forEach(check => { check.checked = false; });
    note.value = '';
    try { localStorage.removeItem(key); } catch (_) {}
    updateProgress();
    status.textContent = 'Activity cleared.';
  });

  updateProgress();
})();
