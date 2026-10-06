#!/usr/bin/env python3
"""Build every public page from shared includes, including multilingual SEO metadata."""
from pathlib import Path
import re, hashlib, json, subprocess
ROOT=Path(__file__).resolve().parents[1]
BASE='https://azizullah-hafeez.github.io'
LANGS=('en','fa','ps','ar')
RTL={'fa','ps','ar'}

def expand(text, stack=()):
 def include(m):
  name=m[1]
  if name in stack: raise ValueError('Circular include: '+name)
  path=ROOT/'templates/includes'/name
  if not path.is_file(): raise ValueError('Missing include: '+name)
  return expand(path.read_text(),stack+(name,))
 return re.sub(r'\{\{ include: ([\w.-]+) \}\}',include,text)

analytics=expand('{{ include: cloudflare-analytics.html }}')
lang_init='''<script data-lang-init>
(()=>{try{const r=document.documentElement,v=['en','fa','ps','ar'],p=location.pathname.split('/').filter(Boolean)[0],q=new URLSearchParams(location.search).get('lang'),s=localStorage.getItem('hafeez-language'),i=r.lang;const l=v.includes(p)?p:v.includes(q)?q:v.includes(s)?s:v.includes(i)?i:'en';r.lang=l;r.dir=l==='en'?'ltr':'rtl'}catch(_){}})();
</script>
<base href="/">'''

PAGE_SEO={
 'index.html':{
  'en':('Azizullah Hafeez — Scholar, Educator & Public Thinker','Azizullah Hafeez is a scholar of comparative religion, assistant professor, research leader, and public educator based in Herat, Afghanistan.'),
  'fa':('عزیزالله حفیظ — پژوهشگر، استاد دانشگاه و اندیشه‌ورز عمومی','وب‌سایت رسمی عزیزالله حفیظ؛ پژوهشگر مطالعات ادیان، پوهنیار، مدیر مرکز تحقیقات علمی و نویسنده در هرات افغانستان.'),
  'ps':('عزیزالله حفیظ — څېړونکی، د پوهنتون استاد او عامه لیکوال','د عزیزالله حفیظ رسمي وېبپاڼه؛ د ادیانو څېړونکی، د پوهنتون استاد، د علمي څېړنو مدیر او لیکوال په هرات، افغانستان کې.'),
  'ar':('عزيز الله حفيظ — باحث وأستاذ جامعي ومفكر عام','الموقع الرسمي لعزيز الله حفيظ؛ باحث في مقارنة الأديان، وأستاذ جامعي، ومدير للبحث العلمي وكاتب في هرات، أفغانستان.')
 },
 'blog.html':{
  'en':('Articles & Essays — Azizullah Hafeez','Articles and essays by Azizullah Hafeez on religion, society, research, artificial intelligence, history, and human development.'),
  'fa':('مقالات و یادداشت‌ها — عزیزالله حفیظ','مقالات و یادداشت‌های عزیزالله حفیظ دربارهٔ دین، جامعه، پژوهش، هوش مصنوعی، تاریخ و رشد انسانی.'),
  'ps':('مقالې او لیکنې — عزیزالله حفیظ','د عزیزالله حفیظ مقالې او لیکنې د دین، ټولنې، څېړنې، مصنوعي ځیرکتیا، تاریخ او انساني ودې په اړه.'),
  'ar':('المقالات والكتابات — عزيز الله حفيظ','مقالات وكتابات عزيز الله حفيظ في الدين والمجتمع والبحث والذكاء الاصطناعي والتاريخ والتنمية الإنسانية.')
 },
 'activities.html':{
  'en':('Activities & Academic Portfolio — Azizullah Hafeez','Selected research, conferences, seminars, teaching, media, and academic activities by Azizullah Hafeez.'),
  'fa':('فعالیت‌ها و کارنامهٔ علمی — عزیزالله حفیظ','گزیده‌ای از پژوهش‌ها، کنفرانس‌ها، سمینارها، تدریس و فعالیت‌های علمی و رسانه‌ای عزیزالله حفیظ.'),
  'ps':('فعالیتونه او علمي کارنامه — عزیزالله حفیظ','د عزیزالله حفیظ د څېړنو، کنفرانسونو، سیمینارونو، تدریس او علمي او رسنیزو فعالیتونو ټاکل شوې کارنامه.'),
  'ar':('الأنشطة والسجل الأكاديمي — عزيز الله حفيظ','مختارات من أبحاث عزيز الله حفيظ ومؤتمراته وندواته وتدريسه وأنشطته الأكاديمية والإعلامية.')
 },
 'courses.html':{
  'en':('Courses & Private Guidance — Azizullah Hafeez','Online courses and private guidance in languages, research methods, and personal development by Azizullah Hafeez.'),
  'fa':('دوره‌ها و راهنمایی خصوصی — عزیزالله حفیظ','دوره‌های آنلاین و راهنمایی خصوصی عزیزالله حفیظ در زبان، روش تحقیق و توسعهٔ فردی.'),
  'ps':('کورسونه او خصوصي لارښوونه — عزیزالله حفیظ','د عزیزالله حفیظ آنلاین کورسونه او خصوصي لارښوونه د ژبو، څېړنې میتود او فردي پرمختګ په برخو کې.'),
  'ar':('الدورات والإرشاد الخاص — عزيز الله حفيظ','دورات عبر الإنترنت وإرشاد خاص من عزيز الله حفيظ في اللغات ومناهج البحث والتطوير الشخصي.')
 },
 'media.html':{
  'en':('Media, Television & YouTube — Azizullah Hafeez','Television appearances, educational conversations, and YouTube programmes featuring Azizullah Hafeez.'),
  'fa':('رسانه، تلویزیون و یوتیوب — عزیزالله حفیظ','حضورهای تلویزیونی، گفت‌وگوهای آموزشی و برنامه‌های یوتیوب با حضور عزیزالله حفیظ.'),
  'ps':('رسنۍ، تلویزیون او یوټیوب — عزیزالله حفیظ','د عزیزالله حفیظ تلویزیوني ګډونونه، ښوونیزې خبرې او یوټیوب پروګرامونه.'),
  'ar':('الإعلام والتلفزيون ويوتيوب — عزيز الله حفيظ','مشاركات عزيز الله حفيظ التلفزيونية والحوارات التعليمية وبرامج يوتيوب.')
 }
}

def version(m):
 attr,path=m.groups();p=ROOT/path
 if not p.is_file(): raise ValueError('Missing asset: '+path)
 return f'{attr}="{path}?v={hashlib.sha256(p.read_bytes()).hexdigest()[:12]}"'

def page_url(filename,lang=None):
 suffix='' if filename=='index.html' else filename
 if lang:
  return f'{BASE}/{lang}/'+suffix
 return f'{BASE}/'+suffix

def set_html_language(text,lang):
 if not lang: return text
 def repl(m):
  attrs=re.sub(r'\s+(?:lang|dir)="[^"]*"','',m.group(1))
  return f'<html{attrs} lang="{lang}" dir="{"rtl" if lang in RTL else "ltr"}">'
 return re.sub(r'<html([^>]*)>',repl,text,count=1,flags=re.I)

def set_meta(text,name,value,property_attr=False):
 attr='property' if property_attr else 'name'
 pattern=rf'<meta\s+{attr}="{re.escape(name)}"\s+content="[^"]*"\s*/?>'
 tag=f'<meta {attr}="{name}" content="{value}">'
 if re.search(pattern,text,re.I):
  return re.sub(pattern,tag,text,count=1,flags=re.I)
 return text.replace('</head>',tag+'\n</head>',1)

def set_title(text,value):
 if re.search(r'<title>.*?</title>',text,re.I|re.S):
  return re.sub(r'<title>.*?</title>',f'<title>{value}</title>',text,count=1,flags=re.I|re.S)
 return text.replace('</head>',f'<title>{value}</title>\n</head>',1)

def localized_seo(text,filename,lang):
 if not lang: return text
 data={}
 m=re.search(r'<script type="application/json" data-article-seo>(.*?)</script>',text,re.S)
 if m:
  try: data=json.loads(m.group(1)).get(lang,{})
  except Exception: data={}
 if not data and filename in PAGE_SEO:
  title,desc=PAGE_SEO[filename][lang]
  data={'title':title,'ogTitle':title,'description':desc}
 if data.get('title'): text=set_title(text,data['title'])
 if data.get('description'): text=set_meta(text,'description',data['description'])
 if data.get('ogTitle'): text=set_meta(text,'og:title',data['ogTitle'],True)
 if data.get('description'): text=set_meta(text,'og:description',data['description'],True)
 return text

def alternate_tags(filename):
 tags=[]
 for l in LANGS:
  tags.append(f'<link rel="alternate" hreflang="{l}" href="{page_url(filename,l)}">')
 tags.append(f'<link rel="alternate" hreflang="x-default" href="{page_url(filename)}">')
 return '\n'.join(tags)

def set_canonical_and_alternates(text,filename,lang):
 canonical=page_url(filename,lang) if lang else page_url(filename)
 text=re.sub(r'<link\s+rel="alternate"[^>]*hreflang="[^"]+"[^>]*>\s*','',text,flags=re.I)
 tag=f'<link rel="canonical" href="{canonical}">'
 pattern=r'<link\s+rel="canonical"[^>]*>'
 if re.search(pattern,text,re.I):
  text=re.sub(pattern,tag,text,count=1,flags=re.I)
 else:
  text=text.replace('</head>',tag+'\n</head>',1)
 text=text.replace(tag,tag+'\n'+alternate_tags(filename),1)
 if re.search(r'<meta\s+property="og:url"\s+content="[^"]*"\s*/?>',text,re.I):
  text=re.sub(r'<meta\s+property="og:url"\s+content="[^"]*"\s*/?>',f'<meta property="og:url" content="{canonical}">',text,count=1,flags=re.I)
 return text,canonical

def patch_jsonld(text,canonical,lang):
 def transform(obj):
  if isinstance(obj,list):
   return [transform(x) for x in obj]
  if not isinstance(obj,dict): return obj
  typ=obj.get('@type')
  types=set(typ if isinstance(typ,list) else [typ])
  if types & {'Article','BlogPosting','NewsArticle'}:
   obj['mainEntityOfPage']=canonical
   if lang: obj['inLanguage']=lang
  if 'ResearchProject' in types:
   obj['url']=canonical
   if lang: obj['inLanguage']=lang
  if 'ProfilePage' in types:
   obj['url']=canonical
   if lang: obj['inLanguage']=lang
  for k,v in list(obj.items()):
   if isinstance(v,(dict,list)): obj[k]=transform(v)
  return obj
 def repl(m):
  try:
   data=json.loads(m.group(1))
   data=transform(data)
   return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False,separators=(',',':'))+'</script>'
  except Exception:
   return m.group(0)
 return re.sub(r'<script type="application/ld\+json">(.*?)</script>',repl,text,flags=re.S)

def title_text(text):
 m=re.search(r'<title>(.*?)</title>',text,re.I|re.S)
 return re.sub(r'<[^>]+>','',m.group(1)).strip() if m else 'Azizullah Hafeez'

def add_generated_schema(text,filename,canonical,lang):
 text=re.sub(r'<script type="application/ld\+json" data-generated-seo="(?:profile|breadcrumb)">.*?</script>\s*','',text,flags=re.S)
 if filename=='index.html':
  profile={
   '@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':BASE+'/#website','url':BASE+'/','name':'Azizullah Hafeez','inLanguage':list(LANGS)},
    {'@type':'ProfilePage','@id':canonical+'#profile','url':canonical,'inLanguage':lang or list(LANGS),
     'mainEntity':{'@type':'Person','@id':BASE+'/#person','name':'Azizullah Hafeez','url':BASE+'/',
      'jobTitle':'Assistant Professor and Director of the Scientific Research Centre',
      'affiliation':{'@type':'Organization','name':'Ghalib University'},
      'knowsLanguage':['Dari','Pashto','English','Arabic'],
      'sameAs':['https://www.instagram.com/azizullah.hafeez/','https://www.facebook.com/ahia74','https://www.youtube.com/@AzizullahHafeez','https://medium.com/@ahia74']}}
   ]}
  script='<script type="application/ld+json" data-generated-seo="profile">'+json.dumps(profile,ensure_ascii=False,separators=(',',':'))+'</script>'
 else:
  home=page_url('index.html',lang) if lang else page_url('index.html')
  breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[
   {'@type':'ListItem','position':1,'name':'Home','item':home},
   {'@type':'ListItem','position':2,'name':title_text(text),'item':canonical}
  ]}
  script='<script type="application/ld+json" data-generated-seo="breadcrumb">'+json.dumps(breadcrumb,ensure_ascii=False,separators=(',',':'))+'</script>'
 return text.replace('</head>',script+'\n</head>',1)

def decorate(text,filename,lang=None):
 text=set_html_language(text,lang)
 text=localized_seo(text,filename,lang)
 text,canonical=set_canonical_and_alternates(text,filename,lang)
 text=patch_jsonld(text,canonical,lang)
 text=add_generated_schema(text,filename,canonical,lang)
 if 'fonts.css' in text and 'rel="preconnect" href="https://fonts.googleapis.com"' not in text:
  text=text.replace('</head>','<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n</head>',1)
 return text

sources=sorted((ROOT/'templates/pages').glob('*.html'))
managed_posts=[]
for source in sources:
 raw=source.read_text()
 marker=re.search(r'<script type="application/json" data-article-index>(.*?)</script>',raw,re.S)
 if marker: managed_posts.append(json.loads(marker.group(1)))
post_file=ROOT/'posts.js'
node_script="const fs=require('fs');const s=fs.readFileSync('posts.js','utf8').replace(/^const BLOG_POSTS=/,'globalThis.BLOG_POSTS=');eval(s);process.stdout.write(JSON.stringify(globalThis.BLOG_POSTS))"
existing=json.loads(subprocess.check_output(['node','-e',node_script],cwd=ROOT,text=True))
if managed_posts:
 managed_ids={post['id'] for post in managed_posts}
 combined=managed_posts+[post for post in existing if post['id'] not in managed_ids]
 combined.sort(key=lambda post:post['date'],reverse=True)
 post_file.write_text('const BLOG_POSTS='+json.dumps(combined,ensure_ascii=False,separators=(',',':'))+';\n')
 existing=combined

for source in sources:
 text=expand(source.read_text())
 if 'data-lang-init' not in text:
  text=text.replace('<head>',f'<head>\n{lang_init}',1)
 if source.name=='blog.html':
  text=re.sub(r'(<span class="count" data-i18n="count">)\d+( articles</span>)',rf'\g<1>{len(existing)}\g<2>',text)
 if 'data-cf-beacon=' not in text:
  text=text.replace('</head>',f'{analytics}\n</head>',1)
 text=re.sub(r'(src|href)="((?:assets/[^"?]+\.(?:css|js)|fonts\.css|posts\.js))(?:\?[^"]*)?"',version,text)
 if '{{ include:' in text: raise ValueError('Unresolved template')
 (ROOT/source.name).write_text(decorate(text,source.name))
 for lang in LANGS:
  folder=ROOT/lang;folder.mkdir(exist_ok=True)
  (folder/source.name).write_text(decorate(text,source.name,lang))

base_urls=[
 ('','2026-09-05','monthly','1.0'),('blog.html',None,'weekly','0.9'),
 ('activities.html','2026-10-06',None,None),('media.html','2026-09-05',None,None),
 ('courses.html','2026-09-06','weekly','0.9'),
 ('event-ai-culture-webinar.html','2026-09-23','monthly','0.8'),
 ('activity-herat-domestic-products-research.html','2026-09-30','weekly','0.8'),
 ('activity-marghinani-conference-2026.html','2026-10-06','monthly','0.9')]
articles=[]
for source in sources:
 if not source.name.startswith('article-'): continue
 raw=source.read_text()
 date=re.search(r'<meta property="article:published_time" content="([0-9-]+)"',raw)
 if not date: date=re.search(r'<div class="meta">([0-9-]+)',raw)
 articles.append((source.name,date.group(1) if date else '2026-09-05','monthly','0.8'))
latest=max(date for _,date,_,_ in articles)
base_urls[1]=(base_urls[1][0],latest,base_urls[1][2],base_urls[1][3])

lines=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
for path,date,freq,priority in base_urls+articles:
 filename='index.html' if path=='' else path
 variants=[(l,page_url(filename,l)) for l in LANGS]
 alternates=''.join(f'<xhtml:link rel="alternate" hreflang="{l}" href="{url}"/>' for l,url in variants)+f'<xhtml:link rel="alternate" hreflang="x-default" href="{page_url(filename)}"/>'
 for lang,url in [(None,page_url(filename))]+variants:
  fields=[f'<loc>{url}</loc>',alternates]
  if date: fields.append(f'<lastmod>{date}</lastmod>')
  if freq: fields.append(f'<changefreq>{freq}</changefreq>')
  if priority: fields.append(f'<priority>{priority}</priority>')
  lines.append('  <url>'+''.join(fields)+'</url>')
lines.append('</urlset>')
(ROOT/'sitemap.xml').write_text('\n'.join(lines)+'\n')
print('Built',len(sources),'pages, multilingual variants, structured data, and sitemap.')
