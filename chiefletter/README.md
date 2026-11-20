# Plaintext Journal

A responsive, dependency-free editorial site built with HTML, CSS, and JavaScript. The homepage has searchable, filterable story cards. Articles are stored in `articles.js`; run `node build.js` after editing them to produce static, individually indexable article pages under `articles/<slug>/index.html`.

The starter publication contains 27 technology guides. Their rendered body text is at least 1,300 words per article, with section jump links, FAQs, and a YouTube resource link.

## Before publishing

- Update `site.config.json` with the real production URL, then run `node build.js` again to generate `sitemap.xml`.
- Replace the starter publisher/byline with the real editor or contributor names, biographies, and experience.
- Add a monitored email address or functioning contact form to `contact.html` and replace the DMCA placeholder on `dmca.html`.
- Review privacy, cookie, terms, and DMCA disclosures against the actual operator, hosting provider, jurisdiction, audience, and any analytics, newsletter, or advertising services. These starter pages are not legal advice and are not a guarantee of legal compliance.
- Check the license and current availability for every Unsplash image; retain image/source records. Replace the Google Fonts and image CDN references if your hosting/privacy decisions require it.
- The newsletter form is intentionally a non-collecting demo. Connect a provider and update the disclosures before enabling signup.
- No ad code is installed. Before applying for AdSense, verify current Google policies, publisher account/site ownership, content quality, privacy/consent requirements for the audience, and a fully functional site. Approval is decided by Google and cannot be promised.
- If serving personalized Google ads to people in the EEA, UK, or Switzerland, current Google guidance requires a Google-certified CMP integrated with the IAB TCF. Review Google's live requirements and current certified CMP list when configuring ads; policies and lists can change.
- The keyword plan documents search intent, not measured volume. Validate priorities with actual query data before making traffic forecasts.

## Local preview

Open `index.html` in a browser, or serve the folder with any static web server. The article directories are generated output and can be regenerated from `articles.js`.
