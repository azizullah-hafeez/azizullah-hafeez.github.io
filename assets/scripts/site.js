/* Shared behaviour and translations for navigation, following and sharing. */
(()=>{
 const labels={
 en:{menu:'Menu',home:'Home',work:'Work',research:'Research',blog:'Blog',courses:'Courses',activities:'Activities',media:'Media',works:'Publications',contact:'Connect',share:'Share this article',copy:'Copy link',copied:'Copied!',follow:'Follow'},
 fa:{menu:'فهرست',home:'خانه',work:'حوزه‌های کاری',research:'پژوهش',blog:'بلاگ',courses:'دوره‌ها',activities:'فعالیت‌ها',media:'رسانه',works:'آثار',contact:'ارتباط',share:'اشتراک‌گذاری مقاله',copy:'کپی لینک',copied:'کپی شد!',follow:'دنبال کنید'},
 ps:{menu:'غورنۍ',home:'کور',work:'د کار برخې',research:'څېړنه',blog:'بلاګ',courses:'کورسونه',activities:'فعالیتونه',media:'رسنۍ',works:'آثار',contact:'اړیکه',share:'مقاله شریکه کړئ',copy:'لینک کاپي کړئ',copied:'کاپي شو!',follow:'تعقیب کړئ'},
 ar:{menu:'القائمة',home:'الرئيسية',work:'مجالات العمل',research:'البحث',blog:'المدونة',courses:'الدورات',activities:'الأنشطة',media:'الإعلام',works:'المؤلفات',contact:'تواصل',share:'مشاركة المقال',copy:'نسخ الرابط',copied:'تم النسخ!',follow:'تابعني'}};
 const nav=document.getElementById('siteNav'),menu=nav.querySelector('.unified-menu'),links=nav.querySelector('.unified-links');
 const supported=['en','fa','ps','ar'];
 const pathParts=location.pathname.split('/').filter(Boolean);
 const routeLang=supported.includes(pathParts[0])?pathParts[0]:null;
 if(routeLang){try{localStorage.setItem('hafeez-language',routeLang)}catch(_){}}
 function close(){menu.setAttribute('aria-expanded','false');links.classList.remove('open')}
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));links.classList.toggle('open',open)});
 nav.addEventListener('keydown',e=>{if(e.key==='Escape'){close();menu.focus()}});
 links.addEventListener('click',e=>{if(e.target.closest('a'))close()});
 const compact=()=>nav.classList.toggle('nav-compact',scrollY>40);
 window.addEventListener('scroll',compact,{passive:true});compact();
 const language=()=>labels[document.documentElement.lang]?document.documentElement.lang:'en';
 const pageSeoMeta={
  'index.html':{
   en:['Azizullah Hafeez — Scholar, Educator & Public Thinker','Azizullah Hafeez is a scholar of comparative religion, assistant professor, research leader, and public educator based in Herat, Afghanistan.'],
   fa:['عزیزالله حفیظ — پژوهشگر، استاد دانشگاه و اندیشه‌ورز عمومی','وب‌سایت رسمی عزیزالله حفیظ؛ پژوهشگر مطالعات ادیان، پوهنیار، مدیر مرکز تحقیقات علمی و نویسنده در هرات افغانستان.'],
   ps:['عزیزالله حفیظ — څېړونکی، د پوهنتون استاد او عامه لیکوال','د عزیزالله حفیظ رسمي وېبپاڼه؛ د ادیانو څېړونکی، د پوهنتون استاد، د علمي څېړنو مدیر او لیکوال په هرات، افغانستان کې.'],
   ar:['عزيز الله حفيظ — باحث وأستاذ جامعي ومفكر عام','الموقع الرسمي لعزيز الله حفيظ؛ باحث في مقارنة الأديان، وأستاذ جامعي، ومدير للبحث العلمي وكاتب في هرات، أفغانستان.']
  },
  'blog.html':{
   en:['Articles & Essays — Azizullah Hafeez','Articles and essays by Azizullah Hafeez on religion, society, research, artificial intelligence, history, and human development.'],
   fa:['مقالات و یادداشت‌ها — عزیزالله حفیظ','مقالات و یادداشت‌های عزیزالله حفیظ دربارهٔ دین، جامعه، پژوهش، هوش مصنوعی، تاریخ و رشد انسانی.'],
   ps:['مقالې او لیکنې — عزیزالله حفیظ','د عزیزالله حفیظ مقالې او لیکنې د دین، ټولنې، څېړنې، مصنوعي ځیرکتیا، تاریخ او انساني ودې په اړه.'],
   ar:['المقالات والكتابات — عزيز الله حفيظ','مقالات وكتابات عزيز الله حفيظ في الدين والمجتمع والبحث والذكاء الاصطناعي والتاريخ والتنمية الإنسانية.']
  },
  'activities.html':{
   en:['Activities & Academic Portfolio — Azizullah Hafeez','Selected research, conferences, seminars, teaching, media, and academic activities by Azizullah Hafeez.'],
   fa:['فعالیت‌ها و کارنامهٔ علمی — عزیزالله حفیظ','گزیده‌ای از پژوهش‌ها، کنفرانس‌ها، سمینارها، تدریس و فعالیت‌های علمی و رسانه‌ای عزیزالله حفیظ.'],
   ps:['فعالیتونه او علمي کارنامه — عزیزالله حفیظ','د عزیزالله حفیظ د څېړنو، کنفرانسونو، سیمینارونو، تدریس او علمي او رسنیزو فعالیتونو ټاکل شوې کارنامه.'],
   ar:['الأنشطة والسجل الأكاديمي — عزيز الله حفيظ','مختارات من أبحاث عزيز الله حفيظ ومؤتمراته وندواته وتدريسه وأنشطته الأكاديمية والإعلامية.']
  },
  'courses.html':{
   en:['Courses & Private Guidance — Azizullah Hafeez','Online courses and private guidance in languages, research methods, and personal development by Azizullah Hafeez.'],
   fa:['دوره‌ها و راهنمایی خصوصی — عزیزالله حفیظ','دوره‌های آنلاین و راهنمایی خصوصی عزیزالله حفیظ در زبان، روش تحقیق و توسعهٔ فردی.'],
   ps:['کورسونه او خصوصي لارښوونه — عزیزالله حفیظ','د عزیزالله حفیظ آنلاین کورسونه او خصوصي لارښوونه د ژبو، څېړنې میتود او فردي پرمختګ په برخو کې.'],
   ar:['الدورات والإرشاد الخاص — عزيز الله حفيظ','دورات عبر الإنترنت وإرشاد خاص من عزيز الله حفيظ في اللغات ومناهج البحث والتطوير الشخصي.']
  },
  'media.html':{
   en:['Media, Television & YouTube — Azizullah Hafeez','Television appearances, educational conversations, and YouTube programmes featuring Azizullah Hafeez.'],
   fa:['رسانه، تلویزیون و یوتیوب — عزیزالله حفیظ','حضورهای تلویزیونی، گفت‌وگوهای آموزشی و برنامه‌های یوتیوب با حضور عزیزالله حفیظ.'],
   ps:['رسنۍ، تلویزیون او یوټیوب — عزیزالله حفیظ','د عزیزالله حفیظ تلویزیوني ګډونونه، ښوونیزې خبرې او یوټیوب پروګرامونه.'],
   ar:['الإعلام والتلفزيون ويوتيوب — عزيز الله حفيظ','مشاركات عزيز الله حفيظ التلفزيونية والحوارات التعليمية وبرامج يوتيوب.']
  }
 };
 function syncSearchMetadata(){
  const supported=['en','fa','ps','ar'],parts=location.pathname.split('/').filter(Boolean),route=supported.includes(parts[0])?parts[0]:null;
  const logical=(route?parts.slice(1):parts).join('/')||'index.html',suffix=logical==='index.html'?'':logical;
  const requested=new URLSearchParams(location.search).get('lang'),effective=route||supported.includes(requested)&&requested||null;
  const xDefault=location.origin+'/'+suffix,langUrl=l=>location.origin+'/'+l+'/'+suffix;
  const canonical=document.querySelector('link[rel="canonical"]')||document.head.appendChild(Object.assign(document.createElement('link'),{rel:'canonical'}));
  canonical.href=effective?langUrl(effective):xDefault;
  for(const l of supported){let a=document.querySelector('link[rel="alternate"][hreflang="'+l+'"]');if(!a){a=document.createElement('link');a.rel='alternate';a.hreflang=l;document.head.appendChild(a)}a.href=langUrl(l)}
  let xd=document.querySelector('link[rel="alternate"][hreflang="x-default"]');if(!xd){xd=document.createElement('link');xd.rel='alternate';xd.hreflang='x-default';document.head.appendChild(xd)}xd.href=xDefault;
  const og=document.querySelector('meta[property="og:url"]');if(og)og.content=canonical.href;
  const currentLang=effective||language(),meta=pageSeoMeta[logical]?.[currentLang];
  if(meta){document.title=meta[0];let d=document.querySelector('meta[name="description"]');if(!d){d=document.createElement('meta');d.name='description';document.head.appendChild(d)}d.content=meta[1]}
  document.querySelectorAll('script[data-generated-seo-runtime]').forEach(x=>x.remove());
  const schema=document.createElement('script');schema.type='application/ld+json';schema.dataset.generatedSeoRuntime='';
  if(logical==='index.html'){
   schema.textContent=JSON.stringify({'@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':location.origin+'/#website','url':location.origin+'/','name':'Azizullah Hafeez','inLanguage':supported},
    {'@type':'ProfilePage','@id':canonical.href+'#profile','url':canonical.href,'inLanguage':currentLang,'mainEntity':{'@type':'Person','@id':location.origin+'/#person','name':'Azizullah Hafeez','url':location.origin+'/','jobTitle':'Assistant Professor and Director of the Scientific Research Centre','affiliation':{'@type':'Organization','name':'Ghalib University'},'knowsLanguage':['Dari','Pashto','English','Arabic'],'sameAs':['https://www.instagram.com/azizullah.hafeez/','https://www.facebook.com/ahia74','https://www.youtube.com/@AzizullahHafeez','https://medium.com/@ahia74']}}
   ]});
  }else{
   const home=route?location.origin+'/'+route+'/':location.origin+'/';
   schema.textContent=JSON.stringify({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
    {'@type':'ListItem','position':1,'name':'Home','item':home},
    {'@type':'ListItem','position':2,'name':document.title,'item':canonical.href}
   ]});
  }
  document.head.appendChild(schema);
  document.querySelectorAll('script[type="application/ld+json"]:not([data-generated-seo-runtime])').forEach(s=>{try{const data=JSON.parse(s.textContent),walk=o=>{if(Array.isArray(o))return o.map(walk);if(!o||typeof o!=='object')return o;const t=o['@type'],types=new Set(Array.isArray(t)?t:[t]);if(types.has('Article')||types.has('BlogPosting')||types.has('NewsArticle')){o.mainEntityOfPage=canonical.href;o.inLanguage=currentLang}if(types.has('ResearchProject')){o.url=canonical.href;o.inLanguage=currentLang}for(const k in o)if(o[k]&&typeof o[k]==='object')o[k]=walk(o[k]);return o};s.textContent=JSON.stringify(walk(data))}catch(_){}});
 }
 syncSearchMetadata();
 function shareUrl(){const u=new URL(location.href);u.hash='';if(routeLang)u.searchParams.delete('lang');else u.searchParams.set('lang',language());return u.href}
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
 if(routeLang){
  document.addEventListener('click',e=>{
   const b=e.target.closest?.('[data-lang]');if(!b)return;
   const next=b.dataset.lang;if(!supported.includes(next))return;
   const page=pathParts.slice(1).join('/')||'index.html';
   const dest='/'+next+'/'+(page==='index.html'?'':page)+location.hash;
   try{localStorage.setItem('hafeez-language',next)}catch(_){}
   e.preventDefault();e.stopImmediatePropagation();location.assign(dest);
  },true);
  document.addEventListener('click',e=>{
   if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
   const a=e.target.closest?.('a[href]');if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
   const raw=a.getAttribute('href');if(!raw||raw.startsWith('#')||raw.startsWith('mailto:')||raw.startsWith('tel:')||raw.startsWith('javascript:'))return;
   const u=new URL(raw,location.origin+'/');if(u.origin!==location.origin)return;
   const parts=u.pathname.split('/').filter(Boolean);if(supported.includes(parts[0]))return;
   const clean=u.pathname==='/'?'':u.pathname.replace(/^\//,'');
   e.preventDefault();location.assign('/'+routeLang+'/'+clean+u.search+u.hash);
  },true);
 }
 const requested=new URLSearchParams(location.search).get('lang');if(!routeLang&&labels[requested])nav.querySelector('[data-lang="'+requested+'"]').click();
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
