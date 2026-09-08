# Azizullah Hafeez — multilingual website

The live site remains on GitHub Pages with its existing public URLs.

## One edit, all pages

- `templates/includes/navigation.html`: navigation links and language buttons for **all 19 pages**.
- `assets/scripts/site.js`: the four-language navigation labels, sticky header, mobile menu, sharing links and copy action.
- `assets/styles/site.css`: shared navigation, article titles and image layout.
- `fonts.css`: Persian, Pashto, Arabic typography.
- `templates/includes/follow.html`: social account links everywhere.
- `templates/includes/article-social.html`: article sharing/follow markup.
- `assets/scripts/article.js`: one language controller for all standalone articles.
- `templates/pages/`: page content and page-specific structure. Edit these instead of the generated root HTML files.
- `posts.js`: the blog catalogue used by the blog list and legacy article viewer. A new standalone article must also have a catalogue entry here to appear in the blog.

## Publish changes

Run from the repository root, using Python 3 (no packages to install):

```sh
python3 scripts/build.py
```

Then commit and push the source changes and generated root HTML files together. GitHub Pages publishes through the existing deployment setup. There is no new paid service or hosting requirement.

CSS and JavaScript are shared browser assets. The build adds content-based version numbers so cached files update when their contents change. Shared HTML includes are expanded during the build: navigation and article content remain in the served HTML for search engines and visitors.

## Check before publishing

```sh
python3 scripts/check.py
```

The checker ensures every public page uses the common header/assets, article languages are present, and local stylesheet/script references exist. Browser checks should cover language switching, mobile menu, scrolling, and sharing after behaviour changes.
