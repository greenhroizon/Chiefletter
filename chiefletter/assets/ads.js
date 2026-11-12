/* ChiefLetter responsive ad loader.
   - Chooses the ad size from the slot's REAL available width (not the window width).
   - Reserves the exact space before loading (no layout shift, nothing can overlap).
   - Loads lazily, re-fits on resize/rotation, hides a slot when no size fits. */
(function(){
  var SIZES={ // [w,h]
    '728x90':[728,90],'468x60':[468,60],'320x50':[320,50],'300x250':[300,250],'160x600':[160,600],'160x300':[160,300]
  };
  // per slot type: ordered list of preferred sizes (first that fits wins)
  var PREF={
    leader:['728x90','468x60','320x50'],
    inline:['728x90','300x250','468x60','320x50'],
    mobile:['300x250','320x50'],
    rect:['300x250'],
    rail:['160x600'],
    rail2:['160x300']
  };
  function avail(el){var w=el.clientWidth||0;if(!w&&el.parentNode)w=el.parentNode.clientWidth||0;return w}
  function pick(el){
    var t=el.getAttribute('data-t')||'inline',w=avail(el),list=PREF[t]||PREF.inline;
    if((t==='rail'||t==='rail2')&&window.innerWidth<1000)return null;
    for(var i=0;i<list.length;i++){if(SIZES[list[i]][0]<=w)return list[i]}
    return null;
  }
  function render(el,key){
    var s=SIZES[key],box=el.querySelector('.ad-box');
    if(!box){box=document.createElement('div');box.className='ad-box';el.appendChild(box)}
    box.style.width=s[0]+'px';box.style.height=s[1]+'px';
    el.style.minHeight=(s[1]+16)+'px';el.setAttribute('data-state','on');el.setAttribute('data-s',key);
    return box;
  }
  function mount(el){
    var key=pick(el);
    if(!key){el.setAttribute('data-state','off');el.removeAttribute('data-s');return}
    if(el.getAttribute('data-s')===key&&el.getAttribute('data-l')){return}
    var box=render(el,key);
    if(el.getAttribute('data-l')){ // already loaded at another size -> swap
      box.innerHTML='';injectFrame(box,key);
    }
  }
  function injectFrame(box,key){
    var s=SIZES[key],f=document.createElement('iframe');
    f.width=s[0];f.height=s[1];f.setAttribute('scrolling','no');f.setAttribute('frameborder','0');
    f.setAttribute('title','Advertisement');f.setAttribute('loading','lazy');f.src='/ads/'+key;
    box.appendChild(f);
  }
  function load(el){
    if(el.getAttribute('data-l'))return;
    var key=el.getAttribute('data-s');if(!key){mount(el);key=el.getAttribute('data-s');if(!key)return}
    el.setAttribute('data-l','1');injectFrame(el.querySelector('.ad-box'),key);
  }
  var slots=[].slice.call(document.querySelectorAll('.ad'));
  slots.forEach(mount);
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){load(e.target);io.unobserve(e.target)}})},{rootMargin:'300px 0px'});
    slots.forEach(function(s){io.observe(s)});
  }else{slots.forEach(load)}
  var t;function refit(){clearTimeout(t);t=setTimeout(function(){slots.forEach(mount)},250)}
  window.addEventListener('resize',refit);window.addEventListener('orientationchange',refit);
})();
