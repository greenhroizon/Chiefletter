# Chiefletter

Chiefletter is a responsive, static technology publication. The home page includes searchable stories and category filters. Article content lives in `articles.js`; `node build.js` creates each article as a static page under `articles/<slug>/index.html` and refreshes `sitemap.xml` using the production URL in `site.config.json`.

The publication contains 40 technology guides, each with section jump links, FAQs, a YouTube learning link, a saved checklist, and an activity suited to its category. The Workbench at `tools.html` links to 20 individual browser utilities under `tools/<slug>/`. Every tool page includes instructions, use cases, limits, and FAQs. Tool input stays on the reader's device. The site also includes About, Contact, Privacy, Cookies, Terms, Disclaimer, DMCA, Editorial, and Accessibility pages.

## Publishing notes

- The site is configured for `https://chiefletter.com`. Change `site.config.json` if the production domain differs, then rebuild.
- The contact page opens email to `contact@chiefletter.com`.
- The QR generator works in the browser and supports short text or URLs up to 106 UTF-8 bytes.
- Article notes and checklist progress use local browser storage. Readers can clear an article activity from that page.
- Images load from Unsplash. Check and retain the applicable license/source information for each image.
- Google Fonts, Unsplash, YouTube, and the hosting provider process requests according to their own terms and privacy practices. The privacy and cookie pages describe the current site configuration.
- The AdSense loader is installed. There are no manually coded ad units; Auto ads depend on the AdSense account settings. No analytics are configured. Review current Google Publisher policies and applicable privacy/consent requirements before adding advertising. AdSense approval is determined by Google.
- The keyword map records target queries and reader intent; it does not claim measured search volumes.
- Legal pages are general site terms and policies. Adapt them to the publisher's legal identity, jurisdiction, and actual operations.

## Preview

Open `index.html` in a browser or serve the folder with a static web server. Re-run `node build.js` after editing `articles.js`.
