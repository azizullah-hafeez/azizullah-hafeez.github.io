#!/usr/bin/env python3
"""Build every public page from shared includes. Python standard library only."""
from pathlib import Path
import re, hashlib, json, subprocess
ROOT=Path(__file__).resolve().parents[1]
def expand(text, stack=()):
 def include(m):
  name=m[1]
  if name in stack:raise ValueError('Circular include: '+name)
  path=ROOT/'templates/includes'/name
  if not path.is_file():raise ValueError('Missing include: '+name)
  return expand(path.read_text(),stack+(name,))
 return re.sub(r'\{\{ include: ([\w.-]+) \}\}',include,text)
analytics=expand('{{ include: cloudflare-analytics.html }}')
def version(m):
 attr,path=m.groups();p=ROOT/path
 if not p.is_file():raise ValueError('Missing asset: '+path)
 return f'{attr}="{path}?v={hashlib.sha256(p.read_bytes()).hexdigest()[:12]}"'
sources=sorted((ROOT/'templates/pages').glob('*.html'))
managed_posts=[]
for source in sources:
 raw=source.read_text()
 marker=re.search(r'<script type="application/json" data-article-index>(.*?)</script>',raw,re.S)
 if marker:managed_posts.append(json.loads(marker.group(1)))
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
 if source.name=='blog.html':
  text=re.sub(r'(<span class="count" data-i18n="count">)\d+( articles</span>)',rf'\g<1>{len(existing)}\g<2>',text)
 if 'data-cf-beacon=' not in text:
  text=text.replace('</head>',f'{analytics}\n</head>',1)
 text=re.sub(r'(src|href)="((?:assets/[^"?]+\.(?:css|js)|fonts\.css|posts\.js))(?:\?[^\"]*)?"',version,text)
 if '{{ include:' in text:raise ValueError('Unresolved template')
 (ROOT/source.name).write_text(text)
base_urls=[
 ('','2026-09-05','monthly','1.0'),('blog.html',None,'weekly','0.9'),
 ('activities.html','2026-09-05',None,None),('media.html','2026-09-05',None,None),
 ('courses.html','2026-09-06','weekly','0.9')]
articles=[]
for source in sources:
 if not source.name.startswith('article-'):continue
 raw=source.read_text()
 date=re.search(r'<meta property="article:published_time" content="([0-9-]+)"',raw)
 if not date:
  date=re.search(r'<div class="meta">([0-9-]+)',raw)
 articles.append((source.name,date.group(1) if date else '2026-09-05','monthly','0.8'))
latest=max(date for _,date,_,_ in articles)
base_urls[1]=(base_urls[1][0],latest,base_urls[1][2],base_urls[1][3])
lines=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for path,date,freq,priority in base_urls+articles:
 url='https://azizullah-hafeez.github.io/'+path
 fields=[f'<loc>{url}</loc>',f'<lastmod>{date}</lastmod>']
 if freq:fields.append(f'<changefreq>{freq}</changefreq>')
 if priority:fields.append(f'<priority>{priority}</priority>')
 lines.append('  <url>'+''.join(fields)+'</url>')
lines.append('</urlset>')
(ROOT/'sitemap.xml').write_text('\n'.join(lines)+'\n')
print('Built',len(sources),'pages and refreshed the sitemap from shared sources.')
