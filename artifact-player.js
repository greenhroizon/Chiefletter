(function(){
  const id=document.body.dataset.artifactId;
  if(!id)return;
  const artifact=(window.ARTIFACTS||[]).find(item=>item.id===id);
  const root=document.querySelector('[data-artifact-player]');
  if(!artifact||!root)return;
  let current=0,timer=null;
  root.innerHTML=`<div class="artifact-diagram" role="img" aria-label="A four-stage diagram showing ${artifact.title}"><div class="artifact-track">${artifact.stages.map((stage,i)=>`<div class="artifact-node" data-node="${i}"><span class="artifact-node-label">${stage[0]}</span><span class="artifact-node-dot" aria-hidden="true"></span></div>`).join('')}<span class="artifact-packet" aria-hidden="true"></span></div></div><div class="artifact-controls"><button type="button" data-prev>Previous step</button><button type="button" data-play aria-pressed="false">Play animation</button><button type="button" data-next>Next step</button><label>Step <input data-step type="range" min="1" max="${artifact.stages.length}" value="1"><span data-step-count>1 of ${artifact.stages.length}</span></label></div><div class="artifact-explanation" aria-live="polite"><p class="eyebrow" data-stage-label></p><h2 data-stage-title></h2><p data-stage-copy></p></div><p class="artifact-fact"><strong>One useful detail</strong><span>${artifact.fact}</span></p>`;
  const nodes=[...root.querySelectorAll('[data-node]')],range=root.querySelector('[data-step]'),play=root.querySelector('[data-play]');
  function render(){
    const [node,title,copy]=artifact.stages[current];
    nodes.forEach((el,i)=>el.classList.toggle('active',i===current));
    const progress=current/(artifact.stages.length-1)*75;
    root.querySelector('.artifact-track').style.setProperty('--progress',`${progress}%`);
    root.querySelector('.artifact-packet').style.left=`calc(12.5% + ${progress}%)`;
    root.querySelector('[data-stage-label]').textContent=`STEP 0${current+1} / ${artifact.stages.length} · ${node}`;
    root.querySelector('[data-stage-title]').textContent=title;
    root.querySelector('[data-stage-copy]').textContent=copy;
    root.querySelector('[data-step-count]').textContent=`${current+1} of ${artifact.stages.length}`;
    range.value=current+1;
  }
  function stop(){if(timer)clearInterval(timer);timer=null;play.textContent='Play animation';play.setAttribute('aria-pressed','false');}
  root.querySelector('[data-prev]').addEventListener('click',()=>{stop();current=(current-1+artifact.stages.length)%artifact.stages.length;render();});
  root.querySelector('[data-next]').addEventListener('click',()=>{stop();current=(current+1)%artifact.stages.length;render();});
  range.addEventListener('input',()=>{stop();current=Number(range.value)-1;render();});
  play.addEventListener('click',()=>{if(timer){stop();return;}play.textContent='Pause animation';play.setAttribute('aria-pressed','true');timer=setInterval(()=>{current=(current+1)%artifact.stages.length;render();},2200);});
  render();
})();
