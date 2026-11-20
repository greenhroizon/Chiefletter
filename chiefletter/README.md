# Chiefletter

Chiefletter is a responsive, static technology publication. The home page includes searchable stories and category filters. Article content lives in `articles.js`; `node build.js` creates each article as a static page under `articles/<slug>/index.html` and refreshes `sitemap.xml` using the production URL in `site.config.json`.

The publication contains 35 technology guides, each with an article page, section jump links, FAQs, and a YouTube learning link. The site also includes About, Contact, Privacy, Cookies, Terms, Disclaimer, DMCA, Editorial, and Accessibility pages.

## Publishing notes

- The site is configured for `https://chiefletter.com`. Change `site.config.json` if the production domain differs, then rebuild.
- The contact page opens email to `contact@chiefletter.com`.
- Images load from Unsplash. Check and retain the applicable license/source information for each image.
- Google Fonts, Unsplash, YouTube, and the hosting provider process requests according to their own terms and privacy practices. The privacy and cookie pages describe the current site configuration.
- No ad code or analytics are installed. Review current Google Publisher policies and applicable privacy/consent requirements before adding advertising. AdSense approval is determined by Google.
- The keyword map records target queries and reader intent; it does not claim measured search volumes.
- Legal pages are general site terms and policies. Adapt them to the publisher's legal identity, jurisdiction, and actual operations.

## Preview

Open `index.html` in a browser or serve the folder with a static web server. Re-run `node build.js` after editing `articles.js`.
