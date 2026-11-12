# ChiefLetter

Static site for Vercel (no build step). Deploy this folder as-is.

- `assets/style.css` and `assets/ads.js`: shared styles and the responsive ad loader.
- `ads/*.html`: one page per ad size; these are loaded inside labelled, fixed-size iframes.
- Ad slots are `<div class="ad" data-t="leader|inline|rect|rail|rail2"></div>`. The loader picks the size that fits the slot's real width.
- The social bar script is added in the footer of every content page.
