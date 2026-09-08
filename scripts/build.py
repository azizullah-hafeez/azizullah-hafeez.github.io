#!/usr/bin/env python3
"""Build every public page from shared includes. Python standard library only."""
from pathlib import Path
import re, hashlib
ROOT=Path(__file__).resolve().parents[1]
def expand(text, stack=()):
 def include(m):
  name=m[1]
  if name in stack:raise ValueError('Circular include: '+name)
  path=ROOT/'templates/includes'/name
  if not path.is_file():raise ValueError('Missing include: '+name)
  return expand(path.read_text(),stack+(name,))
 return re.sub(r'\{\{ include: ([\w.-]+) \}\}',include,text)
def version(m):
 attr,path=m.groups();p=ROOT/path
 if not p.is_file():raise ValueError('Missing asset: '+path)
 return f'{attr}="{path}?v={hashlib.sha256(p.read_bytes()).hexdigest()[:12]}"'
for source in sorted((ROOT/'templates/pages').glob('*.html')):
 text=expand(source.read_text())
 text=re.sub(r'(src|href)="((?:assets/[^"?]+\.(?:css|js)|fonts\.css|posts\.js))(?:\?[^\"]*)?"',version,text)
 if '{{ include:' in text:raise ValueError('Unresolved template')
 (ROOT/source.name).write_text(text)
print('Built',len(list((ROOT/'templates/pages').glob('*.html'))),'pages from shared templates.')
