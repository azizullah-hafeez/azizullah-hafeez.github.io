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
