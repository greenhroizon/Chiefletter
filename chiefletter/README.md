# Chiefletter

Chiefletter is a responsive, static technology publication. The home page includes searchable stories and category filters. Article content lives in the article source files. `node build.js` creates each article as a static page under `articles/<slug>/index.html`, puts the newest 12 story cards into the homepage HTML, and refreshes `sitemap.xml` using `site.config.json`.

The publication contains 54 static article pages. Each page has its own URL, table of contents, FAQ content, and an activity selected for its topic category. The build writes these pages to disk; the browser does not generate article pages at runtime. The Workbench at `tools.html` links to 44 individual browser utilities under `tools/<slug>/`. Tool pages include instructions, use cases, limits, FAQs, and sample input. Tool input stays on the reader's device.

## Publishing notes

- The site uses `https://chiefletter.com` as its canonical host. `_redirects` and `.htaccess` redirect the www host to the apex host on supported static hosts and Apache servers. Confirm your deployment platform honors one of these files.
- The contact page opens email to `contact@chiefletter.com`.
- The QR generator works in the browser and supports short text or URLs up to 106 UTF-8 bytes.
- The code editor saves drafts to local storage only when a reader selects Save draft. Image compression and resizing run in the browser.
- Images load from Unsplash. Check and retain the applicable license/source information for each image.
- Google Fonts, Unsplash, YouTube, and the hosting provider process requests according to their own terms and privacy practices. The privacy and cookie pages describe the current site configuration.
- The Google tag loader uses ID `G-KL069686WS`. AdSense account verification uses the publisher meta tag, and `ads.txt` declares the publisher. The site does not currently load the AdSense ad-serving script or show ad units. Review current publisher policies and applicable privacy/consent requirements before enabling ads. AdSense approval is determined by Google.
- The keyword map records target queries and reader intent; it does not claim measured search volumes.
- Legal pages are general site terms and policies. Adapt them to the publisher's legal identity, jurisdiction, and actual operations.

## Preview

Open `index.html` in a browser or serve the folder with a static web server. Article content lives in `articles.js`, `new-articles.js`, and `article-examples.js`. Re-run `node build.js` after editing article or tool source files.
