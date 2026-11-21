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
    tool.querySelector('[data-action-output]')?.replaceChildren();
    if(tool.querySelector('[data-plan-time]'))tool.querySelector('[data-plan-time]').selectedIndex=0;
    try { localStorage.removeItem(key); } catch (_) {}
    updateProgress();
    status.textContent = 'Activity cleared.';
  });

  tool.querySelector('[data-action-plan]')?.addEventListener('click', () => {
    const output=tool.querySelector('[data-action-output]');
    output.replaceChildren();
    const idea=note.value.trim();
    if(!idea){output.textContent='Write one specific thing you want to try first, then build the plan.';return;}
    const next=checks.find(check=>!check.checked)?.parentElement.querySelector('span')?.textContent.replace(/^STEP 0\d\s*/,'').trim()||'Review what worked and choose the next small step.';
    const when=tool.querySelector('[data-plan-time]').value;
    const heading=document.createElement('h3');heading.textContent='Your next step';
    const summary=document.createElement('p');summary.textContent=`${when}: ${idea}`;
    const followup=document.createElement('p');followup.textContent=`Use this check: ${next}`;
    const copy=makeCopyButton(`${when}: ${idea}\nCheck: ${next}`);
    output.append(heading,summary,followup,copy);
  });

  updateProgress();

  document.querySelectorAll('[data-focus-timer]').forEach(timer => {
    let seconds = 25 * 60;
    let interval = null;
    const display = timer.querySelector('[data-timer-display]');
    const toggle = timer.querySelector('[data-timer-toggle]');
    const status = timer.querySelector('[data-timer-status]');
    const draw = () => { display.textContent = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; };
    toggle.addEventListener('click', () => {
      if (interval) { clearInterval(interval); interval = null; toggle.textContent = 'Resume focus'; status.textContent = 'Paused'; return; }
      if (seconds <= 0) seconds = 25 * 60;
      toggle.textContent = 'Pause'; status.textContent = 'Focus session running';
      interval = setInterval(() => { seconds--; draw(); if(seconds<=0){clearInterval(interval);interval=null;toggle.textContent='Start again';status.textContent='Session complete';} }, 1000);
    });
    timer.querySelector('[data-timer-reset]').addEventListener('click', () => { if(interval)clearInterval(interval);interval=null;seconds=25*60;draw();toggle.textContent='Start focus';status.textContent='25 minutes'; });
    draw();
  });

  document.querySelectorAll('[data-career-planner]').forEach(planner => {
    planner.querySelector('[data-plan-build]').addEventListener('click', () => {
      const goal=planner.querySelector('[data-plan-goal]').value.trim();
      const action=planner.querySelector('[data-plan-action]').value.trim();
      const date=planner.querySelector('[data-plan-date]').value;
      const result=planner.querySelector('[data-plan-result]'); result.replaceChildren();
      if(!goal||!action){result.textContent='Add an outcome and one next action to build your plan.';return;}
      const text=`Outcome: ${goal}\nNext action: ${action}${date?`\nDate: ${new Date(`${date}T00:00:00`).toLocaleDateString()}`:''}`;
      const pre=document.createElement('pre');pre.textContent=text;result.append(pre,makeCopyButton(text));
    });
  });

  document.querySelectorAll('[data-problem-note]').forEach(noteForm => {
    noteForm.querySelector('[data-problem-build]').addEventListener('click', () => {
      const fields=[['Goal',noteForm.querySelector('[data-problem-goal]').value],['Observed',noteForm.querySelector('[data-problem-result]').value],['Next check',noteForm.querySelector('[data-problem-next]').value]];
      const filled=fields.filter(([,value])=>value.trim());
      const result=noteForm.querySelector('[data-problem-output]');result.replaceChildren();
      if(!filled.length){result.textContent='Add one observation to make a useful note.';return;}
      const text=filled.map(([label,value])=>`${label}: ${value.trim()}`).join('\n');
      const pre=document.createElement('pre');pre.textContent=text;result.append(pre,makeCopyButton(text));
    });
  });

  document.querySelectorAll('[data-session-planner]').forEach(planner => {
    planner.querySelector('[data-session-build]').addEventListener('click', () => {
      const minutes=Number(planner.querySelector('[data-session-time]').value);
      const steps=[...planner.querySelectorAll('[data-session-source] li')].map(item=>item.textContent);
      const result=planner.querySelector('[data-session-result]');result.replaceChildren();
      const heading=document.createElement('p');heading.textContent=`Use about ${Math.floor(minutes/steps.length)} minutes for each step.`;
      const list=document.createElement('ol');steps.forEach(step=>{const item=document.createElement('li');item.textContent=step;list.append(item);});
      result.append(heading,list);
    });
  });

  function makeCopyButton(text) {
    const button=document.createElement('button');button.type='button';button.className='secondary-button';button.textContent='Copy note';
    button.addEventListener('click',()=>{
      const done=()=>{button.textContent='Copied';setTimeout(()=>button.textContent='Copy note',1200);};
      if(navigator.clipboard?.writeText)navigator.clipboard.writeText(text).then(done).catch(()=>copyFallback(text,done));else copyFallback(text,done);
    });
    return button;
  }
  function copyFallback(text,done){const area=document.createElement('textarea');area.value=text;area.style.position='fixed';area.style.opacity='0';document.body.append(area);area.select();try{document.execCommand('copy');done();}finally{area.remove();}}
})();
