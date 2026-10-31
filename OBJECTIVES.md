# ARTH.Pravah — Active implementation objectives

Updated: 31 October 2026. This checklist tracks requested outcomes, implementation and verification separately. Existing PRD scope and unresolved business inputs remain in `PRD.md`.

| ID | Objective | Status | Completion evidence / remaining work |
| --- | --- | --- | --- |
| O1 | Auto-sliding homepage hero across Aero, Apex, Nova, Teja, Vayu and Vega | Implemented and verified | Six-second six-model autoplay; decoded-image crossfades, coordinated copy/link, previous/next/dots, progress, pause/resume and rapid-selection tests pass |
| O2 | Richer, consistent motion across the current website | Implemented and verified | Hero entrance/drift, staggered reveals, image depth, gallery/menu transitions, page progress, selection feedback and global motion control; rendered desktop/mobile review complete |
| O3 | More motion graphics and interactive visual storytelling | Implemented and verified | Native SVG flow paths, animated hero accents and real comparison/calculator/model links; reduced-motion and global-pause checks pass |
| O4 | Preserve the real scroll-controlled product films | Preserved and regression verified | Six real 84-frame sequences; actual pixel changes during forward/reverse scrolling, progressive loading, resize, pause/scrub, missing-frame fallback and decoding bounds pass |
| O5 | Properly placed rotatable 3D bike viewer on every model page | Viewer infrastructure implemented and verified | All six model pages include the viewer after the photo gallery; native WebGL drag/keyboard rotation, zoom/reset and invalid-file handling tested with synthetic non-bike geometry; real bike content is O6 |
| O6 | Generate and integrate photo-based 3D models for all six bikes | Implemented and locally verified | Latest user request authorizes Blender reconstruction. Editable sources and web GLBs are generated from supplied references. Approximation labels remain visible; manufacturer accuracy is not claimed |
| O7 | Mobile, touch, keyboard and reduced-motion support | Implemented and browser verified | Chrome mobile/tablet emulation, keyboard controls, reduced motion, focus/offscreen autoplay holds and global motion pause verified; visibilitychange handles hidden tabs; physical-device testing remains separate |
| O8 | Preserve working pages, comparison, galleries, calculator and honest business states | Frontend regression verified | Model routes, galleries, comparison, calculator and unavailable business/admin states remain functional; 14 existing browser scenarios pass; backend launch dependencies remain in PRD |
| O9 | Local build and browser verification | Passed locally | 8 native tests, 14 existing browser scenarios and 9 motion/3D scenarios pass; production build passes; hero layout checked for all models at 320/375/768/1440px |
| O10 | Record changes, limitations and current verification results | Documented | README includes capabilities, limits, GLB handoff contract and tests; this checklist separates implemented viewers from missing accurate bike models |
| O11 | Use Bhoomi Automobiles as a continuing reference for required future development | Recorded; ongoing | Evaluate model discovery, media galleries, comparison, calculators, FAQs and support navigation against PRD; keep unapproved product facts and out-of-scope workflows separate |
| O12 | Push the completed and verified implementation to techmigosglobal/ARTH.Pravah on main | Pushed and verified | Implementation commit 012cdbf published to main; remote revision matched local HEAD after push; reviewed source/media included and build/test artifacts excluded |
| O13 | Correct Vercel static deployment output and direct-route handling | Verified locally | Production build and 8 native tests pass; Vercel config fields validated against official schema, route exclusions checked, existing headers preserved and Node 22.x pinned; fix prepared for GitHub |

## Constraints retained

- Use the current HTML/CSS/JavaScript architecture. No additional npm packages or animation libraries.
- No GSAP, Three.js, React Three Fiber, Framer Motion/Motion or Lenis.
- Use native Canvas, WebGL, SVG, CSS, requestAnimationFrame, IntersectionObserver and browser events as appropriate.
- Keep all six source models and media mapped correctly. Preserve `PRD.md` and original assets.
- Bhoomi Automobiles is a visual/interactivity reference, not a source of approved ARTH.Pravah product claims, prices, contacts or testimonials.
- Do not deploy or claim hosted/production readiness. Verify locally and report remaining PRD/backend dependencies.

## Confirmed 3D decision — updated 31 October 2026

The latest user instruction authorizes generating Blender models from the supplied images and integrating them into the current website. This supersedes the earlier instruction to wait for externally supplied accurate models.

All six assets are explicitly labeled **photo-based 3D previews**. They are approximate reconstructions with estimated proportions and hidden geometry, not manufacturer-approved CAD. Keep `approved: false` in the manifest; `available: true` with `kind: "photo-reconstruction"` enables the preview. The original galleries remain the product appearance reference. Editable Blender source files are excluded from the web build.

## Reference feature backlog

Reference: https://www.bhoomiautomobiles.com/ (reviewed 30 October 2026).

| Reference pattern | ARTH.Pravah treatment |
| --- | --- |
| Cycling hero and rotating model showcase | Implement six-model native hero carousel; retain verified scroll films |
| Product media carousels / interactive galleries | Retain photo galleries and integrate labeled photo-based Blender reconstructions |
| Comparison and savings tools | Preserve comparison and transparent custom running-cost calculator; add approved model data only when available |
| FAQs, charging, warranty and support navigation | Reuse the information pattern with verified ARTH.Pravah content and real backend services when configured |
| Extensive model specifications and certification claims | Never copy to ARTH.Pravah without its own approved evidence |
| EMI, dealer/franchise, B2B, newsletters, additional languages and blog publishing | Backlog candidates; require a later scope decision because the first-release PRD excludes or does not establish these workflows |
| Reviews, business statistics, subsidies, availability and contacts | Do not import reference-site data or manufacture ARTH.Pravah claims |

## Approved catalogue integration and SEO

The 31 October 2026 owner instruction supersedes older unconfirmed mappings: Aero=B2+ p2, Apex=B1 p3, Nova=B2 p4, Teja=B4 p5, Vayu=B5 p7, Vega=B5 Pro p9. Approved desktop/mobile previews direct key facts, battery exploration, expandable equipment/specifications, catalogue colours, comparison and quote links. Existing films, galleries and pending true-3D integration remain.

Catalogue details are qualified references. Range/warranty conflicts are visible in source notes, prices remain quote-only, and actual configurations/stock require confirmation. Generated route HTML, metadata, factual structured data, sitemap generation, preview indexing controls and a documented domain switch are implemented. No deployment or indexing activation is included.

## Photo-based 3D generation verification — 31 October 2026

- Six editable Blender sources, each with four packed product reference images, and six distinct GLB assets. Sources are outside the production build allowlist.
- Native `npm run check`: 13 tests pass, including all six exported assets through the production GLB parser.
- `npm run build`: production static build succeeds. No runtime dependencies were added.
- `tests/models-browser.test.mjs`: all six production product pages pass at 1440×1000 and 390×844 in Chrome via existing Playwright. Page identity, visible meshes, console health, no premature GLB download, rotate, zoom, reset, desktop drag, mobile horizontal touch rotation, vertical scrolling and persistent preview disclosure are checked. Malformed, pending and untrusted-manifest fallbacks also pass.
- Visual review: simplified bodywork and small details differ from photos; exact dimensions and hidden surfaces are not established. This is an initial reconstruction pass, not verified manufacturer geometry. Original photos remain available for comparison. No hosted deployment or physical-device verification was performed.

Earlier broad motion/gallery/backend verification entries above are historical. This change reran the native suite and the focused six-model browser suite; it does not claim a new complete end-to-end regression of every website feature.
