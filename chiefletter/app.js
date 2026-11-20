(function(){
const grid=document.getElementById('article-grid');
const filters=document.getElementById('filters');
const search=document.getElementById('search');
const articles=window.ARTICLES||[];
const categories=['All stories',...new Set(articles.map(a=>a.category))];
let selected='All stories';
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const imageUrl=(id,w=900)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
const articleUrl=a=>`articles/${encodeURIComponent(a.id)}/`;
function drawCards(){
  if(!grid)return;
  const q=(search?.value||'').toLowerCase().trim();
  const list=articles.filter(a=>(selected==='All stories'||a.category===selected)&&(!q||`${a.title} ${a.description} ${a.keywords} ${a.category}`.toLowerCase().includes(q)));
  grid.innerHTML=list.length?list.map(a=>`<article class="card"><a class="card-image" href="${articleUrl(a)}"><img loading="lazy" src="${imageUrl(a.image,800)}" alt="${esc(a.alt)}"><span class="card-cat">${esc(a.category)}</span></a><div class="card-body"><div class="card-meta"><span>${esc(a.date)}</span><span>·</span><span>${a.minutes} min read</span></div><h3><a href="${articleUrl(a)}">${esc(a.title)}</a></h3><p>${esc(a.description)}</p><a class="card-read" href="${articleUrl(a)}">Read story ↗</a></div></article>`).join(''):'<p class="empty">No stories match that search. Try another phrase.</p>';
}
function drawFilters(){
  if(!filters)return;
  filters.innerHTML=categories.map(c=>`<button class="filter ${c===selected?'active':''}" type="button" data-cat="${esc(c)}">${esc(c)}</button>`).join('');
  filters.querySelectorAll('button').forEach(b=>b.onclick=()=>{selected=b.dataset.cat;drawFilters();drawCards()});
}
drawFilters();drawCards();
if(search)search.addEventListener('input',drawCards);
document.querySelectorAll('.topic-grid a[data-category]').forEach(link=>link.addEventListener('click',()=>{selected=link.dataset.category;drawFilters();drawCards()}));
})();
