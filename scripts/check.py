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
 assert text.count('data-lang-init')==1,p
 assert 'a1492f2f8a81419e9808279096ab7b60' in text,p
 assert '{{ include:' not in text,p
 for tag,a in tags:
  path=a.get('src') if tag=='script' else a.get('href') if tag=='link' and a.get('rel')=='stylesheet' else None
  if path and not path.startswith(('https:','http:','data:')):assert (root/path.split('?')[0]).is_file(),(p,path)
 if p.name.startswith('article-'):
  assert {a['data-panel'] for _,a in tags if 'data-panel' in a}=={'en','fa','ps','ar'},p
  assert text.count('data-share-tools')==1,p
  if 'data-article-media' in text:
   assert text.count('data-article-media')==1,p
   assert 'assets/styles/article-base.css' in text,p
   assert 'assets/scripts/article.js' in text,p
 count+=1
article_script=(root/'assets/scripts/article.js').read_text()
assert 'placeArticleMedia' in article_script
assert "panel.querySelector('p')" in article_script
assert "insertAdjacentElement('afterend',media)" in article_script
home=(root/'index.html').read_text()
assert 'id="latestPosts"' in home and 'id="latestActivities"' in home
assert home.index('posts.js?v=') < home.index('assets/scripts/index.js?v=')
assert home.index('assets/scripts/activities-data.js?v=') < home.index('assets/scripts/index.js?v=')
activities=(root/'activities.html').read_text()
assert activities.index('assets/scripts/activities-data.js?v=') < activities.index('assets/scripts/activities.js?v=')
research_activity=(root/'activity-herat-domestic-products-research.html').read_text()
research_tags=Tags(research_activity).tags
assert {a['data-panel'] for _,a in research_tags if 'data-panel' in a}=={'en','fa','ps','ar'}
assert research_activity.count('https://forms.gle/fAHUjYHxm2pcVFji9')==4
assert research_activity.count('target="_blank" rel="noopener noreferrer"')==4
assert 'activity-herat-domestic-products-research.html' in (root/'sitemap.xml').read_text()

conference_activity=(root/'activity-marghinani-conference-2026.html').read_text()
conference_tags=Tags(conference_activity).tags
assert {a['data-panel'] for _,a in conference_tags if 'data-panel' in a}=={'en','fa','ps','ar'}
assert 'د امام برهان الدین مرغیناني رحمه الله په فقهي منهج کې د عرف مقام' in conference_activity
assert 'activity-marghinani-conference-2026.html' in (root/'sitemap.xml').read_text()

print('Validated',count,'pages.')
