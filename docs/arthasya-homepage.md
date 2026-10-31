# Arthasya parent homepage

The approved homepage concept is implemented at `/`. The previous electric scooter homepage is at `/arth.pravah`; existing `/models`, product, comparison, calculator and ownership routes remain available. The site retains its dependency-free HTML/CSS/JavaScript stack.

## Design and assets

- Accepted concept: `C:/Users/Vinay/.codex/generated_images/01a192de-a54a-7af2-a954-452deb0275b1/exec-6340b7e7-7253-44c9-9e62-7b9f55546a07.png`.
- The complete supplied logo is copied unchanged to `assets/arthasya/logo.png`, including symbol, name and tagline. SHA-256: `D1F747FDFD0B7BDE60C0E3681F50959C269C2BCC725E321757D755C0EE29FAEA`.
- `assets/arthasya/businesses.png` is a generated four-photo sheet. CSS positions its quadrants without shipping rasterized UI. `assets/arthasya/hero.png` is a separate generated portrait of the same visual direction.
- Both photographic assets use the built-in image generation tool. Brief: natural warm daylight, teal electric scooters, limestone architecture, turmeric and whole spices, scooter charging infrastructure and an electric delivery fleet. No typography, manufacturer branding, statistics or product specifications. The portrait reference uses the sheet's scooter, with its complete vehicle visible inside a 2:3 frame.
- All page headings, descriptions, links and buttons are native HTML. The owner logo is used as an image rather than reconstructed with type or CSS.

## Fidelity review

Compared the accepted concept and the rendered production screenshots directly using `view_image`, including a render at the reference's 899 × 1750 viewport and a 1440 × 1000 desktop viewport.

| Comparison | Result |
| --- | --- |
| Section order | Header, split photographic hero, sector navigation, four businesses, About, contact band, footer retained |
| Copy | Hero, navigation, business labels, descriptions and calls to action match; logo adds only the owner's supplied name/tagline |
| Layout | Two business columns on desktop; single column on phones; header navigation becomes a keyboard-operable menu |
| Palette | Warm white `#F4F5F2`, charcoal `#112C3B`, teal `#00A9B7`; darker teal text and dark button labels improve contrast |
| Typography | Strong sans-serif hierarchy, tight display headings and readable body text; existing site-wide Tahoma font stack |
| Photography | Standalone matching generated assets, warm daylight, original photo roles; fixed distorted aspect ratios and hero cropping during review |
| Spacing and borders | Open sections, restrained rules, square photo panels and a full-width dark contact band retained |
| Branding | Intentional change: complete owner logo replaces the mockup's text wordmark, increasing header/footer height |

The implementation follows the approved design with the owner-requested logo substitution and the documented accessibility and interaction adaptations. Generated photographs are matching artwork, not pixel-identical extractions from the concept.

## Interactions and availability

- The primary hero link and sector navigation move to the correct page sections.
- EV links navigate to the original live local EV experience at `/arth.pravah`; its footer provides a link back to Arthasya.
- Export, charging and fleet entry points open accessible native dialogs with category information. Contact opens a dialog explaining that verified channels are being confirmed. No fake email, address or form submission is added.
- Dialog Escape dismissal, focus return, mobile navigation focus loop, mobile menu dismissal and reduced-motion preferences are verified.
- Server-rendered content remains readable with JavaScript disabled. EV navigation is a normal hyperlink. Dialog interactions require JavaScript.

## Verification

- `npm run check`: 16 native tests pass, including new static homepage, routing, metadata and logo-dimension checks.
- `npm run build`: passes; writes both the parent homepage and `/arth.pravah/index.html`.
- `tests/arthasya-browser.test.mjs`: passes against development and production previews; widths 320, 390, 760, 768, 899, 1024 and 1440, business dialogs, contact, focus return, navigation, browser history, static HTML, reduced motion and console health.
- `tests/browser.test.mjs`: 14 existing browser scenarios pass after updating the EV homepage location.
- `tests/product-browser.test.mjs`: all six product pages and existing responsive, battery, gallery, comparison, metadata, static HTML and 404 checks pass.
- `tests/motion-browser.test.mjs`: nine motion/3D scenarios pass against the production preview.
- Chrome is driven through the installed Playwright runtime because no Browser/IAB tool is available in this session. No package installation was needed.
- Final desktop, mobile and reference-size screenshots: `C:/Users/Vinay/.codex/visualizations/2026/10/31/01a192de-a54a-7af2-a954-452deb0275b1/`.

This work is verified locally. No deployment, publishing, new backend or contact configuration is included.
