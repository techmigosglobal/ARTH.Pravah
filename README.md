# ARTH.Pravah frontend

A dependency-free cinematic frontend based on `PRD.md`. No framework existed in the supplied workspace. The implementation uses semantic HTML, CSS, ES modules, Canvas, requestAnimationFrame, IntersectionObserver and ResizeObserver. No npm packages were installed, and no animation library is used.

## Run locally

The deployment runtime is pinned to Node.js 22.x; use an existing Node.js 22 installation locally. There is no install step.

```bash
npm run dev
```

Open http://127.0.0.1:4173. To change the port: `PORT=4174 npm run dev`.

```bash
npm run check
npm run build
npm run preview
```

`build` creates `dist/` from an explicit allowlist. Original PNG/MP4 sources, the supplier PDF, PRD, tests and local evidence are not published. Stop an existing dev server before starting preview on the same port.

## Files created

| Files | Purpose |
| --- | --- |
| `index.html` | Document, navigation, footer and gallery dialog |
| `src/app.js`, `src/data.js`, `src/sequence.js`, `src/styles.css`, `src/hero-carousel.js`, `src/motion.js`, `src/motion.css`, `src/glb.js`, `src/bike-viewer.js` | Public routes, model/calculation logic, scroll films, native hero/motion system and static GLB/WebGL viewer |
| `assets/models/`, `assets/frames/`, `assets/fonts/`, `assets/3d/manifest.json` | 24 optimised model images, 504 real extracted frames, actual-file manifest, local font/licence, and six photo-based 3D preview assets |
| `scripts/prepare-media.py`, `scripts/build.mjs`, `scripts/serve.mjs` | Optional source preparation, dependency-free production build and local preview server |
| `tests/core.test.mjs`, `tests/browser.test.mjs`, `tests/motion-browser.test.mjs`, `tests/glb-fixture.mjs` | Native logic/media checks and browser scenarios |
| `package.json`, `netlify.toml`, `vercel.json`, `_headers`, `robots.txt`, `.gitignore` | Run commands, deployment settings, headers, preview indexing controls and generated-file exclusions |
| `README.md`, `OBJECTIVES.md` | Run/deployment instructions, user objectives, feature backlog and verification status |
| `dist/`, `.test-artifacts/` (generated, ignored) | Production output and local verification evidence |

The original PRD and supplied images/videos/catalogue are preserved. The frontend source is extended incrementally for the approved motion and 3D-viewer objectives. No standalone approved logo file was supplied; the header uses a text wordmark. The extra original Nova hero image remains available in its source folder and is not misrepresented as a colour/variant option.

## Implemented

- Responsive cinematic home, native navigation, six model pages with individual editorial copy, ownership/about pages, transparent contact/visit/support availability pages and preview policy notices.
- Six-slide, six-second auto-advancing hero with decoded-image crossfades, coordinated copy and links, next/previous/dots, pause/resume, focus/hover holds, hidden-tab and offscreen suspension.
- Native SVG flow graphics, abstract hero accents, staggered reveals, demand-driven image depth, page-scroll progress, gallery/menu/selection transitions, and a global pause/resume control. Reduced motion disables autoplay and decorative movement while keeping manual interactions.
- Six functional model choices on the home page update hero imagery, description, selected state and film sequence. Actual colour/battery variants are unconfirmed and are not invented.
- Native pinned Canvas films; manual keyboard-accessible slider; pause/resume; three restrained story chapters; forward/reverse scroll mapping; DPR-aware contain sizing; progressive loading; nearest-frame fallback and an explicit missing-sequence state.
- Model galleries with front/side/rear/context views, accessible modal enlargement and native FAQs.
- Two/three-model comparison with session-scoped selection, three-model limit and clear selection. Qualified technical values come from the shared catalogue records.
- Custom running-cost calculator with visible editable assumptions, required user-provided EV consumption, input limits, no stale totals, zero-distance handling and honest negative differences.
- A dedicated true 3D viewer integration after each product gallery. All six pages offer Blender-authored photo-based reconstructions, with persistent approximation labels and a photo fallback.
- Static build, local server, Netlify config, security headers, and meaningful native/browser tests.

## Frame assets and loading

`assets/frames/manifest.json` lists the actual generated files for each model. The supplied clips contain logo intros and animated end cards; each sequence uses seconds 3–10 of its corresponding original clip, sampled at 12 fps, producing 84 WebP frames per model (504 total). No new product designs were generated or substituted. The original source videos and their existing edits/branding remain the visual source; this is a film scrub, not a geometrically accurate 360-degree turntable.

The initial poster appears before Canvas decoding. Only the selected model's first four frames are prefetched offscreen; the remaining compressed frames load with three concurrent requests when the film enters the viewport. Near-target frames take priority over background work. An LRU-like distance eviction policy keeps at most 20 decoded 960×540 frames (approximately 40 MiB of pixel storage, plus compressed blobs, browser overhead and in-flight decoding). Switching models aborts requests and closes old bitmaps. No animation loop runs continuously when scrolling is idle. The renderer maps scroll progress directly to a frame without inertial lag.

Reduced-motion visitors see an explicitly labelled still-image alternative, no animation-frame downloads, and no pinned scroll distance. Missing individual frames are reported and use a nearest available frame; a wholly missing sequence explicitly says the scroll animation is unavailable. Poster imagery is not represented as functioning animation.

To regenerate derivatives, the optional `scripts/prepare-media.py` requires the already available system `ffmpeg` and Python Pillow. It reads source filenames from its explicit mapping, skips metadata directories, preserves original files, and writes the manifest from real output filenames. Production/Netlify builds use the included derivatives and need neither tool. No dependency installation is performed by the preparation script.

The local Adwaita Sans font and its licence are included in `assets/fonts/`.

## Blender models and interactive 3D

The 31 October 2026 instruction authorizes creating models from the supplied photographs and integrating them into the current site. This supersedes the earlier wait-for-manufacturer-assets decision. These are **approximate visual reconstructions**, not scans, engineering CAD, or manufacturer-approved assets. The viewer labels them as photo-based previews before and after loading. Actual dimensions and hidden details remain unverified; compare the original gallery for product appearance.

- `models/blender/{aero,apex,nova,teja,vayu,vega}.blend`: editable sources, named components, four packed reference images per product, metric scene settings, camera and neutral studio lighting. Source files stay outside the production allowlist.
- `scripts/generate-models.py`: repeatable Blender construction and export. Each product has its own paint, lighting layout and styling parameters. Shared scooter components include shaped bodywork, wheels, brake rotor, suspension coils, handlebars, mirrors, footboard, saddle and rear lamps. Geometry and unobserved construction are approximations.
- `assets/3d/{id}.glb`: real standalone geometry exported by Blender, with material groups merged for web rendering. No runtime dependencies or external generation API are required.
- `assets/3d/manifest.json`: `available: true` and `kind: "photo-reconstruction"` enable the labeled preview while `approved: false` preserves the distinction from approved manufacturer assets. Missing entries and other unapproved kinds stay pending. An actual approved replacement may use `approved: true`.

Regenerate all six from the repository root in PowerShell:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python scripts/generate-models.py
```

Append `-- aero` to regenerate only Aero, or a space-separated selection of model IDs. The generator writes editable sources and GLBs and updates the manifest after each completed product. No installation or credentials are needed. The photos remain unchanged.

The native WebGL viewer loads geometry only on request and renders only on interaction or resize. It supports drag, arrow keys, zoom buttons/plus/minus, Home/reset, touch-friendly vertical scrolling, context loss and a photo fallback. Material base colour, scalar metallic and roughness values drive lightweight studio shading; it is not a full glTF PBR renderer. No normal maps, transparent glass, skeletal animation or compression decoder are implemented. Replacement GLBs must contain one embedded buffer, uncompressed static triangles, valid normals/positions and embedded PNG/JPEG/WebP base-colour textures if used. Limits: 25 MiB, one million rendered vertices, textures at most 4096 pixels per side. Model URLs must be same-origin under `/assets/3d/`.

The native tests validate all six real assets through the same parser used by the viewer, file size, geometry limits, material values, uniqueness and Blender source containers. `tests/models-browser.test.mjs` exercises lazy loading, real pixels, rotation, zoom, keyboard reset, mouse drag, desktop/mobile widths, disclosure, console errors and malformed/missing/untrusted asset fallbacks. Use the existing Playwright installation:

```powershell
$env:PLAYWRIGHT_PATH='C:/Users/Vinay/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
$env:CHROME_PATH='C:/Program Files/Google/Chrome/Application/chrome.exe'
$env:TEST_URL='http://127.0.0.1:4174'
node tests/models-browser.test.mjs
```

Browser evidence goes to the system temporary directory `arth-pravah-3d`, or `TEST_ARTIFACTS` when set. Visual refinement and accuracy review remain necessary before treating these as authoritative product representations. Website integration and testing are local; no hosted deployment is implied.

## Required business/backend work

This is the frontend visual/interaction slice, not the complete operational PRD release. Production enquiries, test rides and support are intentionally unavailable because there are no verified business contacts, showroom details, approved policies, persistent request backend, authentication, email sender or WhatsApp provider configuration. There are no fake success forms, localStorage lead records, demo admin logins or pretend notifications. No personal information is collected by these preview pages.

Approved specifications, prices, warranty, colours/variants, model availability, consumption data and media rights/accuracy still require owner confirmation. The calculator supports explicit custom inputs, not inferred ARTH.Pravah consumption values. The supplier PDF is not offered as a public product brochure.

`robots.txt`, HTML metadata and `_headers` keep the preview non-indexable. Remove those restrictions only after the PRD launch gates are satisfied and a verified production domain/canonical/sitemap strategy is configured. A preview policy notice is not a final business privacy/terms document.

The original `PRD.md` and source media are preserved.

## Browser verification

`npm run check` needs only Node and runs syntax checks plus thirteen native tests covering frame mapping, aspect ratio, calculator arithmetic/validation, real media paths and absence of added libraries, static GLB decoding and six real photo-based 3D reconstructions.

`tests/browser.test.mjs` uses an already installed Playwright and Chrome; it does not install either. Run a production preview server, then:

```bash
PLAYWRIGHT_PATH=/absolute/path/to/existing/playwright CHROME_PATH=/path/to/existing/chrome node tests/browser.test.mjs
```

In this Windows workspace, the existing Playwright path is `C:/Users/Vinay/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright` and Chrome is `C:/Program Files/Google/Chrome/Application/chrome.exe`. Set `TEST_URL` if using another local port. Browser screenshots and machine-readable results are written to ignored `.test-artifacts/`.

The browser suite checks real Canvas pixel changes during forward/reverse scrolling, progressive initial loading, pause/scrub, six model switches, galleries, comparison, cost arithmetic, route states, mobile/tablet widths, reduced motion, individual/all missing frames and normal-journey console errors. The additional `tests/motion-browser.test.mjs` uses the same command/environment pattern and checks nine scenarios: real hero autoplay, manual controls/rapid selection, focus/offscreen holds, global pause, mobile/reduced motion, all six available 3D previews, native WebGL geometry rotation/zoom/reset/drag, invalid-file fallback and console errors. Its GLB fixture is synthetic non-bike geometry, intercepted only within the test browser, never part of the public model manifest. It proves renderer infrastructure, not accurate 3D bike content.

It does not prove live messaging, backend access control, PRD production readiness, field Core Web Vitals or hosted behaviour.

## Vercel build configuration

`vercel.json` explicitly sets the framework to Other (`null`), build command to `npm run build`, and output directory to `dist`. The build intentionally does not create `public`; changing Vercel's expected output fixes `STATIC_BUILD_NO_OUT_DIR`.

Direct application URLs rewrite to `index.html`. Requests for `/assets/`, `/src/`, `/api/`, `robots.txt` and the Netlify metadata files are excluded from the app fallback, so missing media or scripts are not returned as successful HTML. Existing static files are served from the build output. Existing preview no-index/security headers and asset cache settings are explicitly configured for Vercel because Netlify's `_headers` file is provider-specific.

The Node engine is pinned to `22.x`, matching the Netlify runtime. No npm dependency installation or framework conversion is needed for this fix.

For the Git-connected Vercel project, deploy the latest `main` commit. If checking the dashboard manually, use repository root, framework **Other**, build command `npm run build`, and output directory `dist`. Redeploying the old `d9ee6ca` commit will not include the configuration fix. No environment variables are required for this static frontend. Business/backend launch prerequisites still apply.

Reference: [Vercel project configuration](https://vercel.com/docs/project-configuration/vercel-json).

## Exact Netlify deployment steps (not executed)

No Netlify CLI installation is required. No deployment has been performed.

### Manual upload from this local workspace

1. Run `npm run check`, `npm run build`, and the browser suite against `npm run preview`. Review the business limitations above before sharing the preview.
2. Log in to the intended Netlify team and open https://app.netlify.com/drop, or choose **Add new project → Deploy manually** from the team's Projects page.
3. Drag **only the generated `dist/` folder** into the drop zone. Do not upload the repository root, supplier PDF or original media folders.
4. After the upload completes, open the returned `netlify.app` URL. Check `/`, a direct model URL such as `/models/aero`, `/compare`, `/running-costs`, all six frame sequences, mobile navigation and reduced motion. Verify preview no-index and security headers. The generated `_redirects` and copied `_headers` are included in `dist/` for this workflow.
5. To update the same manually deployed project, rebuild and drop the updated `dist/` into that project's **Deploys** page deploy drop zone. Do not create another project for routine updates.

### Git-connected deployment, if a repository is created later

This workspace initially had no Git repository. Do not assume a remote or branch already exists.

1. After the user creates/authorises a Git repository containing source plus generated `assets/`, choose **Add new project → Import an existing project** in Netlify and select that repository.
2. Use repository root as the base directory, `npm run build` as build command, and `dist` as publish directory. `netlify.toml` supplies those settings and Node 22. The package manifest has no runtime/dev dependencies.
3. Review the selected production branch and deployment visibility, then start deployment. Netlify builds only from checked-in files; commit generated media derivatives rather than expecting ffmpeg/Pillow on the build host.
4. Perform the same hosted checks as the manual workflow. Enabling a public production domain and business integrations is separate work; this static deployment does not enable form submission or administrator access.

References: [Netlify: add a new project / manual publishing](https://docs.netlify.com/manage/projects/add-new-project/) and [build configuration](https://docs.netlify.com/build/configure-builds/overview/).

## Verification recorded 30 October 2026

- Production build: passed.
- Native logic/media/GLB tests: 8 passed.
- Existing frontend browser regression scenarios: 14 passed.
- Hero, motion and 3D infrastructure browser scenarios: 9 passed.
- All six hero layouts checked at widths 320, 375, 768 and 1440 pixels with no content/control overlap or horizontal overflow.
- No normal-journey console/uncaught JavaScript errors observed in the test browsers.
- Native WebGL rotation/zoom/reset/drag verified on segregated synthetic geometry, not a real bike. All six bike model entries remain `approved: false`, `modelUrl: null`.
- Browser evidence is local under `.test-artifacts/` and excluded from Git/public build. Field performance, live integrations and physical-device behaviour are not proven by these tests.

The ongoing implementation and reference-feature checklist is `OBJECTIVES.md`.

## Product details and SEO — 31 October 2026

Confirmed mapping: Aero=B2+ (page 2), Apex=B1 (3), Nova=B2 (4), Teja=B4 (5), Vayu=B5 (7), Vega=B5 Pro (9). This supersedes earlier filename-based candidates. `src/catalogue.js` records visually checked details and conflicting source claims. Product pages and comparison use the same data. Colour swatches are catalogue references, not stock selections. Current retail prices remain request-a-quote; enquiry services are still unavailable.

`src/pages.js` renders routes for the browser and build. `src/seo.js` owns metadata and indexable routes. The build produces complete route HTML, a 404 page, robots.txt, sitemap.xml and Netlify redirects. Vercel uses filesystem routing with clean URLs and the generated 404 page. Preview meta robots applies on both hosts; Netlify also receives a preview X-Robots-Tag. The checked-in sitemap.xml is a ready placeholder using https://example.com; the build regenerates the published sitemap from one origin setting.

### Real-domain switch

Keep SITE_INDEXABLE unset or false for previews. For production set SITE_ORIGIN to the verified HTTPS origin without a path or query, and SITE_INDEXABLE to true. Example PowerShell after replacing the hostname:

```powershell
$env:SITE_ORIGIN = 'https://your-verified-domain.in'
$env:SITE_INDEXABLE = 'true'
npm run build
npm run preview
```

Configure the same variables in the production host. Indexing defaults to off. Placeholder, localhost and non-HTTPS origins cannot enable indexing. Production builds remove the global Netlify preview header. Utility/unavailable operational pages keep noindex metadata and stay out of the sitemap. Production robots allows public crawling and excludes operational routes.

Before launch, inspect page source, canonical/social URLs, robots.txt, sitemap.xml, response headers and a direct unknown URL. Confirm public pages have no preview indexing block; validate structured data; verify the real domain in Search Console and submit /sitemap.xml. Change SITE_ORIGIN and rebuild whenever the domain changes. SEO preparation does not satisfy outstanding business launch gates.

Run npm run check and npm run build. Browser verification uses tests/product-browser.test.mjs with an already installed Playwright and Chrome; set PLAYWRIGHT_PATH and CHROME_PATH as needed. Browser evidence goes to .test-artifacts/, excluded from Git and publication. No packages were added.

### Local verification — 31 October 2026

- 13 native/data/SEO tests passed; production build passed.
- 14 existing browser regression scenarios and 9 motion/3D scenarios passed.
- Added six-model browser checks passed for battery selection, expandable details, galleries and metadata; responsive widths 320–1440, client navigation, comparison, no-JavaScript content, sitemap and 404 behaviour passed.
- Desktop/mobile screenshots reviewed; navigation contrast and anchor spacing corrected. Impeccable detector reported no findings for the changed UI targets.
- Production origin/indexability generation checked locally. Hosted behaviour, Search Console submission, field performance and physical-device/screen-reader testing are not claimed.
