/* One language controller for all standalone articles. */
function placeArticleMedia(l){const media=document.querySelector('[data-article-media]'),heading=document.querySelector('[data-panel="'+l+'"] h1');if(media&&heading){heading.insertAdjacentElement('afterend',media);media.dataset.ready='true'}}
function setLang(l){
 if(!['en','fa','ps','ar'].includes(l))l='en';
 document.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==l);
 document.querySelectorAll('[data-lang]').forEach(x=>x.classList.toggle('active',x.dataset.lang===l));
 document.documentElement.lang=l;document.documentElement.dir=l==='en'?'ltr':'rtl';
 localStorage.setItem('hafeez-language',l);
 placeArticleMedia(l);
 const heading=document.querySelector('[data-panel="'+l+'"] h1');
 if(heading)document.title=heading.textContent.trim()+' — Azizullah Hafeez';
}
document.querySelectorAll('[data-lang]').forEach(x=>x.onclick=()=>setLang(x.dataset.lang));
setLang(new URLSearchParams(location.search).get('lang')||localStorage.getItem('hafeez-language')||'en');

/* Shared article media: infer the crop from the real image dimensions. */
document.querySelectorAll('.article-media img').forEach(img=>{const apply=()=>{const ratio=(img.naturalWidth||Number(img.getAttribute('width')))/(img.naturalHeight||Number(img.getAttribute('height')));img.closest('.article-media').dataset.shape=ratio>1.15?'landscape':ratio<.87?'portrait':'square'};img.complete?apply():img.addEventListener('load',apply,{once:true})});
