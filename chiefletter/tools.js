(() => {
  const catalog = document.getElementById('tool-catalog');
  const workspace = document.getElementById('tool-workspace');
  const search = document.getElementById('tool-search');
  const categoriesNode = document.getElementById('tool-categories');
  const resultCount = document.getElementById('tool-result-count');
  const singleToolId = document.body.dataset.toolId || '';
  if ((!catalog && !singleToolId) || (singleToolId && !workspace)) return;

  const tools = window.TOOL_LIST || [];
  const toolTotal = document.querySelector('[data-tool-total]');
  if (toolTotal) toolTotal.textContent = tools.length;
  const categories = ['All tools', ...new Set(tools.map(tool=>tool.category))];
  let selectedCategory = 'All tools';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function drawCategories() {
    if (!categoriesNode) return;
    categoriesNode.innerHTML = categories.map(name => {
      const count=name==='All tools'?tools.length:tools.filter(tool=>tool.category===name).length;
      return `<button type="button" class="filter ${name===selectedCategory?'active':''}" data-category="${esc(name)}" aria-pressed="${name===selectedCategory}">${esc(name)} <span>${count}</span></button>`;
    }).join('');
    categoriesNode.querySelectorAll('[data-category]').forEach(button => button.addEventListener('click', () => {
      selectedCategory = button.dataset.category;
      drawCategories();
      drawCatalog();
    }));
  }

  function drawCatalog() {
    if (!catalog || !search) return;
    const query = search.value.trim().toLowerCase();
    const visible = tools.filter(tool => (selectedCategory === 'All tools' || tool.category === selectedCategory) && `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(query));
    const countLabel=visible.length===1?'1 tool':`${visible.length} tools`;
    if(resultCount)resultCount.textContent=`Showing ${countLabel}${query?` for “${search.value.trim()}”`:''}${selectedCategory!=='All tools'?` in ${selectedCategory}`:''}.`;
    catalog.innerHTML = visible.length ? visible.map(tool => `<a class="tool-card" href="tools/${tool.id}/"><span class="tool-card-category">${tool.category}</span><strong>${tool.name}</strong><span>${tool.description}</span><span class="tool-card-link">Open tool</span></a>`).join('') : '<p class="empty">No tools match this search.</p>';
  }

  function openTool(id) {
    const tool = tools.find(item => item.id === id);
    if (!tool || !workspace) return;
    if (id === 'html-css-js-editor') { renderCodeEditor(workspace); return; }
    if (id === 'image-compressor' || id === 'image-resizer') { renderImageTool(workspace,id); return; }
    if (id === 'ipv4-subnet-calculator') { renderSubnetCalculator(workspace); return; }
    if (id === 'css-unit-converter') { renderCssUnitConverter(workspace); return; }
    if (id === 'css-box-shadow-generator') { renderShadowGenerator(workspace); return; }
    if (id === 'gitignore-builder') { renderGitignoreBuilder(workspace); return; }
    if (id === 'http-status-reference') { renderHttpStatusReference(workspace); return; }
    if (id === 'html-head-inspector') { renderHtmlHeadInspector(workspace); return; }
    const fields = fieldDefinitions(id);
    workspace.hidden = false;
    workspace.dataset.currentTool = id;
    const specialFields=id==='typing-speed-test'?`<div class="typing-passage"><span>Type this passage</span><p data-typing-prompt></p></div><label class="tool-field" for="typing-entry"><span>Your typing</span><textarea id="typing-entry" data-typing-entry rows="5" placeholder="The timer starts when you begin typing." autocomplete="off" autocapitalize="off" spellcheck="false"></textarea></label>${fieldMarkup({name:'duration',label:'Time limit',type:'select',options:[['30','30 seconds'],['60','60 seconds']]})}`:'';
    const close=singleToolId?'':'<button type="button" class="tool-close" data-close-tool>Close</button>';
    workspace.innerHTML = `<section class="tool-panel"><div class="tool-panel-heading"><div><p class="eyebrow">${tool.category}</p><h2>${tool.name}</h2><p>${tool.description}</p></div>${close}</div><div class="tool-form-area"><div class="tool-quick-actions"><button type="button" class="secondary-button" data-example>Load example</button><button type="button" class="secondary-button" data-clear-fields>Clear fields</button><span data-tool-message role="status" aria-live="polite"></span></div>${specialFields||fields.map(fieldMarkup).join('')}<div class="tool-buttons">${buttonMarkup(id)}</div><p class="tool-privacy">Input stays in this browser unless a tool description says otherwise.</p><div class="tool-output" aria-live="polite"></div></div></section>`;
    if(id==='typing-speed-test')workspace.querySelector('[data-example]').textContent='Reset passage';
    workspace.querySelector('[data-close-tool]')?.addEventListener('click', () => { workspace.hidden = true; workspace.innerHTML = ''; });
    workspace.querySelector('[data-example]').addEventListener('click',()=>{
      const samples={
        'url-encoder':{source:'coffee & tea'},'url-decoder':{source:'name=Ada+Lovelace&city=London'},'json-formatter':{source:'{"name":"Mina","role":"developer","skills":["JavaScript","CSS"]}'},
        'password-generator':{length:'24'},'qr-generator':{source:'https://chiefletter.com'},'word-counter':{source:'A short paragraph gives you a useful example to edit.'},
        'html-entities':{mode:'encode',source:'<p>Tea & coffee</p>'},'base64-codec':{mode:'encode',source:'A note with café'},'case-converter':{source:'A Useful Example For A Small Tool',case:'snake'},
        'slug-generator':{source:'A Clear, Useful Page Title'},'markdown-preview':{source:'# A useful heading\n\nWrite **one clear point** and a short list.\n\n- First item\n- Second item'},
        'regex-tester':{pattern:'[A-Z][a-z]+',flags:'g',source:'Mina emailed Ada about the new build.'},'timestamp-converter':{timestamp:'1735689600'},
        'csv-to-json':{source:'name,role,city\nMina,Developer,Delhi\nAda,Designer,London'},'text-diff':{left:'The page loads quickly.\nThe form saves.',right:'The page loads quickly on mobile.\nThe form saves.'},
        'jwt-decoder':{source:'eyJhbGciOiJub25lIn0.eyJzdWIiOiJzYW1wbGUiLCJpYXQiOjE3MDAwMDAwMDB9.'},'css-formatter':{source:'button{color:#111;background:#fff;padding:8px 12px;}'},
        'color-palette':{},'uuid-generator':{},'typing-speed-test':{},
        'json-to-csv':{source:'[{"name":"Mina","role":"Developer"},{"name":"Ada","role":"Designer"}]'},
        'csv-validator':{source:'name,role\nMina,Developer\nAda,Designer'},
        'regex-replace':{pattern:'(cat)',replacement:'$1s',flags:'g',source:'A cat sat beside another cat.'},
        'sql-formatter':{source:'select id,name from users where active=true order by name limit 10;'},
        'html-structure-inspector':{source:'<main><h1>Page title</h1><img src="photo.jpg"><p>Short introduction.</p></main>'},
        'html-to-text':{source:'<h1>Release notes</h1><p>Fixed a <strong>keyboard issue</strong>.</p>'},
        'js-string-escaper':{mode:'escape',source:'A line with "quotes" and a newline\n.'},
        'chmod-calculator':{owner:'7',group:'5',other:'5'},
        'semver-comparator':{left:'2.4.0-rc.1',right:'2.4.0'},
        'cron-explainer':{source:'*/15 9-17 * * 1-5'},
        'wcag-contrast-checker':{foreground:'#171717',background:'#ffffff'},
        'css-gradient-generator':{angle:'135',from:'#171717',to:'#eeeeee'},
        'markdown-table-generator':{source:'Tool\tUse\nJSON\tFormat data\nDiff\tCompare text'},
        'http-request-builder':{method:'GET',url:'https://api.example.com/items?limit=10',headers:'Accept: application/json',body:''},
        'flexbox-playground':{direction:'row',justify:'space-between',align:'center',gap:'12',count:'4'}
      }[id]||{};
      Object.entries(samples).forEach(([name,value])=>{const field=workspace.querySelector(`[data-field="${name}"]`);if(field){field.value=value;field.dispatchEvent(new Event('input',{bubbles:true}));}});
      if(id==='typing-speed-test')workspace.querySelector('[data-typing-reset]')?.click();else workspace.querySelector('[data-run]')?.click();
      workspace.querySelector('[data-tool-message]').textContent=id==='typing-speed-test'?'Passage reset. Type to start the clock.':'Example loaded. Edit it or try the tool.';
    });
    workspace.querySelector('[data-clear-fields]').addEventListener('click',()=>{
      workspace.querySelectorAll('[data-field], [data-typing-entry]').forEach(field=>{if(field.tagName==='SELECT')field.selectedIndex=0;else field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));});
      workspace.querySelector('.tool-output').replaceChildren();
      workspace.querySelector('[data-download-qr]')?.setAttribute('disabled','');
      workspace.querySelector('[data-typing-reset]')?.click();
      workspace.querySelector('[data-tool-message]').textContent='Fields cleared.';
    });
    bindTool(id, workspace);
    if (!singleToolId) { history.replaceState(null, '', `#${id}`); workspace.scrollIntoView({behavior:'smooth',block:'start'}); }
  }

  function renderCodeEditor(root) {
    const starter={
      html:'<main class="card">\n  <p class="eyebrow">A small experiment</p>\n  <h1>Hello, web.</h1>\n  <p>Change the code, then run the preview.</p>\n  <button id="try-button" type="button">Try the interaction</button>\n  <p id="status" aria-live="polite"></p>\n</main>',
      css:'* { box-sizing: border-box; }\nbody {\n  margin: 0;\n  padding: 2rem;\n  font: 16px/1.5 system-ui, sans-serif;\n  color: #171717;\n  background: #f4f4f2;\n}\n.card {\n  max-width: 36rem;\n  margin: 3rem auto;\n  padding: 2rem;\n  border: 1px solid #ddd;\n  border-radius: 12px;\n  background: white;\n}\nh1 { letter-spacing: -0.04em; }\nbutton { padding: .7rem 1rem; cursor: pointer; }',
      js:"document.querySelector('#try-button').addEventListener('click', () => {\n  document.querySelector('#status').textContent = 'The button works.';\n});"
    };
    let saved={};
    try { saved=JSON.parse(localStorage.getItem('chiefletter-code-editor')||'{}')||{}; } catch {}
    const code={html:typeof saved.html==='string'?saved.html:starter.html,css:typeof saved.css==='string'?saved.css:starter.css,js:typeof saved.js==='string'?saved.js:starter.js};
    root.hidden=false;
    root.innerHTML=`<section class="tool-panel code-editor-panel"><div class="tool-quick-actions code-editor-actions"><button type="button" data-editor-run>Run preview</button><button type="button" class="secondary-button" data-editor-save>Save draft</button><button type="button" class="secondary-button" data-editor-copy>Copy active pane</button><button type="button" class="secondary-button" data-editor-download>Download HTML</button><button type="button" class="secondary-button" data-editor-reset>Reset example</button><span data-editor-status role="status" aria-live="polite">Ready. Code runs in this browser.</span></div><div class="code-editor-layout"><section class="code-source" aria-label="Code editor"><div class="code-tabs" role="tablist" aria-label="Code language"><button type="button" role="tab" aria-selected="true" data-editor-tab="html">HTML</button><button type="button" role="tab" aria-selected="false" data-editor-tab="css">CSS</button><button type="button" role="tab" aria-selected="false" data-editor-tab="js">JavaScript</button></div><label class="visually-hidden" for="editor-html">HTML source</label><textarea id="editor-html" data-editor-source="html" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea><label class="visually-hidden" for="editor-css">CSS source</label><textarea id="editor-css" data-editor-source="css" spellcheck="false" autocapitalize="off" autocomplete="off" hidden></textarea><label class="visually-hidden" for="editor-js">JavaScript source</label><textarea id="editor-js" data-editor-source="js" spellcheck="false" autocapitalize="off" autocomplete="off" hidden></textarea><div class="editor-statusline"><span data-editor-language>HTML</span><span data-editor-count>0 lines</span><span>Local preview</span></div></section><section class="code-preview-section"><div class="code-preview-bar"><strong>Preview</strong><label for="editor-viewport">Viewport</label><select id="editor-viewport" data-editor-viewport><option value="100%">Responsive</option><option value="390px">Phone · 390 px</option><option value="768px">Tablet · 768 px</option><option value="1024px">Desktop · 1024 px</option></select></div><iframe title="Code preview" data-editor-preview sandbox="allow-scripts" referrerpolicy="no-referrer"></iframe><p class="editor-footnote">The preview is isolated from the Chiefletter page. Only run code you trust.</p></section></div></section>`;
    const panes=[...root.querySelectorAll('[data-editor-source]')];
    const preview=root.querySelector('[data-editor-preview]');
    const status=root.querySelector('[data-editor-status]');
    let active='html';
    panes.forEach(pane=>{pane.value=code[pane.dataset.editorSource];pane.addEventListener('input',()=>updateCount());});
    function updateCount(){const pane=root.querySelector(`[data-editor-source="${active}"]`);root.querySelector('[data-editor-count]').textContent=`${pane.value.split('\n').length} lines`;}
    function run(){
      const value=Object.fromEntries(panes.map(p=>[p.dataset.editorSource,p.value]));
      const errorHandler='<script>window.onerror=function(message,source,line){parent.postMessage({type:"chiefletter-editor-error",message:String(message),line:line},"*")};</script>';
      const styles=`<style>${value.css}</style>`;
      const script='<script>'+value.js.replace(/<\/script/gi,'<\\/script')+'</script>';
      let page=value.html;
      if(/<head\b[^>]*>/i.test(page)) page=page.replace(/<head\b[^>]*>/i,match=>match+styles+errorHandler);
      else page=`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1">${styles}${errorHandler}</head><body>${page}</body></html>`;
      if(/<\/body>/i.test(page)) page=page.replace(/<\/body>/i,script+'</body>'); else page+=script;
      preview.srcdoc=page;
      status.textContent='Preview updated.';
    }
    root.querySelectorAll('[data-editor-tab]').forEach(tab=>tab.addEventListener('click',()=>{
      active=tab.dataset.editorTab;
      root.querySelectorAll('[data-editor-tab]').forEach(item=>item.setAttribute('aria-selected',String(item===tab)));
      panes.forEach(pane=>pane.hidden=pane.dataset.editorSource!==active);
      root.querySelector('[data-editor-language]').textContent=active==='js'?'JavaScript':active.toUpperCase();
      updateCount();root.querySelector(`[data-editor-source="${active}"]`).focus();
    }));
    root.querySelector('[data-editor-run]').addEventListener('click',run);
    root.querySelector('[data-editor-save]').addEventListener('click',()=>{try{localStorage.setItem('chiefletter-code-editor',JSON.stringify(Object.fromEntries(panes.map(p=>[p.dataset.editorSource,p.value]))));status.textContent='Draft saved in this browser.';}catch{status.textContent='Browser storage is unavailable. Copy or download your work.';}});
    root.querySelector('[data-editor-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(root.querySelector(`[data-editor-source="${active}"]`).value);status.textContent='Active pane copied.';}catch{status.textContent='Clipboard access is unavailable. Select and copy the code manually.';}});
    root.querySelector('[data-editor-download]').addEventListener('click',()=>{const html=root.querySelector('[data-editor-source="html"]').value,css=root.querySelector('[data-editor-source="css"]').value,js=root.querySelector('[data-editor-source="js"]').value;const safeJs=js.replace(/<\/script/gi,'<\\/script');const doc='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body>'+html+'<script>'+safeJs+'</script></body></html>';const url=URL.createObjectURL(new Blob([doc],{type:'text/html'}));const link=document.createElement('a');link.href=url;link.download='chiefletter-playground.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='HTML file downloaded. Review its code before sharing.';});
    root.querySelector('[data-editor-reset]').addEventListener('click',()=>{panes.forEach(p=>p.value=starter[p.dataset.editorSource]);try{localStorage.removeItem('chiefletter-code-editor');}catch{}updateCount();run();status.textContent='Starter example restored.';});
    root.querySelector('[data-editor-viewport]').addEventListener('change',event=>{preview.style.maxWidth=event.target.value;preview.style.width=event.target.value==='100%'?'100%':event.target.value;});
    window.addEventListener('message',event=>{if(event.source===preview.contentWindow&&event.data?.type==='chiefletter-editor-error')status.textContent=`Preview error on line ${event.data.line}: ${event.data.message}`;});
    updateCount();run();
  }

  function renderImageTool(root,id) {
    const compress=id==='image-compressor';
    let outputUrls=[];
    root.hidden=false;
    root.innerHTML=`<section class="tool-panel image-tool-panel"><div class="image-tool-controls"><label class="tool-field">${compress?'Choose images':'Choose an image'}<input type="file" accept="image/jpeg,image/png,image/webp" data-image-file ${compress?'multiple':''}></label>${compress?'<label class="tool-field">Output format<select data-image-format><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label><label class="tool-field">Quality <span data-quality-value>75%</span><input type="range" min="20" max="100" value="75" data-image-quality></label><label class="tool-field">Maximum width in pixels<input type="number" min="1" max="8192" placeholder="Keep original width" data-image-max-width></label>':'<label class="tool-field">Width in pixels<input type="number" min="1" max="8192" value="800" data-image-width></label><label class="tool-field">Height in pixels<input type="number" min="1" max="8192" value="600" data-image-height></label><label class="image-check"><input type="checkbox" checked data-image-proportions> Preserve proportions</label><label class="tool-field">Output format<select data-image-format><option value="image/webp">WebP</option><option value="image/jpeg">JPEG</option><option value="image/png">PNG</option></select></label><label class="tool-field">Quality <span data-quality-value>85%</span><input type="range" min="20" max="100" value="85" data-image-quality></label>'}<div class="tool-buttons"><button type="button" data-image-run>${compress?'Compress images':'Resize image'}</button><button type="button" class="secondary-button" data-image-clear>Clear</button></div><p class="image-tool-note" data-image-note role="status" aria-live="polite">Files stay in this browser. ${compress?'After compression, source selections clear from this page. The originals on your device are untouched.':'The original image on your device is unchanged.'}</p></div><div class="image-tool-files" data-image-files aria-live="polite"></div></section>`;
    const input=root.querySelector('[data-image-file]'), format=root.querySelector('[data-image-format]'), quality=root.querySelector('[data-image-quality]'), output=root.querySelector('[data-image-files]'), note=root.querySelector('[data-image-note]');
    function clearResults(){outputUrls.forEach(url=>URL.revokeObjectURL(url));outputUrls=[];output.replaceChildren();}
    quality.addEventListener('input',()=>{root.querySelector('[data-quality-value]').textContent=`${quality.value}%`;});
    input.addEventListener('change',()=>{clearResults();output.textContent=input.files.length?`${input.files.length} image${input.files.length===1?'':'s'} selected.`:'No images selected.';});
    root.querySelector('[data-image-clear]').addEventListener('click',()=>{input.value='';clearResults();note.textContent='Selection and output cleared from this page. Your original files are unchanged.';});
    root.querySelector('[data-image-run]').addEventListener('click',async()=>{
      const files=[...input.files];
      if(!files.length){note.textContent='Choose an image file first.';return;}
      const runButton=root.querySelector('[data-image-run]');runButton.disabled=true;clearResults();note.textContent=compress?'Compressing images in this browser…':'Resizing image in this browser…';
      try {
        for(const file of files){
          if(!/^image\/(jpeg|png|webp)$/.test(file.type))throw new Error(`${file.name} is not a supported JPG, PNG, or WebP image.`);
          const bitmap=await createImageBitmap(file),originalWidth=bitmap.width,originalHeight=bitmap.height;
          let width,height;
          if(compress){const max=Number(root.querySelector('[data-image-max-width]').value)||bitmap.width;const scale=Math.min(1,max/bitmap.width);width=Math.max(1,Math.round(bitmap.width*scale));height=Math.max(1,Math.round(bitmap.height*scale));}
          else {width=Number(root.querySelector('[data-image-width]').value);height=Number(root.querySelector('[data-image-height]').value);if(!width||!height||width>8192||height>8192)throw new Error('Enter a width and height between 1 and 8192 pixels.');if(root.querySelector('[data-image-proportions]').checked){const scale=Math.min(width/bitmap.width,height/bitmap.height);width=Math.max(1,Math.round(bitmap.width*scale));height=Math.max(1,Math.round(bitmap.height*scale));}}
          const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const context=canvas.getContext('2d');
          const mime=format.value;if(mime==='image/jpeg'){context.fillStyle='#fff';context.fillRect(0,0,width,height);}context.drawImage(bitmap,0,0,width,height);bitmap.close?.();
          const blob=await new Promise(resolve=>canvas.toBlob(resolve,mime,Number(quality.value)/100));if(!blob)throw new Error('The browser could not export this image format. Try WebP or JPEG.');
          const extension=mime==='image/jpeg'?'jpg':mime.split('/')[1],name=file.name.replace(/\.[^.]+$/,'')+`-${compress?'compressed':'resized'}.${extension}`,url=URL.createObjectURL(blob);outputUrls.push(url);
          const savings=Math.round((1-blob.size/file.size)*100);
          const card=document.createElement('div');card.className='image-result-card';const preview=document.createElement('img');preview.src=url;preview.alt=`${name} preview`;preview.loading='lazy';const details=document.createElement('div');details.className='image-result-details';const title=document.createElement('strong');title.textContent=name;const meta=document.createElement('span');meta.textContent=`${originalWidth} × ${originalHeight} px · ${formatBytes(file.size)} → ${formatBytes(blob.size)}${savings>0?` · ${savings}% smaller`:savings<0?` · ${Math.abs(savings)}% larger`:' · same size'}`;const download=document.createElement('a');download.href=url;download.download=name;download.className='top-cta';download.textContent='Download image';details.append(title,meta,download);card.append(preview,details);output.append(card);
        }
        if(compress){input.value='';note.textContent='Compression finished. Source selections were cleared from this page. Download the results below. Your original files on your device are unchanged.';}else note.textContent='Resize finished. Download the new image below. The original file is unchanged.';
      } catch(error){note.textContent=error.message||'The image could not be processed.';}
      finally{runButton.disabled=false;}
    });
  }
  function formatBytes(bytes){if(bytes<1024)return `${bytes} B`;const units=['KB','MB','GB'];let value=bytes/1024,index=0;while(value>=1024&&index<units.length-1){value/=1024;index++;}return `${value.toFixed(value>=10?1:2)} ${units[index]}`;}

  function renderSubnetCalculator(root){
    root.hidden=false;root.innerHTML='<section class="tool-panel"><div class="tool-form-area"><label class="tool-field">IPv4 address and CIDR prefix<input type="text" data-cidr value="192.168.10.23/24" placeholder="192.168.10.23/24" autocomplete="off"></label><div class="tool-buttons"><button type="button" data-subnet-run>Calculate subnet</button></div><div class="tool-output subnet-output" aria-live="polite"></div></div></section>';
    const input=root.querySelector('[data-cidr]'),out=root.querySelector('.tool-output');
    const dotted=value=>[24n,16n,8n,0n].map(shift=>Number((value>>shift)&255n)).join('.');
    const calculate=()=>{try{const match=input.value.trim().match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d|[12]\d|3[0-2])$/);if(!match)throw new Error('Enter an IPv4 CIDR value, such as 192.168.10.23/24.');const parts=match[1].split('.').map(Number),prefix=Number(match[2]);if(parts.some(part=>part>255))throw new Error('Each IPv4 address part must be between 0 and 255.');const ip=parts.reduce((value,part)=>(value<<8n)+BigInt(part),0n),all=0xffffffffn,mask=prefix===0?0n:(all<<BigInt(32-prefix))&all,network=ip&mask,broadcast=network|(all^mask),count=2n**BigInt(32-prefix),hosts=prefix===32?1n:prefix===31?2n:count-2n,first=prefix>=31?network:network+1n,last=prefix>=31?broadcast:broadcast-1n,wildcard=all^mask;const rows=[['Network',dotted(network)+`/${prefix}`],['Subnet mask',dotted(mask)],['Wildcard mask',dotted(wildcard)],['Broadcast',dotted(broadcast)],['Address range',`${dotted(first)} – ${dotted(last)}`],['Addresses in block',String(count)],['Usable host addresses',String(hosts)]];out.innerHTML=`<div class="subnet-result-grid">${rows.map(([label,value])=>`<div><span>${label}</span><strong>${value}</strong></div>`).join('')}</div><p class="tool-privacy">/31 and /32 use special host-count conventions. Confirm routing and reserved addresses in your network plan.</p>`;}catch(error){out.textContent=error.message;}};
    root.querySelector('[data-subnet-run]').addEventListener('click',calculate);input.addEventListener('keydown',event=>{if(event.key==='Enter')calculate();});calculate();
  }

  function renderCssUnitConverter(root){
    root.hidden=false;root.innerHTML='<section class="tool-panel"><div class="unit-converter-grid"><label class="tool-field">Value in pixels<input type="number" step="any" value="24" data-unit-px></label><label class="tool-field">Root font size in pixels<input type="number" min="1" step="any" value="16" data-unit-root></label><label class="tool-field">Parent font size in pixels<input type="number" min="1" step="any" value="16" data-unit-parent></label></div><div class="tool-output" data-unit-output aria-live="polite"></div></section>';
    const update=()=>{const px=Number(root.querySelector('[data-unit-px]').value),base=Number(root.querySelector('[data-unit-root]').value),parent=Number(root.querySelector('[data-unit-parent]').value),out=root.querySelector('[data-unit-output]');if(!Number.isFinite(px)||base<=0||parent<=0){out.textContent='Enter a pixel value and font sizes above zero.';return;}out.innerHTML=`<div class="unit-results"><div><span>Pixels</span><strong>${px}px</strong></div><div><span>Root relative</span><strong>${(px/base).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')}rem</strong></div><div><span>Parent relative</span><strong>${(px/parent).toFixed(4).replace(/0+$/,'').replace(/\.$/,'')}em</strong></div></div><p class="tool-privacy">Rem uses the root size. Em uses the parent size entered here.</p>`;};root.querySelectorAll('input').forEach(input=>input.addEventListener('input',update));update();
  }

  function renderShadowGenerator(root){
    root.hidden=false;root.innerHTML='<section class="tool-panel"><div class="shadow-controls"><label class="tool-field">Horizontal offset <output data-shadow-x-label>0px</output><input type="range" min="-40" max="40" value="0" data-shadow-x></label><label class="tool-field">Vertical offset <output data-shadow-y-label>12px</output><input type="range" min="-40" max="40" value="12" data-shadow-y></label><label class="tool-field">Blur <output data-shadow-blur-label>24px</output><input type="range" min="0" max="80" value="24" data-shadow-blur></label><label class="tool-field">Spread <output data-shadow-spread-label>0px</output><input type="range" min="-20" max="40" value="0" data-shadow-spread></label><label class="tool-field">Shadow color<input type="color" value="#000000" data-shadow-color></label><label class="tool-field">Opacity <output data-shadow-alpha-label>16%</output><input type="range" min="0" max="100" value="16" data-shadow-alpha></label></div><div class="shadow-preview" data-shadow-preview><span>Preview card</span></div><div class="tool-output"><pre data-shadow-result></pre><button type="button" class="secondary-button" data-shadow-copy>Copy CSS</button></div></section>';
    const update=()=>{const value=name=>Number(root.querySelector(`[data-shadow-${name}]`).value),hex=root.querySelector('[data-shadow-color]').value,r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16),alpha=value('alpha')/100,shadow=`${value('x')}px ${value('y')}px ${value('blur')}px ${value('spread')}px rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;root.querySelector('[data-shadow-preview]').style.boxShadow=shadow;root.querySelector('[data-shadow-result]').textContent=`box-shadow: ${shadow};`;for(const name of ['x','y','blur','spread','alpha'])root.querySelector(`[data-shadow-${name}-label]`).textContent=name==='alpha'?`${value(name)}%`:`${value(name)}px`;};root.querySelectorAll('input').forEach(input=>input.addEventListener('input',update));root.querySelector('[data-shadow-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(root.querySelector('[data-shadow-result]').textContent);root.querySelector('[data-shadow-copy]').textContent='Copied';}catch{root.querySelector('[data-shadow-copy]').textContent='Select and copy CSS';}});update();
  }

  function renderGitignoreBuilder(root){
    const rules={
      node:['node_modules/','dist/','build/','.npm/'],python:['__pycache__/','*.py[cod]','.venv/','venv/','.pytest_cache/'],
      macos:['.DS_Store','._*'],windows:['Thumbs.db','Desktop.ini'],vscode:['.vscode/'],jetbrains:['.idea/','*.iml'],
      java:['target/','*.class','.gradle/'],rust:['target/'],go:['/bin/','*.exe'],
      secrets:['.env','.env.*','!.env.example']
    };
    root.hidden=false;root.innerHTML=`<section class="tool-panel"><div class="ignore-options-heading"><div><h3>Choose your project setup</h3><p>Rules update as you select options. You can edit the result before copying.</p></div><span data-ignore-count aria-live="polite"></span></div><div class="ignore-options">${[['node','Node.js'],['python','Python'],['java','Java'],['rust','Rust'],['go','Go'],['macos','macOS'],['windows','Windows'],['vscode','VS Code'],['jetbrains','JetBrains IDEs'],['secrets','Local environment files']].map(([key,label])=>`<label><input type="checkbox" data-ignore-option="${key}" ${key==='secrets'?'checked':''}>${label}</label>`).join('')}</div><div class="tool-quick-actions"><button type="button" data-ignore-copy>Copy .gitignore</button><span data-ignore-status role="status" aria-live="polite">Generated rules are ready.</span></div><label class="tool-field" for="generated-gitignore">.gitignore output<textarea id="generated-gitignore" data-ignore-output rows="13" spellcheck="false" autocapitalize="off"></textarea></label><p class="tool-privacy">Save this text as .gitignore in your repository root. Ignore rules do not remove files already tracked by Git.</p></section>`;
    const update=()=>{const selected=[...root.querySelectorAll('[data-ignore-option]:checked')].map(input=>input.dataset.ignoreOption),lines=['# Generated by Chiefletter. Review before committing.'];selected.forEach(key=>{lines.push('',`# ${key}`,...rules[key]);});root.querySelector('[data-ignore-output]').value=lines.join('\n')+'\n';root.querySelector('[data-ignore-count]').textContent=`${selected.length} preset${selected.length===1?'':'s'} selected`;};root.querySelectorAll('[data-ignore-option]').forEach(input=>input.addEventListener('change',update));root.querySelector('[data-ignore-copy]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(root.querySelector('[data-ignore-output]').value);root.querySelector('[data-ignore-status]').textContent='Copied .gitignore text.';}catch{root.querySelector('[data-ignore-status]').textContent='Select the text and copy it manually.';}});update();
  }

  function renderHttpStatusReference(root){
    const known={200:['OK','The request succeeded. Read the response body for the result.'],201:['Created','The request created a resource. The response often identifies it.'],202:['Accepted','The server accepted work that may finish later. Check the API for a status endpoint.'],204:['No Content','The request succeeded and has no response body.'],206:['Partial Content','The server returned part of a resource, often for a range request.'],301:['Moved Permanently','The resource has a permanent redirect. Clients should use the new location.'],302:['Found','The response redirects temporarily.'],304:['Not Modified','A cached representation remains valid under the request conditions.'],307:['Temporary Redirect','A temporary redirect that preserves the request method.'],308:['Permanent Redirect','A permanent redirect that preserves the request method.'],400:['Bad Request','The request was invalid. Check its syntax and required fields.'],401:['Unauthorized','Authentication is missing or invalid. Check the credential flow.'],403:['Forbidden','The server understood the request but refuses access. Check permissions.'],404:['Not Found','The resource was not found, or the service hides its existence.'],405:['Method Not Allowed','The route does not accept this HTTP method. Check the Allow header.'],409:['Conflict','The request conflicts with current resource state. Refresh or resolve the conflict.'],410:['Gone','The resource is no longer available and is expected to stay unavailable.'],413:['Content Too Large','The request body exceeds a server limit. Reduce the payload or check the documented limit.'],415:['Unsupported Media Type','The server does not accept the request content type. Check Content-Type.'],422:['Unprocessable Content','The syntax is understood, but the content cannot be processed. Check validation details.'],429:['Too Many Requests','A rate limit was reached. Follow Retry-After or the API’s retry guidance.'],500:['Internal Server Error','The server hit an unexpected condition. Check service logs and request identifiers.'],501:['Not Implemented','The server does not support the requested functionality.'],502:['Bad Gateway','A gateway received an invalid response from an upstream service.'],503:['Service Unavailable','The service is unavailable, often temporarily. Check Retry-After before retrying.'],504:['Gateway Timeout','A gateway did not receive a timely upstream response.']};
    root.hidden=false;root.innerHTML='<section class="tool-panel"><div class="tool-quick-actions status-lookup-controls"><label class="tool-field" for="status-code-input">HTTP status code<input id="status-code-input" type="number" min="100" max="599" value="429" data-status-code></label><button type="button" data-status-lookup>Look up code</button></div><div class="tool-output" data-status-result aria-live="polite"></div></section>';
    const input=root.querySelector('[data-status-code]'),out=root.querySelector('[data-status-result]');const lookup=()=>{const code=Number(input.value),group=Math.floor(code/100),groupText={1:'Informational',2:'Success',3:'Redirection',4:'Client error',5:'Server error'}[group];if(!Number.isInteger(code)||code<100||code>599){out.textContent='Enter a three-digit status code from 100 to 599.';return;}const item=known[code];out.replaceChildren();const card=document.createElement('div');card.className='status-reference-card';const heading=document.createElement('h3');heading.textContent=`${code} · ${item?item[0]:groupText||'Registered status'}`;const groupLine=document.createElement('p');groupLine.textContent=`${groupText||'Registered status'} response`;const explanation=document.createElement('p');explanation.textContent=item?item[1]:'This code is not in the common-code list. Check the relevant HTTP specification or API documentation.';card.append(heading,groupLine,explanation);out.append(card);};root.querySelector('[data-status-lookup]').addEventListener('click',lookup);input.addEventListener('keydown',event=>{if(event.key==='Enter')lookup();});lookup();
  }

  function renderHtmlHeadInspector(root){
    const sample='<!doctype html>\n<html lang="en">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1">\n  <title>Project notes | Example site</title>\n  <meta name="description" content="A concise description of this project page.">\n  <link rel="canonical" href="https://example.com/project-notes/">\n  <meta property="og:title" content="Project notes">\n  <meta property="og:description" content="A concise description of this project page.">\n  <meta property="og:image" content="https://example.com/project.jpg">\n</head>\n<body>\n  <main><h1>Project notes</h1><img src="project.jpg" alt="A project overview"></main>\n</body>\n</html>';
    root.hidden=false;root.innerHTML=`<section class="tool-panel"><div class="tool-quick-actions"><button type="button" class="secondary-button" data-head-sample>Load example</button><button type="button" data-head-inspect>Inspect HTML</button><span data-head-status role="status" aria-live="polite">Paste a page source to begin.</span></div><label class="tool-field" for="head-html-source">HTML source<textarea id="head-html-source" data-head-source rows="14" spellcheck="false" autocapitalize="off" placeholder="Paste the page HTML here"></textarea></label><div class="tool-output html-inspector-output" data-head-output aria-live="polite"></div></section>`;
    const source=root.querySelector('[data-head-source]'),status=root.querySelector('[data-head-status]'),out=root.querySelector('[data-head-output]');
    function inspect(){if(!source.value.trim()){status.textContent='Paste or load HTML before inspecting.';out.replaceChildren();return;}const doc=new DOMParser().parseFromString(source.value,'text/html'),title=doc.title.trim(),description=doc.querySelector('meta[name="description"]')?.content.trim()||'',viewport=doc.querySelector('meta[name="viewport"]')?.content.trim()||'',canonical=doc.querySelector('link[rel~="canonical"]')?.getAttribute('href')||'',ogTitle=doc.querySelector('meta[property="og:title"]')?.content.trim()||'',ogDescription=doc.querySelector('meta[property="og:description"]')?.content.trim()||'',ogImage=doc.querySelector('meta[property="og:image"]')?.content.trim()||'',h1s=doc.querySelectorAll('h1').length,images=[...doc.querySelectorAll('img')],missingAlt=images.filter(img=>!img.hasAttribute('alt')).length;const checks=[['Page title',title?`Present · ${title.length} characters`:'Missing a title element',!!title],['Meta description',description?`Present · ${description.length} characters`:'Missing a meta description',!!description],['Viewport',viewport?'Present':'Missing viewport metadata',!!viewport],['Canonical URL',canonical||'Not provided',!!canonical],['Open Graph title',ogTitle||'Not provided',!!ogTitle],['Open Graph description',ogDescription||'Not provided',!!ogDescription],['Open Graph image',ogImage||'Not provided',!!ogImage],['H1 headings',`${h1s} found`,h1s===1],['Images without alt',`${missingAlt} of ${images.length}`,missingAlt===0]];out.replaceChildren();const list=document.createElement('div');list.className='html-inspector-checks';checks.forEach(([label,value,pass])=>{const row=document.createElement('div');row.className='html-inspector-row';const name=document.createElement('strong');name.textContent=label;const result=document.createElement('span');result.textContent=value;const state=document.createElement('small');state.className=pass?'check-pass':'check-review';state.textContent=pass?'Present':'Review';row.append(name,result,state);list.append(row);});out.append(list);status.textContent='Inspection complete. Review each field against the page purpose.';}
    root.querySelector('[data-head-sample]').addEventListener('click',()=>{source.value=sample;inspect();});root.querySelector('[data-head-inspect]').addEventListener('click',inspect);source.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='Enter')inspect();});
  }

  function fieldDefinitions(id) {
    const text = (name,label,placeholder='',rows=7) => ({name,label,placeholder,rows});
    const input = (name,label,type='text',value='') => ({name,label,type,value});
    const select = (name,label,options) => ({name,label,type:'select',options});
    switch (id) {
      case 'url-encoder': case 'url-decoder': case 'slug-generator': case 'css-formatter': return [text('source','Text to convert','Paste or type text here.')];
      case 'html-entities': return [select('mode','Conversion',[['encode','Escape HTML'],['decode','Decode HTML entities']]),text('source','Text to convert','Paste or type text here.')];
      case 'base64-codec': return [select('mode','Conversion',[['encode','Encode text'],['decode','Decode Base64']]),text('source','Text to convert','Paste or type text here.')];
      case 'json-formatter': return [text('source','JSON input','Paste JSON here.')];
      case 'password-generator': return [input('length','Length','number','20'), select('sets','Character groups',[['all','Uppercase, lowercase, numbers, symbols'],['letters-numbers','Letters and numbers'],['letters','Letters only']])];
      case 'qr-generator': return [text('source','Text or URL','Keep the content under 106 UTF-8 bytes.',3)];
      case 'word-counter': return [text('source','Text','Paste or write text here.',8)];
      case 'case-converter': return [text('source','Text','Write or paste text.',6),select('case','Convert to',[['upper','UPPERCASE'],['lower','lowercase'],['title','Title Case'],['sentence','Sentence case'],['camel','camelCase'],['snake','snake_case'],['kebab','kebab-case']])];
      case 'markdown-preview': return [text('source','Markdown','## A heading\n\nWrite **bold text**, a list, or a [link](https://example.com).',8)];
      case 'regex-tester': return [input('pattern','Regular expression'),select('flags','Flags',[['g','Global'],['gi','Global, case-insensitive'],['i','Case-insensitive'],['m','Multiline'],['none','None']]),text('source','Sample text','Paste text to check against the expression.',7)];
      case 'timestamp-converter': return [input('timestamp','Unix timestamp in seconds or milliseconds'),input('date','Local date and time','datetime-local')];
      case 'csv-to-json': return [text('source','CSV input','First row becomes the object keys.',8)];
      case 'text-diff': return [text('left','Original text','Paste the original version.',6),text('right','Changed text','Paste the changed version.',6)];
      case 'jwt-decoder': return [text('source','JWT','Paste a token. It is decoded locally and never verified.',4)];
      case 'json-to-csv': return [text('source','JSON array','Paste an array of objects.',8)];
      case 'csv-validator': return [text('source','CSV text','Include a header row.',8)];
      case 'regex-replace': return [input('pattern','Regular expression'),input('replacement','Replacement text'),select('flags','Options',[['g','Replace all matches'],['','Replace first match'],['gi','Replace all, ignore case']]),text('source','Text to change','Paste a representative sample.',8)];
      case 'sql-formatter': return [text('source','SQL query','Paste a query to format.',8)];
      case 'html-structure-inspector': case 'html-to-text': return [text('source','HTML input','Paste a snippet or document.',8)];
      case 'js-string-escaper': return [select('mode','Conversion',[['escape','Escape as quoted string'],['decode','Decode quoted JSON string']]),text('source','String value','Paste text or a quoted string.',6)];
      case 'chmod-calculator': return [input('owner','Owner permissions (0 to 7)','number','7'),input('group','Group permissions (0 to 7)','number','5'),input('other','Other permissions (0 to 7)','number','5')];
      case 'semver-comparator': return [input('left','First version','text','1.2.3'),input('right','Second version','text','1.2.4')];
      case 'cron-explainer': return [input('source','Five-field cron expression','text','*/15 9-17 * * 1-5')];
      case 'wcag-contrast-checker': return [input('foreground','Text color','color','#171717'),input('background','Background color','color','#ffffff')];
      case 'css-gradient-generator': return [input('angle','Angle in degrees','number','135'),input('from','Start color','color','#171717'),input('to','End color','color','#eeeeee')];
      case 'markdown-table-generator': return [text('source','Rows','Separate cells with tabs or pipes. First row becomes the header.',8)];
      case 'http-request-builder': return [select('method','HTTP method',['GET','POST','PUT','PATCH','DELETE'].map(method=>[method,method])),input('url','HTTP or HTTPS URL','url'),text('headers','Headers','One Name: value pair per line.',4),text('body','Request body','Optional text body.',5)];
      case 'flexbox-playground': return [select('direction','Flex direction',[['row','row'],['column','column'],['row-reverse','row-reverse'],['column-reverse','column-reverse']]),select('justify','Justify content',['flex-start','center','flex-end','space-between','space-around'].map(value=>[value,value])),select('align','Align items',['stretch','flex-start','center','flex-end','baseline'].map(value=>[value,value])),input('gap','Gap in pixels','number','12'),input('count','Number of items','number','4')];
      default: return [];
    }
  }

  function fieldMarkup(field) {
    const id = `field-${field.name}`;
    if (field.type === 'select') return `<label class="tool-field" for="${id}"><span>${field.label}</span><select id="${id}" data-field="${field.name}">${field.options.map(([value,label])=>`<option value="${value}">${label}</option>`).join('')}</select></label>`;
    if (field.rows) return `<label class="tool-field" for="${id}"><span>${field.label}</span><textarea id="${id}" data-field="${field.name}" rows="${field.rows}" placeholder="${esc(field.placeholder)}"></textarea></label>`;
    return `<label class="tool-field" for="${id}"><span>${field.label}</span><input id="${id}" data-field="${field.name}" type="${field.type||'text'}" ${field.value?`value="${field.value}"`:''} ${field.placeholder?`placeholder="${esc(field.placeholder)}"`:''}></label>`;
  }

  function buttonMarkup(id) {
    if (id === 'password-generator') return '<button type="button" data-run>Generate password</button><button type="button" class="secondary-button" data-copy-password>Copy password</button>';
    if (id === 'typing-speed-test') return '<button type="button" class="secondary-button" data-typing-reset>Reset test</button>';
    if (id === 'qr-generator') return '<button type="button" data-run>Make QR code</button><button type="button" class="secondary-button" data-download-qr disabled>Download PNG</button>';
    if (id === 'color-palette') return '<button type="button" data-run>Generate palette</button>';
    if (id === 'uuid-generator') return '<button type="button" data-run>Generate UUIDs</button>';
    if (id === 'timestamp-converter') return '<button type="button" data-run>Convert timestamp</button><button type="button" class="secondary-button" data-now>Use current time</button>';
    if (id === 'regex-tester') return '<button type="button" data-run>Test expression</button>';
    if (id === 'text-diff') return '<button type="button" data-run>Compare text</button>';
    return '<button type="button" data-run>Run tool</button>';
  }

  function bindTool(id, root) {
    const out = root.querySelector('.tool-output');
    const value = name => root.querySelector(`[data-field="${name}"]`)?.value ?? '';
    const textField = name => root.querySelector(`[data-field="${name}"]`);
    const setText = (title, result) => {
      out.replaceChildren();
      const heading = document.createElement('h3'); heading.textContent = title;
      const pre = document.createElement('pre'); pre.textContent = String(result);
      const copy = document.createElement('button'); copy.type = 'button'; copy.className = 'secondary-button'; copy.textContent = 'Copy result';
      copy.addEventListener('click', () => copyText(String(result), copy));
      out.append(heading, pre, copy);
    };
    const fail = error => setText('Check the input', error.message || String(error));
    const run = () => {
      try { runTool(id, root, {value,textField,setText,fail}); }
      catch (error) { fail(error); }
    };
    root.querySelector('[data-run]')?.addEventListener('click', run);

    if (id === 'word-counter') {
      const update = () => {
        const text = value('source');
        const words = text.trim() ? (text.trim().match(/[\p{L}\p{N}]+(?:['’_-][\p{L}\p{N}]+)*/gu)||[]).length : 0;
        const chars = [...text].length;
        const noSpace = [...text.replace(/\s/g,'')].length;
        const sentences = text.trim() ? (text.match(/[.!?]+(?=\s|$)/g)||[]).length : 0;
        const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
        out.innerHTML = `<div class="stat-grid"><div><strong>${words}</strong><span>Words</span></div><div><strong>${chars}</strong><span>Characters</span></div><div><strong>${noSpace}</strong><span>Without spaces</span></div><div><strong>${sentences}</strong><span>Sentences</span></div><div><strong>${paragraphs}</strong><span>Paragraphs</span></div></div>`;
      };
      textField('source').addEventListener('input', update); update();
    }
    if (id === 'typing-speed-test') startTypingTest(root);
    if (id === 'markdown-preview') {
      const update = () => {
        const preview = root.querySelector('[data-markdown-preview]');
        preview.innerHTML = markdownToSafeHtml(value('source'));
      };
      out.innerHTML = '<h3>Preview</h3><div class="markdown-preview" data-markdown-preview></div>';
      textField('source').addEventListener('input', update); update();
    }
    if (id === 'color-palette') {
      root.querySelector('[data-run]').addEventListener('click', () => drawPalette(out));
      drawPalette(out);
    }
    if (id === 'timestamp-converter') {
      root.querySelector('[data-now]').addEventListener('click', () => { const now=new Date(); now.setMinutes(now.getMinutes()-now.getTimezoneOffset()); textField('date').value=now.toISOString().slice(0,16); run(); });
    }
    if (id === 'password-generator') {
      run();
      root.querySelector('[data-copy-password]').addEventListener('click', button => {
        const password=root.querySelector('.tool-output pre')?.textContent || '';
        if(password)copyText(password,button.currentTarget);
      });
    }
    if (id === 'uuid-generator') run();
    if (id === 'flexbox-playground') {
      root.querySelectorAll('[data-field]').forEach(field=>field.addEventListener('input',run));
      run();
    }
  }

  function runTool(id, root, api) {
    const {value,setText} = api;
    const source = value('source');
    switch (id) {
      case 'url-encoder': setText('Encoded URL component', encodeURIComponent(source)); break;
      case 'url-decoder': setText('Decoded text', decodeURIComponent(source.replace(/\+/g,' '))); break;
      case 'json-formatter': setText('Valid JSON', JSON.stringify(JSON.parse(source), null, 2)); break;
      case 'password-generator': generatePassword(root, setText); break;
      case 'qr-generator': makeQr(root, source); break;
      case 'base64-codec': {
        if(value('mode')==='decode') setText('Decoded text',decodeBase64Unicode(source));
        else { const bytes=new TextEncoder().encode(source); const binary=[...bytes].map(byte=>String.fromCharCode(byte)).join(''); setText('Base64 encoded',btoa(binary)); }
        break;
      }
      case 'uuid-generator': setText('UUIDs', Array.from({length:5},()=>makeUuid()).join('\n')); break;
      case 'case-converter': setText('Converted text', convertCase(source, value('case'))); break;
      case 'slug-generator': setText('URL slug', slugify(source)); break;
      case 'html-entities': setText(value('mode')==='decode'?'Decoded text':'Encoded HTML',value('mode')==='decode'?htmlDecode(source):source.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]))); break;
      case 'regex-tester': testRegex(root); break;
      case 'timestamp-converter': convertTimestamp(root, setText); break;
      case 'csv-to-json': setText('JSON data', JSON.stringify(csvToObjects(source),null,2)); break;
      case 'text-diff': renderDiff(root, value('left'), value('right')); break;
      case 'css-formatter': setText('Formatted CSS',formatCss(source)); break;
      case 'jwt-decoder': decodeJwt(source,setText); break;
      case 'json-to-csv': setText('CSV output',jsonToCsv(source)); break;
      case 'csv-validator': setText('CSV validation',validateCsv(source)); break;
      case 'regex-replace': setText('Replacement preview',regexReplace(root)); break;
      case 'sql-formatter': setText('Formatted SQL',formatSql(source)); break;
      case 'html-structure-inspector': setText('HTML structure',inspectHtml(source)); break;
      case 'html-to-text': setText('Extracted text',htmlToText(source)); break;
      case 'js-string-escaper': setText(value('mode')==='escape'?'Quoted string':'Decoded string',value('mode')==='escape'?JSON.stringify(source):decodeQuotedString(source)); break;
      case 'chmod-calculator': setText('Permission mode',chmodMode(root)); break;
      case 'semver-comparator': setText('Version comparison',compareVersions(value('left'),value('right'))); break;
      case 'cron-explainer': setText('Cron fields',explainCron(source)); break;
      case 'wcag-contrast-checker': renderContrast(root); break;
      case 'css-gradient-generator': renderGradient(root); break;
      case 'markdown-table-generator': setText('Markdown table',markdownTable(source)); break;
      case 'http-request-builder': setText('curl command',buildCurl(root)); break;
      case 'flexbox-playground': renderFlexbox(root); break;
      default: throw new Error('This tool is unavailable.');
    }
  }

  function generatePassword(root, setText) {
    const length=Math.max(8,Math.min(128,Number(root.querySelector('[data-field="length"]').value)||20));
    const groups=root.querySelector('[data-field="sets"]').value;
    const pools=['abcdefghijklmnopqrstuvwxyz'];
    if(groups!=='letters') pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if(groups!=='letters') pools.push('0123456789');
    if(groups==='all') pools.push('!@#$%^&*()-_=+[]{}?');
    const all=pools.join('');
    const chars=pools.map(pool=>pool[secureIndex(pool.length)]);
    while(chars.length<length) chars.push(all[secureIndex(all.length)]);
    for(let i=chars.length-1;i>0;i--){const j=secureIndex(i+1);[chars[i],chars[j]]=[chars[j],chars[i]];}
    setText('Generated password',chars.join(''));
  }

  function startTypingTest(root) {
    const passage='Good technical work starts with a clear question. Write down the result you expect, make one small change, and check what happened. A careful note gives you a better next step than a guess.';
    const prompt=root.querySelector('[data-typing-prompt]');
    const entry=root.querySelector('[data-typing-entry]');
    const duration=root.querySelector('[data-field="duration"]');
    const output=root.querySelector('.tool-output');
    let startedAt=null, interval=null, finished=false;
    prompt.textContent=passage;
    function metrics() {
      const typed=entry.value; let correct=0, errors=0;
      [...typed].forEach((char,index)=>{if(char===passage[index])correct++;else errors++;});
      const seconds=startedAt?Math.max(1,(Date.now()-startedAt)/1000):1;
      const remaining=Math.max(0,Number(duration.value)-Math.floor(startedAt?(Date.now()-startedAt)/1000:0));
      const wpm=Math.round(correct/5/(seconds/60));
      const accuracy=typed.length?Math.round(correct/typed.length*100):100;
      output.innerHTML=`<div class="stat-grid"><div><strong>${wpm}</strong><span>Words per minute</span></div><div><strong>${accuracy}%</strong><span>Accuracy</span></div><div><strong>${errors}</strong><span>Errors</span></div><div><strong>${remaining}s</strong><span>Time left</span></div></div>`;
      return {remaining,complete:typed.length>=passage.length};
    }
    function stop(message) {
      if(interval)clearInterval(interval); interval=null; finished=true; entry.disabled=true;
      const status=document.createElement('p');status.className='typing-status';status.textContent=message;output.append(status);
    }
    function update() {
      const state=metrics();
      if(state.complete)stop('Passage complete. Reset to try again.');
      else if(state.remaining<=0)stop('Time is up. Reset for another round.');
    }
    entry.addEventListener('input',()=>{
      if(finished)return;
      if(startedAt===null){startedAt=Date.now();interval=setInterval(update,250);}
      update();
    });
    duration.addEventListener('change',()=>root.querySelector('[data-typing-reset]').click());
    root.querySelector('[data-typing-reset]').addEventListener('click',()=>{
      if(interval)clearInterval(interval); interval=null; startedAt=null; finished=false; entry.disabled=false; entry.value='';
      output.innerHTML='<p class="typing-status">Type the passage to start the clock.</p>';entry.focus();
    });
    output.innerHTML='<p class="typing-status">Type the passage to start the clock.</p>';
  }

  function secureIndex(size) {
    const range=0x100000000, limit=range-(range%size), value=new Uint32Array(1);
    do { crypto.getRandomValues(value); } while(value[0]>=limit);
    return value[0]%size;
  }

  function makeUuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    const bytes=new Uint8Array(16); crypto.getRandomValues(bytes); bytes[6]=(bytes[6]&15)|64; bytes[8]=(bytes[8]&63)|128;
    const hex=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }

  function convertCase(text, mode) {
    if(mode==='upper') return text.toUpperCase();
    if(mode==='lower') return text.toLowerCase();
    const words=text.trim().toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
    if(mode==='title') return text.toLowerCase().replace(/(^|\s)(\p{L})/gu,(_,space,letter)=>space+letter.toUpperCase());
    if(mode==='sentence') return text.toLowerCase().replace(/(^\s*|[.!?]\s+)(\p{L})/gu,(_,space,letter)=>space+letter.toUpperCase());
    if(mode==='camel') return words.map((word,index)=>index?word[0].toUpperCase()+word.slice(1):word).join('');
    if(mode==='snake') return words.join('_');
    return words.join('-');
  }

  function slugify(text) { return text.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }

  function decodeBase64Unicode(text) {
    const binary=atob(text.trim());
    return new TextDecoder('utf-8',{fatal:true}).decode(Uint8Array.from(binary,char=>char.charCodeAt(0)));
  }

  function htmlDecode(text) {
    const area=document.createElement('textarea'); area.innerHTML=text; return area.value;
  }

  function markdownToSafeHtml(source) {
    let html=esc(source);
    html=html.replace(/^```[^\n]*\n([\s\S]*?)\n```/gm,'<pre><code>$1</code></pre>');
    html=html.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>');
    html=html.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`([^`]+)`/g,'<code>$1</code>');
    html=html.replace(/\[([^\]]+)\]\((https?:[^\s)]+)\)/g,'<a href="$2" rel="noopener" target="_blank">$1</a>');
    html=html.split(/\n{2,}/).map(block=>/^<(h[1-3]|pre)/.test(block)?block:`<p>${block.replace(/\n/g,'<br>')}</p>`).join('');
    return html;
  }

  function drawPalette(out) {
    out.replaceChildren();
    const heading=document.createElement('h3'); heading.textContent='Five-color palette';
    const grid=document.createElement('div'); grid.className='palette-grid';
    const start=Math.floor(Math.random()*360), step=23+Math.floor(Math.random()*24), sat=38+Math.floor(Math.random()*30), light=32+Math.floor(Math.random()*40);
    for(let i=0;i<5;i++) {
      const hue=(start+i*step)%360, color=hslHex(hue,sat,Math.max(22,Math.min(78,light+(i-2)*7)));
      const swatch=document.createElement('button'); swatch.type='button'; swatch.className='palette-swatch'; swatch.style.backgroundColor=color; swatch.style.color=light>54?'#111':'#fff'; swatch.textContent=color; swatch.setAttribute('aria-label',`Copy ${color}`);
      swatch.addEventListener('click',()=>copyText(color,swatch)); grid.append(swatch);
    }
    out.append(heading,grid);
    const regenerate=document.createElement('button'); regenerate.type='button'; regenerate.className='secondary-button'; regenerate.textContent='Make another palette'; regenerate.addEventListener('click',()=>drawPalette(out)); out.append(regenerate);
  }

  function hslHex(h,s,l) {
    s/=100; l/=100; const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l), f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
    return '#'+[f(0),f(8),f(4)].map(v=>Math.round(v*255).toString(16).padStart(2,'0')).join('');
  }

  function testRegex(root) {
    const pattern=root.querySelector('[data-field="pattern"]').value;
    const requested=root.querySelector('[data-field="flags"]').value.replace('none','');
    const flags=[...new Set(`${requested}g`)].join('');
    const sample=root.querySelector('[data-field="source"]').value;
    const regex=new RegExp(pattern,flags);
    const matches=[...sample.matchAll(regex)].map(match=>`“${match[0]}” at character ${match.index}`);
    const out=root.querySelector('.tool-output'); out.replaceChildren();
    const heading=document.createElement('h3'); heading.textContent=`${matches.length} match${matches.length===1?'':'es'}`;
    const pre=document.createElement('pre'); pre.textContent=matches.length?matches.join('\n'):'No matches.'; out.append(heading,pre);
  }

  function convertTimestamp(root,setText) {
    const raw=root.querySelector('[data-field="timestamp"]').value.trim();
    const dateInput=root.querySelector('[data-field="date"]').value;
    const date=raw ? new Date(/^\d{10,13}$/.test(raw)?Number(raw)*(raw.length===10?1000:1):raw) : new Date(dateInput);
    if(Number.isNaN(date.getTime())) throw new Error('Enter a valid date or Unix timestamp.');
    setText('Converted time',`UTC: ${date.toISOString()}\nUnix seconds: ${Math.floor(date.getTime()/1000)}\nUnix milliseconds: ${date.getTime()}\nYour local time: ${date.toLocaleString()}`);
  }

  function parseCsv(text) {
    text=text.replace(/^\uFEFF/,'');
    const rows=[];let row=[],cell='',state='plain';
    const finishCell=()=>{row.push(cell);cell='';state='plain';};
    const finishRow=()=>{finishCell();if(row.some(value=>value!==''))rows.push(row);row=[];};
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(state==='quoted'){
        if(c==='"'&&text[i+1]==='"'){cell+='"';i++;}
        else if(c==='"')state='closed';
        else cell+=c;
        continue;
      }
      if(state==='closed'){
        if(c===','){finishCell();continue;}
        if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;finishRow();continue;}
        if(c===' '||c==='\t')continue;
        throw new Error('Unexpected text after a closing quote. Check the CSV field.');
      }
      if(c==='"'){
        if(cell.length)throw new Error('A quote appears inside an unquoted field. Put the whole field in quotes and escape inner quotes by doubling them.');
        state='quoted';continue;
      }
      if(c===','){finishCell();continue;}
      if(c==='\r'||c==='\n'){if(c==='\r'&&text[i+1]==='\n')i++;finishRow();continue;}
      cell+=c;
    }
    if(state==='quoted')throw new Error('A quoted field is missing its closing quote.');
    if(state==='closed'||cell.length||row.length)finishRow();
    return rows;
  }
  function csvToObjects(text) {
    const rows=parseCsv(text); if(rows.length<2) throw new Error('Add a header row and at least one data row.');
    const headers=rows[0].map((header,index)=>header.trim()||`column${index+1}`);
    return rows.slice(1).map(row=>Object.fromEntries(headers.map((header,index)=>[header,row[index]||''])));
  }

  function renderDiff(root,left,right) {
    const oldLines=left.split('\n'), newLines=right.split('\n');
    const out=root.querySelector('.tool-output'); out.replaceChildren();
    const heading=document.createElement('h3'); heading.textContent='Line comparison';
    const pre=document.createElement('pre'); pre.className='diff-output';
    const max=Math.max(oldLines.length,newLines.length); const lines=[];
    for(let i=0;i<max;i++) {
      if(oldLines[i]===newLines[i]) lines.push(`  ${oldLines[i]??''}`);
      else { if(oldLines[i]!==undefined) lines.push(`- ${oldLines[i]}`); if(newLines[i]!==undefined) lines.push(`+ ${newLines[i]}`); }
    }
    pre.textContent=lines.join('\n')||'No differences.'; out.append(heading,pre);
  }

  function formatCss(source) {
    return source.replace(/\s+/g,' ').replace(/\s*\{\s*/g,' {\n  ').replace(/\s*;\s*/g,';\n  ').replace(/\s*:\s*/g,': ').replace(/\s*}\s*/g,'\n}\n\n').replace(/;\n}/g,'\n}').trim();
  }

  function decodeJwt(token,setText) {
    const parts=token.trim().split('.'); if(parts.length!==3) throw new Error('A JWT has three dot-separated parts.');
    const decode=part=>JSON.parse(decodeBase64Unicode(part.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(part.length/4)*4,'=')));
    const header=decode(parts[0]), payload=decode(parts[1]);
    const exp=payload.exp?`\nExpires: ${new Date(payload.exp*1000).toLocaleString()}${payload.exp*1000<Date.now()?' (expired)':''}`:'';
    setText('Decoded header and payload',`Header\n${JSON.stringify(header,null,2)}\n\nPayload\n${JSON.stringify(payload,null,2)}${exp}\n\nThe signature was not verified.`);
  }

  function jsonToCsv(source) {
    const rows=JSON.parse(source);
    if(!Array.isArray(rows)||!rows.length||rows.some(row=>!row||typeof row!=='object'||Array.isArray(row)))throw new Error('Enter a non-empty JSON array of objects.');
    const headers=[...new Set(rows.flatMap(row=>Object.keys(row)))];
    if(!headers.length)throw new Error('The objects have no fields to export.');
    const cell=value=>{const text=value===null||value===undefined?'':typeof value==='object'?JSON.stringify(value):String(value);return /[",\r\n]/.test(text)?`"${text.replace(/"/g,'""')}"`:text;};
    return [headers.map(cell).join(','),...rows.map(row=>headers.map(key=>cell(row[key])).join(','))].join('\n');
  }

  function validateCsv(source) {
    const rows=parseCsv(source);if(!rows.length)throw new Error('Add a header row and at least one data row.');
    const headers=rows[0].map(value=>value.trim()),issues=[];
    if(headers.some(value=>!value))issues.push('The header row has an empty column name.');
    const duplicates=headers.filter((value,index)=>value&&headers.indexOf(value)!==index);
    if(duplicates.length)issues.push(`Duplicate headers: ${[...new Set(duplicates)].join(', ')}.`);
    rows.slice(1).forEach((row,index)=>{if(row.length!==headers.length)issues.push(`Row ${index+2} has ${row.length} fields. Expected ${headers.length}.`);});
    return issues.length?issues.join('\n'):`No structural issues found in ${rows.length-1} data row${rows.length===2?'':'s'} with ${headers.length} column${headers.length===1?'':'s'}.`;
  }

  function regexReplace(root) {
    const pattern=root.querySelector('[data-field="pattern"]').value;
    const flags=root.querySelector('[data-field="flags"]').value;
    const replacement=root.querySelector('[data-field="replacement"]').value;
    return root.querySelector('[data-field="source"]').value.replace(new RegExp(pattern,flags),replacement);
  }

  function formatSql(source) {
    const keywords=new Set(['SELECT','FROM','WHERE','GROUP','ORDER','HAVING','LIMIT','OFFSET','UNION','INSERT','INTO','VALUES','UPDATE','SET','DELETE','JOIN','LEFT','RIGHT','INNER','OUTER','ON','AND','OR']);
    const tokens=source.match(/\s+|--[^\n]*|\/\*[\s\S]*?\*\/|'(?:''|[^'])*'|"(?:""|[^"])*"|`(?:``|[^`])*`|[(),;]|[^\s(),;]+/g)||[];
    let output='',lineStart=true,depth=0;
    const put=text=>{if(lineStart&&text.trim())output+='  '.repeat(Math.max(0,depth));output+=text;if(text.includes('\n'))lineStart=true;else if(text.trim())lineStart=false;};
    for(let i=0;i<tokens.length;i++){
      const token=tokens[i],upper=token.toUpperCase();
      if(/^\s+$/.test(token)){if(!lineStart&&!output.endsWith(' '))output+=' ';continue;}
      if(token==='('){if(!output.endsWith(' '))output+=' ';put('(');depth++;continue;}
      if(token===')'){depth=Math.max(0,depth-1);put(')');continue;}
      if(token===','){put(',\n');lineStart=true;continue;}
      if(token===';'){put(';\n');lineStart=true;continue;}
      if(keywords.has(upper)&&['SELECT','FROM','WHERE','GROUP','ORDER','HAVING','LIMIT','OFFSET','UNION','INSERT','UPDATE','DELETE','JOIN','LEFT','RIGHT','INNER','ON','SET','VALUES'].includes(upper)){
        if(output.trim()) {output=output.replace(/[ \t]+$/,'')+'\n';lineStart=true;}
        put(upper+(upper==='GROUP'||upper==='ORDER'?' ':' '));
        if((upper==='GROUP'||upper==='ORDER')&&tokens[i+1]?.trim().toUpperCase()==='BY'){i++;put('BY ');}
        continue;
      }
      put(token);
    }
    return output.trim()||'Enter a SQL query.';
  }

  function inspectHtml(source) {
    const doc=new DOMParser().parseFromString(source,'text/html');
    const counts={},outline=[],issues=[];
    doc.body.querySelectorAll('*').forEach(element=>{
      counts[element.tagName.toLowerCase()]=(counts[element.tagName.toLowerCase()]||0)+1;
      if(element.tagName==='IMG'&&!element.hasAttribute('alt'))issues.push('Image without an alt attribute.');
      if(/^H[1-6]$/.test(element.tagName))outline.push(`${element.tagName.toLowerCase()} ${element.textContent.trim().replace(/\s+/g,' ').slice(0,90)}`);
    });
    const summary=Object.entries(counts).sort((a,b)=>a[0].localeCompare(b[0])).map(([tag,count])=>`${tag}: ${count}`).join('\n')||'No elements found.';
    return `Element counts\n${summary}\n\nHeadings\n${outline.join('\n')||'No headings found.'}\n\nChecks\n${issues.join('\n')||'No images missing an alt attribute.'}`;
  }

  function htmlToText(source) {
    const doc=new DOMParser().parseFromString(source,'text/html');
    doc.querySelectorAll('script,style,noscript,template').forEach(node=>node.remove());
    doc.querySelectorAll('br,hr').forEach(node=>node.replaceWith('\n'));
    doc.querySelectorAll('p,div,section,article,li,h1,h2,h3,h4,h5,h6,tr').forEach(node=>node.append('\n'));
    return (doc.body.textContent||'').replace(/[\t ]+/g,' ').replace(/ *\n */g,'\n').replace(/\n{3,}/g,'\n\n').trim()||'No readable text found.';
  }

  function decodeQuotedString(source) {
    const value=JSON.parse(source.trim());
    if(typeof value!=='string')throw new Error('Enter one quoted JSON string.');
    return value;
  }

  function chmodMode(root) {
    const digits=['owner','group','other'].map(name=>root.querySelector(`[data-field="${name}"]`).value);
    if(digits.some(value=>! /^[0-7]$/.test(value)))throw new Error('Enter one permission digit from 0 to 7 for each group.');
    const symbolic=digits.map(value=>{const n=Number(value);return `${n&4?'r':'-'}${n&2?'w':'-'}${n&1?'x':'-'}`;}).join('');
    return `Octal mode: ${digits.join('')}\nSymbolic mode: ${symbolic}\nCommand: chmod ${digits.join('')} FILE`;
  }

  function parseSemver(value) {
    const match=value.trim().replace(/^v/,'').match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/);
    if(!match)throw new Error('Use major.minor.patch, with an optional prerelease such as 2.1.0-rc.1.');
    return {core:match.slice(1,4).map(Number),pre:match[4]?match[4].split('.'):null};
  }
  function compareVersions(left,right) {
    const a=parseSemver(left),b=parseSemver(right);let order=0;
    for(let i=0;i<3&&!order;i++)order=Math.sign(a.core[i]-b.core[i]);
    if(!order&&a.pre&&b.pre){for(let i=0;i<Math.max(a.pre.length,b.pre.length)&&!order;i++){const x=a.pre[i],y=b.pre[i];if(x===undefined)order=-1;else if(y===undefined)order=1;else if(x===y)order=0;else if(/^\d+$/.test(x)&&/^\d+$/.test(y))order=Math.sign(Number(x)-Number(y));else if(/^\d+$/.test(x))order=-1;else if(/^\d+$/.test(y))order=1;else order=x<y?-1:1;}}
    if(!order&&Boolean(a.pre)!==Boolean(b.pre))order=a.pre?-1:1;
    return order===0?'Versions have equal precedence.':order<0?`${left.trim()} is older than ${right.trim()}.`:`${left.trim()} is newer than ${right.trim()}.`;
  }

  function explainCron(source) {
    const parts=source.trim().split(/\s+/);if(parts.length!==5)throw new Error('Enter exactly five fields: minute hour day-of-month month day-of-week.');
    const fields=[['Minute',0,59],['Hour',0,23],['Day of month',1,31],['Month',1,12],['Day of week',0,7]];
    const lines=parts.map((part,index)=>{const [label,min,max]=fields[index];validateCronField(part,min,max);return `${label}: ${part==='*'?'every allowed value':part}`;});
    return `${lines.join('\n')}\n\nDay-of-month and day-of-week behavior varies by scheduler. Confirm the target system’s rules and time zone.`;
  }
  function validateCronField(field,min,max) {
    for(const piece of field.split(',')){
      if(!piece)throw new Error('A comma-separated field contains an empty value.');
      const [base,step,...rest]=piece.split('/');if(rest.length||step!==undefined&&(!/^\d+$/.test(step)||Number(step)<1))throw new Error(`Invalid step in “${piece}”.`);
      if(base==='*')continue;
      const range=base.split('-');if(range.length>2)throw new Error(`Invalid range “${base}”.`);
      const values=range.map(value=>{if(!/^\d+$/.test(value))throw new Error(`Use numeric values in “${base}”.`);return Number(value);});
      if(values.some(value=>value<min||value>max)||values.length===2&&values[0]>values[1])throw new Error(`Value “${base}” is outside ${min} to ${max}.`);
    }
  }

  function rgbFromHex(value) {
    let hex=value.replace('#','');if(/^[0-9a-f]{3}$/i.test(hex))hex=[...hex].map(char=>char+char).join('');
    if(!/^[0-9a-f]{6}$/i.test(hex))throw new Error('Choose a valid three- or six-digit hex color.');
    return [0,2,4].map(index=>parseInt(hex.slice(index,index+2),16)/255);
  }
  function luminance(rgb) {const c=rgb.map(value=>value<=.04045?value/12.92:((value+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2];}
  function renderContrast(root) {
    const fg=root.querySelector('[data-field="foreground"]').value,bg=root.querySelector('[data-field="background"]').value;
    const ratio=(Math.max(luminance(rgbFromHex(fg)),luminance(rgbFromHex(bg)))+.05)/(Math.min(luminance(rgbFromHex(fg)),luminance(rgbFromHex(bg)))+.05);
    const out=root.querySelector('.tool-output');out.replaceChildren();
    const heading=document.createElement('h3');heading.textContent=`Contrast ratio ${ratio.toFixed(2)}:1`;
    const sample=document.createElement('div');sample.className='contrast-sample';sample.style.color=fg;sample.style.backgroundColor=bg;sample.textContent='Sample text at the selected colors.';
    const note=document.createElement('p');note.textContent=`Normal text AA: ${ratio>=4.5?'Pass':'Does not pass'} · Large text AA: ${ratio>=3?'Pass':'Does not pass'}`;out.append(heading,sample,note);
  }

  function renderGradient(root) {
    const angle=Math.max(0,Math.min(360,Number(root.querySelector('[data-field="angle"]').value)||0));
    const from=root.querySelector('[data-field="from"]').value,to=root.querySelector('[data-field="to"]').value;
    const css=`background: linear-gradient(${angle}deg, ${from}, ${to});`,out=root.querySelector('.tool-output');out.replaceChildren();
    const heading=document.createElement('h3');heading.textContent='Gradient preview';
    const preview=document.createElement('div');preview.className='gradient-preview';preview.style.background=`linear-gradient(${angle}deg,${from},${to})`;
    const pre=document.createElement('pre');pre.textContent=css;
    const copy=document.createElement('button');copy.type='button';copy.className='secondary-button';copy.textContent='Copy CSS';copy.addEventListener('click',()=>copyText(css,copy));out.append(heading,preview,pre,copy);
  }

  function markdownTable(source) {
    const rows=source.trim().split(/\r?\n/).filter(Boolean).map(line=>line.includes('\t')?line.split('\t'):line.replace(/^\||\|$/g,'').split('|'));
    if(!rows.length)throw new Error('Add a header row and at least one data row.');
    const width=Math.max(...rows.map(row=>row.length));
    const normalize=row=>Array.from({length:width},(_,index)=>(row[index]||'').trim().replace(/\|/g,'\\|'));
    const header=normalize(rows[0]);
    return `| ${header.join(' | ')} |\n| ${header.map(()=> '---').join(' | ')} |\n${rows.slice(1).map(row=>`| ${normalize(row).join(' | ')} |`).join('\n')}`;
  }

  function shellQuote(value) {return `'${String(value).replace(/'/g,"'\\''")}'`;}
  function buildCurl(root) {
    const method=root.querySelector('[data-field="method"]').value,url=root.querySelector('[data-field="url"]').value.trim();
    let parsed;try{parsed=new URL(url);}catch(_){throw new Error('Enter a complete HTTP or HTTPS URL.');}
    if(!['http:','https:'].includes(parsed.protocol)||parsed.username||parsed.password)throw new Error('Use an HTTP or HTTPS URL without embedded credentials.');
    const lines=root.querySelector('[data-field="headers"]').value.split(/\r?\n/).map(line=>line.trim()).filter(Boolean);
    for(const line of lines)if(!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+\s*:\s*[^\r\n]*$/.test(line))throw new Error(`Invalid header: ${line}`);
    const parts=['curl','--request',shellQuote(method),shellQuote(url)];
    lines.forEach(line=>parts.push('--header',shellQuote(line)));
    const body=root.querySelector('[data-field="body"]').value;if(body)parts.push('--data-binary',shellQuote(body));
    return parts.join(' ');
  }

  function renderFlexbox(root) {
    const direction=root.querySelector('[data-field="direction"]').value,justify=root.querySelector('[data-field="justify"]').value,align=root.querySelector('[data-field="align"]').value;
    const gap=Math.max(0,Math.min(80,Number(root.querySelector('[data-field="gap"]').value)||0)),count=Math.max(1,Math.min(10,Number(root.querySelector('[data-field="count"]').value)||1));
    const out=root.querySelector('.tool-output');out.replaceChildren();
    const heading=document.createElement('h3');heading.textContent='Live layout';
    const stage=document.createElement('div');stage.className='flex-playground';stage.style.flexDirection=direction;stage.style.justifyContent=justify;stage.style.alignItems=align;stage.style.gap=`${gap}px`;
    for(let i=1;i<=count;i++){const item=document.createElement('span');item.textContent=`Item ${i}`;stage.append(item);}
    const css=`display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${align};\ngap: ${gap}px;`;
    const pre=document.createElement('pre');pre.textContent=css;const copy=document.createElement('button');copy.type='button';copy.className='secondary-button';copy.textContent='Copy CSS';copy.addEventListener('click',()=>copyText(css,copy));out.append(heading,stage,pre,copy);
  }

  function copyText(text,button) {
    const done=()=>{const old=button.textContent;button.textContent='Copied';setTimeout(()=>button.textContent=old,1200);};
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));
    else fallbackCopy(text,done);
  }
  function fallbackCopy(text,done) {
    const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.append(area); area.select();
    try { document.execCommand('copy'); done(); } finally { area.remove(); }
  }

  // QR Code byte mode, error-correction level L, versions 1 through 5.
  function makeQr(root,text) {
    const bytes=[...new TextEncoder().encode(text)];
    const versions=[{data:19,ecc:7},{data:34,ecc:10},{data:55,ecc:15},{data:80,ecc:20},{data:108,ecc:26}];
    const version=versions.findIndex(info=>4+8+bytes.length*8<=info.data*8)+1;
    if(!text.trim()) throw new Error('Enter text or a URL first.');
    if(version<1) throw new Error('This local QR maker supports up to 106 UTF-8 bytes. Shorten the text or use a URL.');
    const info=versions[version-1], bits=[];
    const append=(value,length)=>{for(let i=length-1;i>=0;i--)bits.push((value>>>i)&1);};
    append(4,4); append(bytes.length,8); bytes.forEach(byte=>append(byte,8));
    for(let i=0;i<Math.min(4,info.data*8-bits.length);i++)bits.push(0);
    while(bits.length%8)bits.push(0);
    const data=[]; for(let i=0;i<bits.length;i+=8)data.push(parseInt(bits.slice(i,i+8).join(''),2));
    for(let pad=0;data.length<info.data;pad++)data.push(pad%2?0x11:0xec);
    const codewords=data.concat(reedSolomon(data,info.ecc));
    const size=17+version*4, matrix=Array.from({length:size},()=>Array(size).fill(null));
    const set=(x,y,value)=>{if(x>=0&&y>=0&&x<size&&y<size)matrix[y][x]=Boolean(value);};
    const finder=(cx,cy)=>{for(let dy=-1;dy<=7;dy++)for(let dx=-1;dx<=7;dx++){const x=cx+dx,y=cy+dy;if(x<0||y<0||x>=size||y>=size)continue;const dist=Math.max(Math.abs(dx-3),Math.abs(dy-3));set(x,y,dist!==2&&dist!==4);}};
    finder(0,0); finder(size-7,0); finder(0,size-7);
    for(let i=8;i<size-8;i++){if(matrix[6][i]===null)set(i,6,i%2===0);if(matrix[i][6]===null)set(6,i,i%2===0);}
    if(version>=2){const centers=[6,size-7];for(const cy of centers)for(const cx of centers){if(matrix[cy][cx]!==null)continue;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++)set(cx+dx,cy+dy,Math.max(Math.abs(dx),Math.abs(dy))!==1);}}
    set(8,size-8,true);
    let bit=0, upward=true;
    for(let right=size-1;right>=1;right-=2){if(right===6)right--;for(let vert=0;vert<size;vert++){const y=upward?size-1-vert:vert;for(let j=0;j<2;j++){const x=right-j;if(matrix[y][x]!==null)continue;const value=bit<codewords.length*8?((codewords[bit>>>3]>>>(7-(bit&7)))&1)!==0:false;set(x,y,value^((x+y)%2===0));bit++;}}upward=!upward;}
    const formatData=(1<<3)|0; let rem=formatData<<10; for(let i=14;i>=10;i--)if((rem>>>i)&1)rem^=0x537<<(i-10); const format=((formatData<<10)|rem)^0x5412;
    const f=(i)=>((format>>>i)&1)!==0;
    for(let i=0;i<=5;i++)set(8,i,f(i)); set(8,7,f(6)); set(8,8,f(7)); set(7,8,f(8)); for(let i=9;i<15;i++)set(14-i,8,f(i));
    for(let i=0;i<8;i++)set(size-1-i,8,f(i)); for(let i=8;i<15;i++)set(8,size-15+i,f(i)); set(8,size-8,true);
    drawQr(root,matrix);
  }

  function reedSolomon(data,count) {
    const mul=(x,y)=>{let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((y>>>i)&1)*x;}return z;};
    let generator=[1],root=1;
    for(let i=0;i<count;i++){const next=Array(generator.length+1).fill(0);generator.forEach((coefficient,index)=>{next[index]^=coefficient;next[index+1]^=mul(coefficient,root);});generator=next;root=mul(root,2);}
    const result=Array(count).fill(0);
    for(const byte of data){const factor=byte^result.shift();result.push(0);for(let i=0;i<count;i++)result[i]^=mul(generator[i+1],factor);}
    return result;
  }

  function drawQr(root,matrix) {
    const out=root.querySelector('.tool-output'); out.replaceChildren();
    const heading=document.createElement('h3'); heading.textContent='QR code';
    const canvas=document.createElement('canvas'), quiet=4, scale=8, size=matrix.length;
    canvas.width=canvas.height=(size+quiet*2)*scale; canvas.setAttribute('aria-label','Generated QR code');
    const ctx=canvas.getContext('2d'); ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#000';
    matrix.forEach((row,y)=>row.forEach((on,x)=>{if(on)ctx.fillRect((x+quiet)*scale,(y+quiet)*scale,scale,scale);}));
    const note=document.createElement('p'); note.textContent='Generated in this browser. Text was not uploaded.';
    out.append(heading,canvas,note);
    const download=root.querySelector('[data-download-qr]'); download.disabled=false; download.onclick=()=>{const link=document.createElement('a');link.download='chiefletter-qr.png';link.href=canvas.toDataURL('image/png');link.click();};
  }

  if (singleToolId) openTool(singleToolId);
  else { search?.addEventListener('input', drawCatalog); drawCategories(); drawCatalog(); }
})();
