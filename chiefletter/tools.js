(() => {
  const catalog = document.getElementById('tool-catalog');
  const workspace = document.getElementById('tool-workspace');
  const search = document.getElementById('tool-search');
  const categoriesNode = document.getElementById('tool-categories');
  const singleToolId = document.body.dataset.toolId || '';
  if ((!catalog && !singleToolId) || (singleToolId && !workspace)) return;

  const tools = window.TOOL_LIST || [];
  const categories = ['All tools', ...new Set(tools.map(tool=>tool.category))];
  let selectedCategory = 'All tools';
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

  function drawCategories() {
    if (!categoriesNode) return;
    categoriesNode.innerHTML = categories.map(name => `<button type="button" class="filter ${name===selectedCategory?'active':''}" data-category="${esc(name)}">${esc(name)}</button>`).join('');
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
    catalog.innerHTML = visible.length ? visible.map(tool => `<a class="tool-card" href="tools/${tool.id}/"><span class="tool-card-category">${tool.category}</span><strong>${tool.name}</strong><span>${tool.description}</span><span class="tool-card-link">Open tool</span></a>`).join('') : '<p class="empty">No tools match this search.</p>';
  }

  function openTool(id) {
    const tool = tools.find(item => item.id === id);
    if (!tool || !workspace) return;
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
        'color-palette':{},'uuid-generator':{},'typing-speed-test':{}
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
      case 'qr-generator': return [text('source','Text or URL','Keep the content under 100 UTF-8 bytes for broad QR support.',3)];
      case 'word-counter': return [text('source','Text','Paste or write text here.',8)];
      case 'case-converter': return [text('source','Text','Write or paste text.',6),select('case','Convert to',[['upper','UPPERCASE'],['lower','lowercase'],['title','Title Case'],['sentence','Sentence case'],['camel','camelCase'],['snake','snake_case'],['kebab','kebab-case']])];
      case 'markdown-preview': return [text('source','Markdown','## A heading\n\nWrite **bold text**, a list, or a [link](https://example.com).',8)];
      case 'regex-tester': return [input('pattern','Regular expression'),select('flags','Flags',[['g','Global'],['gi','Global, case-insensitive'],['i','Case-insensitive'],['m','Multiline'],['none','None']]),text('source','Sample text','Paste text to check against the expression.',7)];
      case 'timestamp-converter': return [input('timestamp','Unix timestamp in seconds or milliseconds'),input('date','Local date and time','datetime-local')];
      case 'csv-to-json': return [text('source','CSV input','First row becomes the object keys.',8)];
      case 'text-diff': return [text('left','Original text','Paste the original version.',6),text('right','Changed text','Paste the changed version.',6)];
      case 'jwt-decoder': return [text('source','JWT','Paste a token. It is decoded locally and never verified.',4)];
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
    const rows=[]; let row=[], cell='', quoted=false;
    for(let i=0;i<text.length;i++) {
      const c=text[i];
      if(c==='"' && quoted && text[i+1]==='"'){cell+='"';i++;}
      else if(c==='"') quoted=!quoted;
      else if(c===',' && !quoted){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(value=>value!==''))rows.push(row);row=[];cell='';}
      else cell+=c;
    }
    row.push(cell); if(row.some(value=>value!==''))rows.push(row);
    if(quoted) throw new Error('A quoted field is missing its closing quote.');
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
