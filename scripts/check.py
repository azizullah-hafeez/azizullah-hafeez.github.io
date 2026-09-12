#!/usr/bin/env python3
from pathlib import Path
from html.parser import HTMLParser
import re
root=Path(__file__).resolve().parents[1]
class Tags(HTMLParser):
 def __init__(self,text):super().__init__();self.tags=[];self.feed(text)
 def handle_starttag(self,tag,attrs):self.tags.append((tag,dict(attrs)))
count=0
for p in root.glob('*.html'):
 text=p.read_text();tags=Tags(text).tags
 assert sum(a.get('id')=='siteNav' for _,a in tags)==1,p
 assert 'assets/scripts/site.js?v=' in text and 'assets/styles/site.css?v=' in text,p
 assert text.count('data-cf-beacon=')==1,p
 assert 'a1492f2f8a81419e9808279096ab7b60' in text,p
 assert '{{ include:' not in text,p
 for tag,a in tags:
  path=a.get('src') if tag=='script' else a.get('href') if tag=='link' and a.get('rel')=='stylesheet' else None
  if path and not path.startswith(('https:','http:','data:')):assert (root/path.split('?')[0]).is_file(),(p,path)
 if p.name.startswith('article-'):
  assert {a['data-panel'] for _,a in tags if 'data-panel' in a}=={'en','fa','ps','ar'},p
  assert text.count('data-share-tools')==1,p
 count+=1
print('Validated',count,'pages.')
