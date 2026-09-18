/* Shared behaviour and translations for navigation, following and sharing. */
(()=>{
 const labels={
 en:{menu:'Menu',home:'Home',work:'Work',research:'Research',blog:'Blog',courses:'Courses',activities:'Activities',media:'Media',works:'Publications',contact:'Connect',share:'Share this article',copy:'Copy link',copied:'Copied!',follow:'Follow'},
 fa:{menu:'فهرست',home:'خانه',work:'حوزه‌های کاری',research:'پژوهش',blog:'بلاگ',courses:'دوره‌ها',activities:'فعالیت‌ها',media:'رسانه',works:'آثار',contact:'ارتباط',share:'اشتراک‌گذاری مقاله',copy:'کپی لینک',copied:'کپی شد!',follow:'دنبال کنید'},
 ps:{menu:'غورنۍ',home:'کور',work:'د کار برخې',research:'څېړنه',blog:'بلاګ',courses:'کورسونه',activities:'فعالیتونه',media:'رسنۍ',works:'آثار',contact:'اړیکه',share:'مقاله شریکه کړئ',copy:'لینک کاپي کړئ',copied:'کاپي شو!',follow:'تعقیب کړئ'},
 ar:{menu:'القائمة',home:'الرئيسية',work:'مجالات العمل',research:'البحث',blog:'المدونة',courses:'الدورات',activities:'الأنشطة',media:'الإعلام',works:'المؤلفات',contact:'تواصل',share:'مشاركة المقال',copy:'نسخ الرابط',copied:'تم النسخ!',follow:'تابعني'}};
 const nav=document.getElementById('siteNav'),menu=nav.querySelector('.unified-menu'),links=nav.querySelector('.unified-links');
 function close(){menu.setAttribute('aria-expanded','false');links.classList.remove('open')}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open)});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu.focus()}});
 links.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 const height=()=>{if(!links.classList.contains('open'))document.documentElement.style.setProperty('--site-nav-height',nav.offsetHeight+'px')};
 const compact=()=>{nav.classList.toggle('nav-compact',scrollY>40);height()};
 window.addEventListener('scroll',compact,{passive:true});window.addEventListener('resize',height);new ResizeObserver(height).observe(nav);compact();
 const language=()=>labels[document.documentElement.lang]?document.documentElement.lang:'en';
 function shareUrl(){const u=new URL(location.href);u.hash='';u.searchParams.set('lang',language());return u.href}
 function refresh(){
 const lang=language(),t=labels[lang];
 document.querySelectorAll('[data-site-label]').forEach(e=>e.textContent=t[e.dataset.siteLabel]);
 document.querySelectorAll('[data-follow-label]').forEach(e=>e.textContent=t.follow);
 nav.querySelectorAll('[data-lang]').forEach(e=>e.classList.toggle('active',e.dataset.lang===lang));
 const page=location.pathname.split('/').pop()||'index.html';
 links.querySelectorAll('a').forEach(a=>{const match=a.getAttribute('href')===page||(page.startsWith('article-')||page==='post.html')&&a.getAttribute('href')==='blog.html';if(match)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 const u=encodeURIComponent(shareUrl()),title=encodeURIComponent(document.querySelector('[data-panel]:not([hidden]) h1')?.textContent.trim()||document.title);
 const urls={telegram:'https://t.me/share/url?url='+u+'&text='+title,whatsapp:'https://wa.me/?text='+title+'%20'+u,facebook:'https://www.facebook.com/sharer/sharer.php?u='+u,x:'https://twitter.com/intent/tweet?text='+title+'&url='+u};
 document.querySelectorAll('[data-share-tools]').forEach(g=>{g.querySelector('[data-share-label]').textContent=t.share;g.querySelector('[data-share-copy]').textContent=t.copy;g.querySelectorAll('[data-share-network]').forEach(a=>a.href=urls[a.dataset.shareNetwork])});
 }
 document.querySelectorAll('[data-share-copy]').forEach(b=>b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(shareUrl());b.textContent=labels[language()].copied;setTimeout(refresh,1600)}catch{window.prompt(labels[language()].copy,shareUrl())}}));
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 nav.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>{close();setTimeout(refresh,0)}));
 const requested=new URLSearchParams(location.search).get('lang');if(labels[requested])nav.querySelector('[data-lang="'+requested+'"]').click();
 refresh();
})();

/* Progressive motion: content stays visible if animation support is absent. */
/* Lightweight lighting, with no animation loop and no touch tracking. */
(()=>{
 document.querySelectorAll('header .hero,body>.hero').forEach(hero=>{
  if(hero.tagName==='IMG')return;
  const light=document.createElement('span');light.className='site-ambient';
  light.setAttribute('aria-hidden','true');hero.append(light);
 });
 const pointer=matchMedia('(hover: hover) and (pointer: fine)');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0,pending=null;
 const selector='.card,.pillar,.feature,.topic,.media-card';
 document.addEventListener('pointermove',event=>{
  if(!pointer.matches||reduced.matches)return;
  const card=event.target.closest?.(selector);if(!card)return;
  pending={card,x:event.clientX,y:event.clientY};
  if(frame)return;
  frame=requestAnimationFrame(()=>{
   frame=0;if(!pending||reduced.matches||!pointer.matches)return;
   const {card,x,y}=pending;pending=null;
   if(!card.isConnected)return;
   const rect=card.getBoundingClientRect();
   card.style.setProperty('--light-x',(x-rect.left)+'px');
   card.style.setProperty('--light-y',(y-rect.top)+'px');
  });
 },{passive:true});
})();
(()=>{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const running=new Set();
 function enter(element,delay=0){
  if(reduced.matches||!element.animate||!element.getClientRects().length)return;
  const animation=element.animate([
   {opacity:.25,transform:'translateY(16px)'},
   {opacity:1,transform:'translateY(0)'}
  ],{duration:520,delay,easing:'cubic-bezier(.22,1,.36,1)'});
  running.add(animation);
  animation.finished.catch(()=>{}).finally(()=>running.delete(animation));
 }
 reduced.addEventListener('change',()=>{if(reduced.matches)running.forEach(a=>a.cancel())});
 document.querySelectorAll('header .hero>*:not(.site-ambient),body>.hero>*:not(.site-ambient),body[data-article] main h1').forEach((el,i)=>{
  if(el.getBoundingClientRect().top<innerHeight)enter(el,Math.min(i,2)*70);
 });
 const selector='.section-head,.pillar,.card,.feature,.topic,.work,.media-card,.video,.step,.quote blockquote';
 if('IntersectionObserver' in window){
  const seen=new WeakSet();
  const observer=new IntersectionObserver(entries=>{
   let stagger=0;
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    enter(entry.target,Math.min(stagger++,3)*55);
    observer.unobserve(entry.target);
   });
  },{threshold:.08});
  function observe(root){
   const elements=[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
   elements.forEach(el=>{if(!seen.has(el)){seen.add(el);observer.observe(el)}});
  }
  observe(document);
  // Blog, activities and courses rebuild their cards when language/filter changes.
  document.querySelectorAll('#posts,#cards,#grid,.video-grid').forEach(container=>{
   new MutationObserver(records=>records.forEach(record=>{
    record.removedNodes.forEach(node=>{
     if(node.nodeType!==1)return;
     observer.unobserve(node);node.querySelectorAll(selector).forEach(el=>observer.unobserve(el));
    });
    record.addedNodes.forEach(node=>{if(node.nodeType===1)observe(node)});
   })).observe(container,{childList:true});
  });
 }
 let previousLanguage=document.documentElement.lang;
 new MutationObserver(()=>{
  if(document.documentElement.lang===previousLanguage)return;
  previousLanguage=document.documentElement.lang;
  // A short fade avoids moving a long article or interrupting its reading position.
  document.querySelectorAll('.hero h1,[data-panel]:not([hidden]) h1').forEach(el=>enter(el));
 }).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(document.body.hasAttribute('data-article')){
  const progress=document.createElement('div');progress.className='site-progress';
  progress.setAttribute('aria-hidden','true');document.body.append(progress);
  let scheduled=false;
  function update(){
   const distance=document.documentElement.scrollHeight-innerHeight;
   progress.style.transform='scaleX('+(distance>0?Math.max(0,Math.min(1,scrollY/distance)):0)+')';
   scheduled=false;
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);window.addEventListener('pageshow',schedule);
  if('ResizeObserver' in window)new ResizeObserver(schedule).observe(document.body);
  update();
 }
})();
