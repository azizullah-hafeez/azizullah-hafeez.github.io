/* Compatibility for old post.html?id= links. Canonical articles keep their URLs. */
(()=>{
 const query=new URLSearchParams(location.search),id=query.get('id');
 const p=BLOG_POSTS.find(x=>x.id===id);
 const target=new URL(p?'article-'+p.id+'.html':'blog.html',location.href);
 const lang=query.get('lang')||localStorage.getItem('hafeez-language')||'en';
 if(['en','fa','ps','ar'].includes(lang))target.searchParams.set('lang',lang);
 const link=document.getElementById('legacyArticle');link.href=target.href;link.textContent=p?(p.title[lang]||p.title.en):'Blog / بلاگ';
 location.replace(target.href);
})();
