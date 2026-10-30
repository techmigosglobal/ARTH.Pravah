# ARTH.Pravah — Active implementation objectives

Updated: 30 October 2026. This checklist tracks requested outcomes, implementation and verification separately. Existing PRD scope and unresolved business inputs remain in `PRD.md`.

| ID | Objective | Status | Completion evidence / remaining work |
| --- | --- | --- | --- |
| O1 | Auto-sliding homepage hero across Aero, Apex, Nova, Teja, Vayu and Vega | Implemented and verified | Six-second six-model autoplay; decoded-image crossfades, coordinated copy/link, previous/next/dots, progress, pause/resume and rapid-selection tests pass |
| O2 | Richer, consistent motion across the current website | Implemented and verified | Hero entrance/drift, staggered reveals, image depth, gallery/menu transitions, page progress, selection feedback and global motion control; rendered desktop/mobile review complete |
| O3 | More motion graphics and interactive visual storytelling | Implemented and verified | Native SVG flow paths, animated hero accents and real comparison/calculator/model links; reduced-motion and global-pause checks pass |
| O4 | Preserve the real scroll-controlled product films | Preserved and regression verified | Six real 84-frame sequences; actual pixel changes during forward/reverse scrolling, progressive loading, resize, pause/scrub, missing-frame fallback and decoding bounds pass |
| O5 | Properly placed rotatable 3D bike viewer on every model page | Viewer infrastructure implemented and verified | All six model pages include the viewer after the photo gallery; native WebGL drag/keyboard rotation, zoom/reset and invalid-file handling tested with synthetic non-bike geometry; real bike content is O6 |
| O6 | Accurate 3D content for each bike | Waiting for assets — user-confirmed | No GLB/glTF assets supplied. Prepare viewer only; do not generate approximations or mislabel photo/frame switching as true 3D |
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

## Confirmed 3D decision

The user selected: **Prepare viewers for accurate model files; keep 3D pending until they are supplied.**

Required content: one approved model per relevant product/variant, in the supported embedded GLB format documented in README. Do not substitute a procedural bike, AI approximation, another manufacturer's model, or a 2D turntable.

## Reference feature backlog

Reference: https://www.bhoomiautomobiles.com/ (reviewed 30 October 2026).

| Reference pattern | ARTH.Pravah treatment |
| --- | --- |
| Cycling hero and rotating model showcase | Implement six-model native hero carousel; retain verified scroll films |
| Product media carousels / interactive galleries | Retain photo galleries; add true 3D integration pending accurate GLB assets |
| Comparison and savings tools | Preserve comparison and transparent custom running-cost calculator; add approved model data only when available |
| FAQs, charging, warranty and support navigation | Reuse the information pattern with verified ARTH.Pravah content and real backend services when configured |
| Extensive model specifications and certification claims | Never copy to ARTH.Pravah without its own approved evidence |
| EMI, dealer/franchise, B2B, newsletters, additional languages and blog publishing | Backlog candidates; require a later scope decision because the first-release PRD excludes or does not establish these workflows |
| Reviews, business statistics, subsidies, availability and contacts | Do not import reference-site data or manufacture ARTH.Pravah claims |
