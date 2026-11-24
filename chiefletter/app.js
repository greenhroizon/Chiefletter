(function(){
const grid=document.getElementById('article-grid');
const filters=document.getElementById('filters');
const search=document.getElementById('search');
const articles=(window.ARTICLES||[]).slice().sort((a,b)=>new Date(b.date)-new Date(a.date));
const categories=['All stories',...new Set(articles.map(a=>a.category))];
let selected='All stories';
const PAGE_SIZE=12;
let visibleCount=PAGE_SIZE;
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageUrl=(id,w=800)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${Math.round(w/1.7778)}&q=86`;
const imageSet=id=>`${imageUrl(id,480)} 480w, ${imageUrl(id,800)} 800w, ${imageUrl(id,1200)} 1200w`;
const articleUrl=a=>`articles/${encodeURIComponent(a.id)}/`;
function drawCards(){
  if(!grid)return;
  const q=(search?.value||'').toLowerCase().trim();
  const list=articles.filter(a=>(selected==='All stories'||a.category===selected)&&(!q||`${a.title} ${a.description} ${a.keywords} ${a.category}`.toLowerCase().includes(q)));
  const shown=list.slice(0,visibleCount);
  grid.innerHTML=shown.length?shown.map(a=>`<article class="card"><a class="card-image" href="${articleUrl(a)}"><img loading="lazy" decoding="async" width="1200" height="675" src="${imageUrl(a.image,800)}" srcset="${imageSet(a.image)}" sizes="(max-width: 680px) calc(100vw - 76px), (max-width: 900px) 44vw, 31vw" alt="${esc(a.alt)}"><span class="card-cat">${esc(a.category)}</span></a><div class="card-body"><div class="card-meta"><span>${esc(a.date)}</span><span>·</span><span>${a.minutes} min read</span></div><h3><a href="${articleUrl(a)}">${esc(a.title)}</a></h3><p>${esc(a.description)}</p><a class="card-read" href="${articleUrl(a)}">Read story </a></div></article>`).join(''):'<p class="empty">No stories match that search. Try another phrase.</p>';
  const more=document.getElementById('load-more-stories');
  const count=document.getElementById('story-result-count');
  if(count)count.textContent=list.length?`Showing ${shown.length} of ${list.length} stories`:'No stories found';
  if(more)more.hidden=shown.length>=list.length;
}
function drawFilters(){
  if(!filters)return;
  filters.innerHTML=categories.map(c=>`<button class="filter ${c===selected?'active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=b.dataset.cat;visibleCount=PAGE_SIZE;drawFilters();drawCards()});
}
drawFilters();drawCards();
if(search)search.addEventListener('input',()=>{visibleCount=PAGE_SIZE;drawCards()});
document.getElementById('load-more-stories')?.addEventListener('click',()=>{visibleCount+=PAGE_SIZE;drawCards()});
document.querySelectorAll('.topic-grid a[data-category]').forEach(link=>link.addEventListener('click',()=>{selected=link.dataset.category;visibleCount=PAGE_SIZE;drawFilters();drawCards()}));
})();
