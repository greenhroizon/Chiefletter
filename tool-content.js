window.TOOL_CONTENT = {
  'url-encoder': {
    intro: 'Use this when text needs to travel inside one part of a URL. The encoder converts spaces, punctuation, and non-ASCII characters to percent-encoded bytes. It uses encodeURIComponent, so it leaves URL separators such as a slash untouched only when those characters are part of the component you submit.',
    howTo: ['Paste the value you plan to place in a query parameter or path segment.', 'Choose Run tool. Copy the encoded result into the matching URL component.', 'Encode each value once. Keep the surrounding URL, parameter names, equals signs, and ampersands outside the input.'],
    useCases: ['Add a search phrase with spaces or punctuation to a query parameter.', 'Prepare a callback value or return path for a URL parameter.', 'Check how accented letters and non-Latin text appear after URL encoding.'],
    tips: 'Encode components, not a complete URL. If you encode a whole address, separators such as : and / turn into data and the address stops working as a URL.',
    faqs: [['Does this encode a complete URL?', 'It encodes the text as one URL component. Do not paste a complete URL unless you intend to encode every separator too.'], ['Why do spaces become %20?', 'Percent encoding represents a byte with a percent sign and two hexadecimal digits. Space is byte 20 in hexadecimal.'], ['Is encoded text encrypted?', 'No. Encoding changes representation. Anyone who sees the URL can decode its value.']]
  },
  'url-decoder': {
    intro: 'Read percent-encoded URL components without changing the original address. The decoder converts percent sequences back to text and treats plus signs as spaces, which matches common query-string encoding. Invalid or incomplete escape sequences return an error so you can find malformed input.',
    howTo: ['Copy the encoded value from a URL, log, or request.', 'Paste the component and run the decoder.', 'Compare the result with the original request before editing a live link. Decode only as many times as the value was encoded.'],
    useCases: ['Read a search query from a copied URL.', 'Inspect a return path or callback parameter while debugging.', 'Check whether an unexpected plus sign represents a space or a literal plus.'],
    tips: 'A literal plus in query data is often encoded as %2B. This tool treats an unescaped plus as a space. Use the matching encoder when you create new values.',
    faqs: [['Why does + become a space?', 'Many query-string formats use plus for spaces. A literal plus should normally appear as %2B.'], ['What does URIError mean?', 'The input contains a malformed percent escape or invalid encoded UTF-8. Copy the exact component again and check its percent pairs.'], ['Should I decode a URL more than once?', 'Only when you know the value was encoded more than once. Repeated decoding might change data that was meant to remain literal.']]
  },
  'json-formatter': {
    intro: 'Validate JSON syntax and make a compact document easier to inspect. The formatter uses the browser’s JSON parser, then writes valid data with two-space indentation. It reports syntax errors instead of guessing how to repair the document.',
    howTo: ['Paste a JSON object, array, string, number, boolean, or null value.', 'Run the formatter. Review the formatted output and copy it into your editor.', 'If validation fails, read the parser message and check the nearby comma, quote, bracket, or value.'],
    useCases: ['Inspect an API response copied from a local development session.', 'Tidy a configuration file before a code review.', 'Confirm a JSON snippet parses before adding it to a project.'],
    tips: 'JSON requires double-quoted property names and strings. It does not support comments, trailing commas, undefined, or single-quoted strings.',
    faqs: [['Does the formatter repair invalid JSON?', 'No. It validates and formats valid JSON. Fix the reported syntax problem, then run it again.'], ['Are comments allowed in JSON?', 'Standard JSON has no comment syntax. Some configuration formats extend JSON, but this tool checks standard JSON only.'], ['Is my input uploaded?', 'No. Parsing and formatting run in this browser page. Do not paste secrets into a shared or public computer.']]
  },
  'password-generator': {
    intro: 'Generate a random password with the browser’s cryptographic random number generator. Choose a length from 8 to 128 characters and select a character set. The generator includes at least one character from each selected group, then shuffles the result.',
    howTo: ['Set a length that fits the service. Longer passwords provide more possible combinations.', 'Choose the character groups accepted by the account form.', 'Generate, then copy the password into a password manager. Avoid saving it in a document or message.'],
    useCases: ['Create a unique password for a new account.', 'Generate a temporary development credential for a local test system.', 'Replace a reused password after moving the account to a password manager.'],
    tips: 'Use a different password for every service. The generator does not store or recover the result. Save it in a trusted password manager before leaving the page.',
    faqs: [['How random is the password?', 'The generator uses crypto.getRandomValues and removes modulo bias when selecting characters. Browser and device security still matter.'], ['Does Chiefletter receive the password?', 'No. Generation and copying happen in your browser. The page does not send the generated value to Chiefletter.'], ['What length should I choose?', 'Use the longest length the service accepts. A password manager makes longer, unique passwords practical to store.']]
  },
  'qr-generator': {
    intro: 'Turn a short string or URL into a downloadable QR image. The code is built on a canvas in your browser, with no QR API request. This compact implementation supports byte-mode text up to 106 UTF-8 bytes. Long content, including full documents, does not fit.',
    howTo: ['Enter a short URL or text. Keep it below the stated byte limit.', 'Choose Make QR code and wait for the black-and-white code to appear.', 'Download the PNG, then scan it with a phone before printing or sharing it.'],
    useCases: ['Share a short public web address on a poster or handout.', 'Open a Wi-Fi or event information page from a printed card.', 'Move a brief, non-sensitive string from a screen to a phone.'],
    tips: 'Do not encode passwords, private keys, personal records, or confidential links. Anyone who scans the printed code can read its content. Test the final printed size and contrast.',
    faqs: [['What is the text limit?', 'The local generator supports up to 106 UTF-8 bytes. Non-English characters use multiple bytes, so they reach the limit sooner.'], ['Does the QR image expire?', 'The image itself does not expire. A URL inside it might stop working if the destination changes.'], ['Why should I scan the image before printing?', 'A phone scan confirms the code has enough contrast, quiet space, and physical size for the intended use.']]
  },
  'word-counter': {
    intro: 'Count words and characters while you edit. The tool also reports characters without spaces, sentence-ending punctuation, and paragraphs. Word counts use runs of letters or numbers and allow internal apostrophes, hyphens, and underscores.',
    howTo: ['Paste or write a draft in the text area.', 'Read the live counts below the field. They update as you type.', 'Compare characters with and without spaces when a form sets a strict limit.'],
    useCases: ['Check an application answer against a word limit.', 'Estimate the length of a headline, social post, or product description.', 'Measure a draft before sending it to an editor.'],
    tips: 'Different publishers define words, sentences, and characters in different ways. Treat these values as a quick estimate and use the destination’s own counter for final submission.',
    faqs: [['Do spaces count as characters?', 'The tool reports both total characters and characters with spaces removed. Line breaks count in the total.'], ['How are words counted?', 'A word is a sequence of letters or numbers. Apostrophes, hyphens, and underscores inside a word stay together.'], ['Does the counter send my draft anywhere?', 'No. Counts are calculated in the browser and the draft is not saved by this page.']]
  },
  'color-palette': {
    intro: 'Generate five related colors from a random hue and a small range of lightness values. The palette is a starting point for interface or illustration work. Select any swatch to copy its hexadecimal value.',
    howTo: ['Choose Generate palette to create a set of five colors.', 'Click a swatch to copy its hex value. The button confirms when copying succeeds.', 'Generate more options, then test the chosen colors in the actual interface and check text contrast.'],
    useCases: ['Find a quick set of colors for a prototype.', 'Explore a few starting hues before building a design system.', 'Collect hex values for a small graphic or presentation.'],
    tips: 'A palette is not an accessibility check. Test foreground and background pairs with a contrast checker and review every state, including hover, error, and disabled controls.',
    faqs: [['Are these palettes guaranteed to be accessible?', 'No. The generator makes related colors, not verified contrast pairs. Check every text and control combination separately.'], ['How do I copy a color?', 'Select the swatch. Its hexadecimal value is copied to the clipboard.'], ['Can I save a palette?', 'Copy each color value into your design file or notes. The generator does not keep a gallery or account history.']]
  },
  'base64-codec': {
    intro: 'Convert Unicode text to Base64 or decode Base64 back into readable text. The tool converts through UTF-8, so common international characters work. Base64 is a transport format, not a privacy or security feature.',
    howTo: ['Choose whether to encode text or decode Base64.', 'Paste the value and run the tool.', 'Copy the result into the software or document expecting that format. Keep binary file data out of this text-only utility.'],
    useCases: ['Inspect a short Base64 value from a development log.', 'Prepare text for a system field that expects Base64.', 'Check whether a value contains readable UTF-8 text.'],
    tips: 'Do not use Base64 to hide passwords, tokens, or private information. It is easy to reverse and provides no encryption.',
    faqs: [['Is Base64 encryption?', 'No. It is a reversible encoding. Anyone with the value can decode it.'], ['Why does decoding fail?', 'The input might not be valid Base64 or might decode to bytes that are not valid UTF-8 text.'], ['Does it work with emoji?', 'Yes, ordinary Unicode text is converted through UTF-8 before encoding.']]
  },
  'uuid-generator': {
    intro: 'Generate five random version 4 UUIDs with the browser cryptographic random number generator. A UUID is a 128-bit identifier formatted as hexadecimal groups. It is useful for identifiers where a central counter would be inconvenient.',
    howTo: ['Choose Generate UUIDs.', 'Copy one identifier into a test record or development fixture.', 'Keep the identifier in the expected text format, including hyphens, unless your system specifies another representation.'],
    useCases: ['Create sample IDs for local test data.', 'Make a client-side identifier for a draft record before saving it.', 'Prepare unique-looking fixture values for documentation examples.'],
    tips: 'A UUID is not an access token. Do not treat an identifier as proof of permission or secrecy. Enforce authorization on the resource it names.',
    faqs: [['Can UUIDs collide?', 'A collision is extremely unlikely for random version 4 values, but uniqueness is not a mathematical guarantee. Enforce database constraints where required.'], ['What does version 4 mean?', 'Version 4 UUIDs use random bits with fixed version and variant fields.'], ['Are generated UUIDs stored?', 'No. The generator creates them in your browser and does not keep a history.']]
  },
  'case-converter': {
    intro: 'Convert a block of text to common writing and programming conventions. The tool supports uppercase, lowercase, title case, sentence case, camelCase, snake_case, and kebab-case. It splits programming cases at punctuation and whitespace.',
    howTo: ['Paste the words you want to convert.', 'Choose the target case from the menu.', 'Run the converter and review names, acronyms, and proper nouns before copying the result.'],
    useCases: ['Rename a variable to match a project convention.', 'Convert a heading into a lowercase URL-friendly phrase.', 'Standardize short labels in a spreadsheet or content list.'],
    tips: 'Automatic title and sentence casing cannot know which brand names or technical acronyms must stay capitalized. Review the output instead of applying it blindly to a final document.',
    faqs: [['Does camelCase preserve punctuation?', 'No. Punctuation separates words and is removed when the tool joins them in camelCase.'], ['How does title case work?', 'It capitalizes letters after whitespace. It does not apply a publisher-specific style guide.'], ['Is my source text saved?', 'No. Conversion happens in the page and the tool does not store your input.']]
  },
  'slug-generator': {
    intro: 'Turn a title into a lowercase slug for a readable URL path. The generator normalizes accented characters, removes punctuation, replaces runs of separators with a hyphen, and trims hyphens from the ends.',
    howTo: ['Paste a short title or label.', 'Run the tool to produce a lowercase slug.', 'Review the result for meaning, length, and collisions before publishing a URL.'],
    useCases: ['Create a path for a new article or documentation page.', 'Make filenames from task titles.', 'Normalize a list of labels before using them as route names.'],
    tips: 'A slug does not check whether a URL is already in use. When you rename a published page, preserve the old route or add a redirect so existing links keep working.',
    faqs: [['Why are some characters removed?', 'The tool keeps basic Latin letters and numbers, then uses hyphens between words. Other symbols are removed after Unicode normalization.'], ['Should a slug include the full title?', 'Use enough words to identify the page. Short, specific slugs are easier to read and maintain.'], ['Does this page change my website URL?', 'No. It only creates text for you to copy into your publishing system.']]
  },
  'markdown-preview': {
    intro: 'Write a small Markdown sample and see a preview beside it. The preview supports headings, paragraphs, emphasis, inline code, fenced code blocks, and HTTP or HTTPS links. It escapes input before rendering supported formatting.',
    howTo: ['Type or paste Markdown in the editor.', 'Review the live preview as you change the source.', 'Copy the Markdown source into the destination editor, then check it there because Markdown dialects differ.'],
    useCases: ['Preview a README section before a code review.', 'Check simple formatting for a discussion post or documentation note.', 'See whether a heading and list hierarchy reads clearly.'],
    tips: 'This is a small preview, not a full CommonMark implementation. Tables, nested lists, images, and extension syntax might not display as they do on another platform.',
    faqs: [['Does the preview run HTML?', 'No. Source text is escaped before supported Markdown patterns are rendered.'], ['Why does my table not appear?', 'Tables are not part of this preview. Check the target platform’s Markdown rules.'], ['Are Markdown links opened safely?', 'The preview recognizes HTTP and HTTPS destinations and opens links in a separate tab.']]
  },
  'regex-tester': {
    intro: 'Run a JavaScript regular expression against sample text and inspect matches with their character positions. The tester adds global matching so it can report each occurrence. Syntax errors appear in the result panel.',
    howTo: ['Enter the pattern without slash delimiters, such as `\\bcat\\b`.', 'Choose flags for case sensitivity or multiline matching.', 'Paste a representative sample and test the expression. Include edge cases before using a pattern in production.'],
    useCases: ['Check a validation pattern against expected and rejected examples.', 'Find repeated values in a local text sample.', 'Explain a regular expression to a teammate with visible match positions.'],
    tips: 'A regular expression that matches sample text is not proof that it covers every valid input. Test empty input, punctuation, Unicode, and long strings relevant to your application.',
    faqs: [['Which regex engine does this use?', 'The browser JavaScript RegExp engine. Other languages have different syntax and features.'], ['Why does it add the global flag?', 'Global matching lets the page list all matches instead of returning only the first one.'], ['Can a regex cause a browser freeze?', 'Some patterns backtrack heavily on certain inputs. Use short samples and avoid testing untrusted patterns on large text.']]
  },
  'timestamp-converter': {
    intro: 'Convert Unix timestamps, ISO-style date text, or a local date and time. The result shows UTC, Unix seconds, Unix milliseconds, and the browser’s local display. Ten-digit numeric values are treated as seconds; longer numeric values are treated as milliseconds.',
    howTo: ['Enter a Unix timestamp or a date string. Use the date control for local time.', 'Choose Convert timestamp. Use the current-time control when you need a quick reference.', 'Compare the UTC and local outputs before copying a value into logs or code.'],
    useCases: ['Read an event timestamp from an application log.', 'Convert an API expiration time while debugging.', 'Check the difference between a stored UTC value and local display.'],
    tips: 'A date without a timezone may be interpreted as local time by the browser. Include Z or an explicit offset when you mean a specific UTC instant.',
    faqs: [['Are timestamps in seconds or milliseconds?', 'The tool treats ten-digit numbers as seconds and longer numeric values as milliseconds. Check the source format if the value has another length.'], ['Why does local time differ from UTC?', 'Local time applies the browser device’s timezone and daylight-saving rules. UTC does not.'], ['Does this tool account for leap seconds?', 'No. JavaScript Date follows the time model used by the browser and does not represent leap seconds.']]
  },
  'html-entities': {
    intro: 'Escape characters that have special meaning in HTML or decode common entity references into text. The encoder replaces ampersands, angle brackets, quotation marks, and apostrophes. The decoder uses a text area element and does not insert decoded content into the page as HTML.',
    howTo: ['Choose Escape HTML or Decode HTML entities.', 'Paste a short text sample and run the conversion.', 'When writing a website, still use the framework’s context-aware escaping instead of relying on a one-off conversion.'],
    useCases: ['Show a code sample containing angle brackets in a document.', 'Read a copied value containing named or numeric entities.', 'Check what a small HTML fragment looks like after basic escaping.'],
    tips: 'Escaping depends on where data appears. Text nodes, attributes, URLs, and JavaScript contexts require different handling. This utility is not a substitute for safe template rendering.',
    faqs: [['Does encoding make HTML safe everywhere?', 'No. It escapes a small set of characters for text use. Other contexts need context-aware validation and escaping.'], ['Which entities can the decoder read?', 'The browser decodes standard named and numeric HTML entities.'], ['Does decoded markup execute?', 'No. The result is read from a textarea value and displayed as text.']]
  },
  'csv-to-json': {
    intro: 'Convert comma-separated rows into a JSON array of objects. The first row supplies object keys. Quoted fields may contain commas, line breaks, or escaped quotation marks. Values remain strings so the converter does not guess which cells should become numbers or booleans.',
    howTo: ['Paste a header row followed by one or more data rows.', 'Run the converter and review the JSON output.', 'Check duplicate or blank headers, missing cells, and values that need a number or date type.'],
    useCases: ['Turn a small export into fixture data for a test.', 'Inspect a spreadsheet extract in a tool expecting JSON.', 'Prototype a data import before building a full conversion script.'],
    tips: 'CSV files vary in delimiter, encoding, and quoting rules. This tool expects commas and UTF-8 text. It does not infer data types or handle every spreadsheet dialect.',
    faqs: [['Which row becomes the keys?', 'The first non-empty row is used as the object keys.'], ['Are numeric values converted to numbers?', 'No. Every cell is returned as a string so the original text remains predictable.'], ['What if a field contains a comma?', 'Wrap the field in double quotes. Use two double quotes to represent one quote inside a quoted field.']]
  },
  'text-diff': {
    intro: 'Compare two text blocks line by line. Matching lines receive a neutral prefix. Lines at the same position that differ appear as a removal and an addition. This simple comparison is useful for quick reviews, but it does not calculate a minimal edit sequence.',
    howTo: ['Paste the earlier version into Original text.', 'Paste the new version into Changed text.', 'Compare the marked lines and inspect the surrounding context before accepting a change.'],
    useCases: ['Review a small paragraph after editing.', 'Compare two configuration snippets before copying one.', 'Spot a changed list item in a short draft.'],
    tips: 'Insertions near the start shift later lines, so this view might mark several following lines as different. Use a proper version-control diff for source code or large files.',
    faqs: [['Does this show the smallest set of changes?', 'No. It compares matching positions, not the shortest edit sequence. A moved line may appear as a removal and an addition.'], ['Are spaces significant?', 'Yes. The comparison uses the exact text of each line.'], ['Can it compare files?', 'Paste text from two small files. The tool does not read local files from disk.']]
  },
  'typing-speed-test': {
    intro: 'Measure words per minute, character accuracy, and errors while typing a short passage. The clock begins with the first keystroke. Choose a 30- or 60-second round. Scores update in the browser, and the test text is not uploaded.',
    howTo: ['Choose a time limit.', 'Type the passage shown above the entry field. The timer starts as soon as you begin.', 'Read the score when the passage is complete or time runs out. Reset the test to take another round.'],
    useCases: ['Get a baseline before practising touch typing.', 'Compare two short practice sessions on the same device.', 'Find whether accuracy or speed needs more attention.'],
    tips: 'This passage is short and the result is only an estimate. Keyboard layout, language, punctuation, device, and pasting affect the score. Use repeated rounds for a steadier baseline.',
    faqs: [['How is WPM calculated?', 'Correct characters are divided by five, then converted to a per-minute rate using elapsed time.'], ['Does pasting count as typing?', 'The test records text entered in the field. For a meaningful personal score, type the passage instead of pasting it.'], ['Are errors penalized?', 'The page reports incorrect characters and calculates accuracy from the typed character count.']]
  },
  'css-formatter': {
    intro: 'Add readable line breaks and indentation to a basic CSS snippet. The formatter separates declarations and selector blocks so a small rule is easier to review. It does not parse the CSS grammar or guarantee that every advanced construct retains its intended formatting.',
    howTo: ['Paste a short CSS snippet.', 'Run the formatter and review the braces and declarations.', 'Copy the result into your editor and run the project’s normal lint or build check.'],
    useCases: ['Tidy a compact rule copied from a local test.', 'Make a small CSS example easier to discuss in a review.', 'Inspect declarations in a minified snippet.'],
    tips: 'Nested at-rules, data URLs, custom property values, and strings may need a real CSS parser. Avoid using a text formatter as the only check on production stylesheets.',
    faqs: [['Does the formatter change CSS behavior?', 'It aims to change whitespace only, but it is a simple text formatter. Review output and run your project checks.'], ['Does it support SCSS or Less?', 'It does not understand those languages. Use the formatter configured for your project.'], ['Why are nested rules not aligned?', 'The tool does not parse nested CSS syntax or at-rules.']]
  },
  'jwt-decoder': {
    intro: 'Decode the header and payload portions of a JSON Web Token in the browser. The page does not send the token anywhere and does not verify its signature. A decoded claim is only readable data, not proof that the token is genuine or current.',
    howTo: ['Paste the three-part token into the field.', 'Run the decoder to inspect the JSON header and payload.', 'Check issuer, audience, and expiry against the service that issued the token. Never use decoded data as authorization evidence.'],
    useCases: ['Inspect a test token while debugging local authentication.', 'Read an expiration timestamp from a development token.', 'Check claim names before updating client integration code.'],
    tips: 'Do not paste a live production token into a shared device. Anyone who obtains a valid bearer token might use it until it expires or is revoked. This page does not validate the signature.',
    faqs: [['Does decoding verify the JWT signature?', 'No. It only decodes the first two Base64URL sections. Use the issuer’s key and a trusted JWT library to verify a signature.'], ['Is the token sent to a server?', 'No. Decoding happens locally in this browser page. Still avoid sharing live credentials on a shared computer.'], ['What does an expired claim mean?', 'The page compares the exp value with the device clock. The service remains authoritative about whether it accepts the token.']]
  }
};

window.TOOL_LIST = [
  {id:'url-encoder',name:'URL encoder',category:'Coding',description:'Encode text for safe use in a URL.'},
  {id:'url-decoder',name:'URL decoder',category:'Coding',description:'Decode percent-encoded text.'},
  {id:'json-formatter',name:'JSON formatter and validator',category:'Coding',description:'Validate JSON syntax and format it for reading.'},
  {id:'password-generator',name:'Password generator',category:'Security',description:'Create a random password in your browser.'},
  {id:'qr-generator',name:'QR code generator',category:'Security',description:'Make a QR code without sending its contents away.'},
  {id:'word-counter',name:'Word and character counter',category:'Writing',description:'Count words, characters, sentences, and paragraphs.'},
  {id:'color-palette',name:'Color palette generator',category:'Design',description:'Generate five colors and copy their hex values.'},
  {id:'base64-codec',name:'Base64 encoder and decoder',category:'Coding',description:'Convert Unicode text to or from Base64.'},
  {id:'uuid-generator',name:'UUID generator',category:'Coding',description:'Generate random version 4 UUIDs.'},
  {id:'case-converter',name:'Text case converter',category:'Writing',description:'Convert text to common programming and writing cases.'},
  {id:'slug-generator',name:'URL slug generator',category:'Writing',description:'Turn a title into a clean, readable URL slug.'},
  {id:'markdown-preview',name:'Markdown preview',category:'Writing',description:'Preview headings, lists, links, and emphasis.'},
  {id:'regex-tester',name:'Regular expression tester',category:'Coding',description:'Check a regular expression against sample text.'},
  {id:'timestamp-converter',name:'Timestamp converter',category:'Coding',description:'Convert a date or Unix timestamp in your browser.'},
  {id:'html-entities',name:'HTML entity encoder and decoder',category:'Coding',description:'Escape HTML characters or read encoded text.'},
  {id:'csv-to-json',name:'CSV to JSON converter',category:'Coding',description:'Convert comma-separated rows into JSON objects.'},
  {id:'text-diff',name:'Text comparison',category:'Writing',description:'Compare two text blocks line by line.'},
  {id:'typing-speed-test',name:'Typing speed test',category:'Writing',description:'Measure typing speed, accuracy, and errors over a timed passage.'},
  {id:'css-formatter',name:'CSS formatter',category:'Coding',description:'Indent a CSS snippet for easier review.'},
  {id:'jwt-decoder',name:'JWT decoder',category:'Security',description:'Read a token header and payload locally.'}
];
