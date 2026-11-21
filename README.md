# Chiefletter

Chiefletter is a responsive, static technology publication. The home page includes searchable stories and category filters. Article content lives in `articles.js`; `node build.js` creates each article as a static page under `articles/<slug>/index.html` and refreshes `sitemap.xml` using the production URL in `site.config.json`.

The publication contains 45 technology guides, each with section jump links, FAQs, a YouTube learning link, a saved checklist, a working plan, and an activity suited to its category. The Workbench at `tools.html` links to 20 individual browser utilities under `tools/<slug>/`. Tool pages include instructions, use cases, limits, FAQs, and sample input. Tool input stays on the reader's device.

The Artifacts library at `artifacts.html` contains 15 interactive explainers under `artifacts/<slug>/`. Each explainer has a step control, an animated sequence, plain-language notes, and a section on the model's limits. `artifacts-data.js` holds their content and `artifact-player.js` runs the page controls.

## Publishing notes

- The site is configured for `https://chiefletter.com`. Change `site.config.json` if the production domain differs, then rebuild.
- The contact page opens email to `contact@chiefletter.com`.
- The QR generator works in the browser and supports short text or URLs up to 106 UTF-8 bytes.
- Article notes and checklist progress use local browser storage. Readers can clear an article activity from that page.
- Images load from Unsplash. Check and retain the applicable license/source information for each image.
- Google Fonts, Unsplash, YouTube, and the hosting provider process requests according to their own terms and privacy practices. The privacy and cookie pages describe the current site configuration.
- The AdSense loader and Google Analytics tag `G-KL069686WS` are installed site-wide. There are no manually coded ad units; Auto ads depend on the AdSense account settings. Review current Google Publisher policies and applicable privacy/consent requirements when configuring analytics and advertising. AdSense approval is determined by Google.
- The keyword map records target queries and reader intent; it does not claim measured search volumes.
- Legal pages are general site terms and policies. Adapt them to the publisher's legal identity, jurisdiction, and actual operations.

## Preview

Open `index.html` in a browser or serve the folder with a static web server. Article content lives in `articles.js`, `new-articles.js`, and `article-examples.js`. Re-run `node build.js` after editing article, tool, or artifact source files.
