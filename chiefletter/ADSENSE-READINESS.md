# AdSense and publication launch readiness

This is an implementation checklist, not an approval promise. Google's review and policies can change. The site currently has no AdSense account ID, ad placements, analytics, CMP, newsletter backend, or working contact form.

## Required publisher-specific work

- Set the real domain in `site.config.json`, run `node build.js`, and deploy the generated article pages and `sitemap.xml` over HTTPS.
- Add the real legal publisher identity and monitored privacy/copyright/contact routes. Remove all starter notices and bracketed placeholders.
- Replace the collective draft byline with actual author names, biographies, expertise, and editorial ownership. Review every article for accuracy, originality, helpfulness, current technical guidance, and first-party value before publishing.
- Confirm every photograph's current license and maintain a source/asset record. Add locally hosted thumbnails if the selected host, performance, or privacy requirements call for it.
- Connect and test the contact and newsletter systems only after updating privacy and cookie disclosures to match the actual data flow, processors, retention, security controls, and user choices.
- Confirm that the site is owned/verified in the AdSense application flow and that the site's content and operation meet current Google Publisher policies and program terms.
- If serving personalized Google ads in the EEA, UK, or Switzerland, Google currently requires a CMP certified by Google and integrated with the IAB TCF. Check Google's current policy and certified vendor list during configuration; consent laws and regional rules also apply independently.
- Add ad code only after the site is ready. Keep ads distinct from navigation, download, or play controls and preserve a readable experience.

## Current first-party sources

- [AdSense eligibility requirements](https://support.google.com/adsense/answer/9724): Google says a site needs the applicant's own, policy-compliant content; content must be high-quality, original, and attract an audience.
- [Pages ready for AdSense](https://support.google.com/adsense/answer/7299563): Google recommends unique, relevant content, clear navigation, and a useful page experience.
- [Google Publisher Policies](https://support.google.com/publisherpolicies/answer/10502938): check the current policy text before applying and periodically afterwards.
- [Google's publisher CMP requirements for EEA, UK, and Switzerland](https://support.google.com/adsense/answer/13554116): read current consent and certified CMP requirements.

Do not describe this site as “AdSense approved” until Google approves the actual domain and account.
