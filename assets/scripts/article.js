/* One language controller for all standalone articles. */
function setMediaShape(media){const img=media&&media.querySelector('img');if(!img)return;const apply=()=>{const ratio=(img.naturalWidth||Number(img.getAttribute('width')))/(img.naturalHeight||Number(img.getAttribute('height')));media.dataset.shape=ratio>1.15?'landscape':ratio<.87?'portrait':'square'};(img.complete||img.getAttribute('width'))?apply():img.addEventListener('load',apply,{once:true})}
function placeArticleMedia(l){const media=document.querySelector('[data-article-media]'),panel=document.querySelector('[data-panel="'+l+'"]'),intro=panel&&panel.querySelector('p');if(media&&intro){setMediaShape(media);intro.insertAdjacentElement('afterend',media);media.dataset.ready='true'}}
function setLang(l){
 if(!['en','fa','ps','ar'].includes(l))l='en';
 document.querySelectorAll('[data-panel]').forEach(x=>x.hidden=x.dataset.panel!==l);
 document.querySelectorAll('[data-lang]').forEach(x=>x.classList.toggle('active',x.dataset.lang===l));
 document.documentElement.lang=l;document.documentElement.dir=l==='en'?'ltr':'rtl';
 localStorage.setItem('hafeez-language',l);
 placeArticleMedia(l);
 const heading=document.querySelector('[data-panel="'+l+'"] h1');
 const seoNode=document.querySelector('script[data-article-seo]');
 let seo={};try{seo=seoNode?JSON.parse(seoNode.textContent)[l]||{}:{}}catch(e){}
 if(seo.title)document.title=seo.title;else if(heading)document.title=heading.textContent.trim()+' — Azizullah Hafeez';
 const description=document.querySelector('meta[name="description"]');if(description&&seo.description)description.content=seo.description;
 const ogTitle=document.querySelector('meta[property="og:title"]');if(ogTitle)ogTitle.content=seo.ogTitle||heading?.textContent.trim()||document.title;
 const ogDescription=document.querySelector('meta[property="og:description"]');if(ogDescription&&seo.description)ogDescription.content=seo.description;
 const url=new URL(location.href);const routed=['en','fa','ps','ar'].includes(url.pathname.split('/').filter(Boolean)[0]);if(routed)url.searchParams.delete('lang');else url.searchParams.set('lang',l);history.replaceState(null,'',url);
}
document.querySelectorAll('[data-lang]').forEach(x=>x.onclick=()=>setLang(x.dataset.lang));
setLang(['en','fa','ps','ar'].includes(document.documentElement.lang)?document.documentElement.lang:(new URLSearchParams(location.search).get('lang')||localStorage.getItem('hafeez-language')||'en'));
