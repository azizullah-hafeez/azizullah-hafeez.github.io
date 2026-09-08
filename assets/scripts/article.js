/* One language controller for all standalone articles. */
function setLang(l){
 if(!['en','fa','ps','ar'].includes(l))l='en';
 document.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==l);
 document.querySelectorAll('[data-lang]').forEach(x=>x.classList.toggle('active',x.dataset.lang===l));
 document.documentElement.lang=l;document.documentElement.dir=l==='en'?'ltr':'rtl';
 localStorage.setItem('hafeez-language',l);
 const heading=document.querySelector('[data-panel="'+l+'"] h1');
 if(heading)document.title=heading.textContent.trim()+' — Azizullah Hafeez';
}
document.querySelectorAll('[data-lang]').forEach(x=>x.onclick=()=>setLang(x.dataset.lang));
setLang(new URLSearchParams(location.search).get('lang')||localStorage.getItem('hafeez-language')||'en');
