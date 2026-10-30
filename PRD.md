# ARTH.Pravah Website — Product Requirements Document

**Version:** 1.0  
**Date:** 29 October 2026  
**Status:** Product scope approved; business facts and launch configuration pending  
**Brand:** ARTH.Pravah — An Arthasya Venture  
**Market / language:** India / English  
**Products:** Aero, Apex, Nova, Teja, Vayu, Vega  
**Deliverable:** This PRD only. Website implementation and deployment are subsequent work.

## 1. Product purpose and outcomes

Build a cinematic, informative EV two-wheeler website that helps individual buyers understand the six models, compare approved information, estimate running costs, and contact a real showroom. Support the full operational journey from a guest enquiry to staff follow-up, a confirmed test ride, or a resolved service request.

The public website and secure administration dashboard are one product. A form is complete only when its request reaches a persistent staff work queue; a visual success screen alone does not fulfil the requirement.

### 1.1 Objectives and measurement

| Objective | Measurement | Success criterion |
| --- | --- | --- |
| Help customers find a suitable model | Model-page views, comparison starts/completions, model-specific enquiries | Every model has a distinct usable page; comparisons use equivalent approved fields |
| Generate actionable leads | Successfully stored enquiries by type/model/showroom | Every accepted submission has a reference, timestamp, routing destination, and staff-visible record |
| Turn interest into showroom visits | Requested, confirmed, completed, cancelled, and no-show appointments | Requests and confirmed appointments are distinguishable; staff can manage the full lifecycle |
| Support owners | Service/support requests and resolution timestamps | Every request has ownership, status, and a recorded resolution before closure |
| Maintain trustworthy information | Approval history, publication checks, missing-data reports | No unapproved product claims, fabricated prices, locations, availability, or testimonials are public |
| Operate reliably | Failed submissions, queue age, unassigned requests, notification failures | No acknowledged request is lost; failures are visible and recoverable |

Commercial conversion targets and staff response-time commitments must be supplied by the business. Do not invent sales targets or publish an unsupported response-time promise. The dashboard must expose the measurements needed to establish a baseline.

### 1.2 Release priorities

- **P0:** Essential functionality or a safety/data-integrity dependency. A failure blocks launch.
- **P1:** Required first-release product capability. It must pass acceptance before launch unless the owner explicitly revises this PRD.
- **P2:** Future consideration, excluded from first-release implementation.

All requirements labelled P0 or P1 below are part of the agreed release. Product facts can remain unknown in this document, but launch must follow the publication and readiness rules in Sections 6 and 15.

## 2. Audience, roles, and boundaries

### 2.1 Users

| User | Needs | Access |
| --- | --- | --- |
| Prospective individual buyer | Discover models, compare, estimate costs, request a quote or test ride | Public pages and guest forms |
| Existing owner | Find approved ownership information and request help or service | Public support pages and guest forms |
| Staff | Handle assigned enquiries, appointments, and support requests | Authenticated dashboard; assigned operational records only |
| Owner administrator | Control business content, staff access, all requests, integrations, and publication | Authenticated dashboard with full business permissions |

There is no public account registration, customer login, or customer request-status dashboard in this release. A reference number identifies a conversation for staff; it does not authorise disclosure of customer data.

### 2.2 Included in the first release

Customer website; six model pages; model comparison; running-cost estimates; guest enquiries; manual test-ride confirmation; one initial showroom with future location support; ownership education; service/support requests; owner/staff dashboard; email and automated WhatsApp notifications; privacy-conscious analytics; content approval and operational recovery controls.

### 2.3 Excluded from the first release

Online deposits, paid reservations, checkout, orders, payment refunds, e-commerce stock management, customer accounts, mobile applications, EMI/loan calculators, financing approval, dealer/franchise portals, fleet sales workflows, full vehicle/service-history portals, live charger/swapping reservations, telematics, real-time vehicle tracking, 3D configurators, and additional languages.

Approved starting prices and availability are informational. This website does not sell a vehicle online or promise delivery. Public charging and battery swapping are not advertised as available services without separate verified business approval.

## 3. Information architecture and journeys

### 3.1 Public routes

| Route | Purpose | Primary action |
| --- | --- | --- |
| `/` | Brand introduction, model discovery, ownership benefits, showroom invitation | Explore models / Request a test ride |
| `/models` | All six vehicles and comparison selection | View model / Add to compare |
| `/models/aero`, `/models/apex`, `/models/nova`, `/models/teja`, `/models/vayu`, `/models/vega` | Distinct model stories and approved facts | Request a quote / Request a test ride |
| `/compare` | Compare two or three selected models | Enquire about selected model |
| `/running-costs` | Transparent running-cost estimate | Explore a model / Request a quote |
| `/test-ride` | Request a showroom test ride | Submit request |
| `/showrooms` | Verified locations; one at initial launch | Get directions / Contact / Request a test ride |
| `/ownership` | Charging guidance, warranty information, FAQs | Request support |
| `/support` | Service or support request | Submit request |
| `/about` | Brand and approved company story | Explore models / Contact |
| `/contact` | Business contact details, general and quote enquiries | Submit enquiry / Call / WhatsApp |
| `/privacy`, `/terms` | Approved policy content | Return to relevant journey |

Use `/admin` for authenticated management. Submission confirmations and errors must be accessible, non-indexable, and free of personal details in URLs. Individual showroom URLs can be added when needed; multiple-location search is not a launch dependency.

### 3.2 Core journeys

1. **Discover and enquire:** Home → catalogue → model page → optional comparison → quote form → stored-request confirmation → staff follow-up.
2. **Request a test ride:** Any product CTA → model-prefilled form → showroom/preferred date → request saved → customer acknowledgement → staff availability check → confirmed date/time and notification.
3. **Change an appointment:** Customer contacts staff with reference → staff verifies the customer → reschedule or cancellation is recorded → revised arrangement is communicated.
4. **Estimate running costs:** Enter usage assumptions → select an eligible model/variant or explicitly choose a custom estimate → review costs and assumptions → optionally enquire.
5. **Get support:** Ownership/support page → select service or support → describe issue and optional vehicle details → saved request → assigned staff → resolution → closure.
6. **Manage daily work:** Staff login → assigned queue → open record → follow up/update status → manage linked appointment or support record → record outcome.
7. **Publish product updates:** Owner enters draft → records evidence → approves exact values and associated media → validates preview → publishes version → public pages, comparison, calculator, and metadata use the same approved version.

## 4. Requirement conventions and dependencies

Each functional requirement below identifies its priority, responsible user, expected behaviour, dependencies, and acceptance criteria. Test IDs refer to Section 14. The owner is accountable for business configuration and publication; engineering implements and verifies the specified behaviour.

| Dependency | Meaning |
| --- | --- |
| D1 — Brand/media | Supplied palette and model assets, approved brand identity, logo and media rights/accuracy review |
| D2 — Product facts | Approved model/variant specifications, prices, claim evidence, colours, warranty and consumption data |
| D3 — Showroom/business | Verified showroom, contacts, hours, coverage, supported model availability and responsible staff |
| D4 — Durable requests | Server-side validation, persistent records, idempotent submission, assignment and audit history |
| D5 — Identity/access | Owner/staff authentication, permissions, sessions and account recovery |
| D6 — Messaging | Configured email and WhatsApp services, sender identities, consent rules, delivery callbacks and retries |
| D7 — Policies/measurement | Approved privacy/terms, retention settings, analytics choices and owner access |
| D8 — Delivery/operations | Media optimisation, hosting, monitoring, backups and recovery |

A dependency marked pending is not permission to simulate it or report false success. Show honest unavailable states in previews; follow Section 15 before public launch.

## 5. Customer website functional requirements

### 5.1 Discovery and model content

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| WEB-01 / P0 | Buyer; owner supplies content | Home introduces ARTH.Pravah and the six-model range, with real imagery, approved ownership benefits, showroom information, and clear model/enquiry/test-ride actions | D1, D2, D3 | AT-01: All six models reachable; no fabricated claims, statistics or customer reviews; CTAs reach working destinations |
| WEB-02 / P0 | Buyer | Catalogue shows all six named models in the agreed order, each with its own image, approved highlights, availability label, starting price when approved, and comparison control | D1, D2 | AT-01, AT-03: Each card routes to the matching model; missing prices use “Request a quote”; catalogue remains usable without unsupported filters |
| WEB-03 / P0 | Buyer; owner approves | Six individual product pages follow the differentiated briefs in Section 7, with gallery, video, specifications, colours/variants when approved, FAQs, and quote/test-ride actions | D1, D2, D3 | AT-02, AT-03: Every page has its own story and assets; selected model/variant carries into forms; unknown facts are not inferred |
| WEB-04 / P1 | Buyer | Gallery supports front, side, rear and hero views, accessible enlargement, video playback, and honest captions | D1, D8 | AT-02, AT-14: Correct model media; keyboard-operable controls; media failure has a usable fallback; no fake 360-degree or colour-switching claims |
| WEB-05 / P1 | Buyer | Global navigation offers models, comparison, running costs, showroom, ownership, and contact, with a visible test-ride action | D1 | AT-01, AT-14: Desktop/mobile menus work with keyboard and touch; focus and active page are clear; sticky elements do not obscure content |
| WEB-06 / P1 | Buyer | About, contact, ownership and policy pages use approved business information and connect visitors to relevant actions | D1, D3, D7 | AT-03, AT-15: No placeholder contact links or unapproved history/certification claims; policy links are present at forms and footer |

### 5.2 Comparison

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| CMP-01 / P1 | Buyer | Add/remove models from cards or product pages; compare two or three distinct models; preserve selection during same-browser navigation | D2 | AT-04: Fourth selection explains the limit; duplicates prevented; fewer than two prompts selection; clear-all and replacement work |
| CMP-02 / P0 | Buyer; owner approves data | Compare equivalent approved fields for an explicitly identified variant of each model | D2 | AT-03, AT-04: Matching units and variant labels; missing fields say “Not available”; draft facts, guessed values and zero substitutions never appear |

Comparison fields include starting price and basis, battery type/capacity, approved range with test basis, charging duration and conditions, motor rating, top speed, braking, dimensions, seating/load limits, warranty, and approved features where available. Their presence in this schema does not assert that a product has a particular value or capability.

If variants materially differ, customers select a variant before seeing variant-specific values. A single approved variant can be selected automatically and named. Do not combine the price of one variant with another variant’s range or battery. Offer a “Show differences” view while retaining access to all rows and disclaimers. No algorithmic “best model” badge is required.

### 5.3 Running-cost estimates

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| CALC-01 / P1 | Buyer | Calculate electricity and petrol running costs from visible editable assumptions with clearly labelled units and periods | D2 | AT-05: Formula and sample below reproduce correctly; invalid inputs rejected; zero distance works; negative savings are shown honestly |
| CALC-02 / P0 | Buyer; owner approves data | Model-specific mode uses an approved variant's wall-energy consumption, or an approved documented conversion including charging losses | D2 | AT-03, AT-05: Model mode unavailable without approved consumption data; range alone is never converted into wall-energy consumption |

Inputs: kilometres per day, riding days per month, electricity price in INR/kWh, petrol price in INR/litre, petrol-vehicle mileage in km/litre, and electricity consumption in kWh/100 km. Show the selected model/variant and consumption source. Any editable override switches the result to a clearly labelled custom estimate rather than presenting it as the vehicle's approved result.

A custom mode is permitted when product data is incomplete, provided the visitor explicitly supplies consumption. Do not silently insert invented model values or claim current local tariffs. Other illustrative defaults must be visibly labelled editable assumptions, not live market data. The default period is one month; an optional annual view is exactly 12 identical months and states that assumption.

Let `D = daily_distance × riding_days`, `E = electricity_consumption_kWh_per_100km`, `T = electricity_price`, `P = petrol_price`, and `M = petrol_mileage`:

- Monthly electricity use: `D × E / 100` kWh.
- Monthly EV electricity cost: `D × E / 100 × T` INR.
- Monthly petrol cost: `D / M × P` INR.
- Estimated running-cost difference: `petrol_cost − EV_cost` INR.
- EV cost per km: `E / 100 × T`; petrol cost per km: `P / M`.

Validate all numeric values server-side when submitted or recorded and in the UI for immediate feedback. Distance and prices can be zero; mileage and consumption must be positive; riding days must be an integer from 1 to 31. Reject negative, nonnumeric, infinite, and unreasonably large values using documented field limits. Calculate with unrounded values; format INR to two decimals at display. State that the estimate excludes purchase price, maintenance, insurance, battery replacement, financing and other ownership costs.

**Arithmetic acceptance fixture only, not model data:** 30 km/day × 26 days = 780 km/month; 3 kWh/100 km × INR 8/kWh yields INR 187.20/month; petrol at INR 100/litre and 50 km/litre yields INR 1,560.00/month; difference = INR 1,372.80/month. At zero distance, both monthly costs and the difference are zero.

### 5.4 Guest enquiries and contact

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| LEAD-01 / P0 | Buyer | Submit a quote or general enquiry without account creation, retaining selected model/variant and showroom context | D2, D3, D4 | AT-06: Valid input persists once and returns a reference; quote has a model; general enquiry permits “Not sure”; no payment or login required |
| LEAD-02 / P0 | Buyer | Receive honest submitting/success/error states and recover from connection failures without losing entered values | D4 | AT-06, AT-07: Storage failure never reports success; timeout retry does not create a duplicate; confirmation explains staff follow-up |
| LEAD-03 / P1 | Buyer | Contact the business using configured call, email, or WhatsApp links; use references for offline follow-up | D3, D6 | AT-06, AT-15: Links use verified destinations; no link claims a saved enquiry or delivery when only an external app was opened |

Form fields: name, required mobile number with country-code handling (India +91 initially), optional email, city or pincode, enquiry type, model preference, optional approved variant, optional message, selected showroom where applicable, and separate communication choices. An email is required only when email acknowledgement is requested. A quote requires one model; general enquiries can be undecided. Do not require postal address, government identification, payment details, or an account.

Show concise privacy information and its policy link. Separate request-related channel choices from optional marketing consent; no preselected marketing permission. Store consent wording/version and timestamp. WhatsApp permission is explicit; opting out does not prevent submission. If no electronic acknowledgement channel is selected, show the reference on screen and let staff follow up through the requested contact method.

Validate on the server, trim input, impose field-length limits, and safely render messages as text. A phone-format check does not mean the number is verified. Apply rate limits and abuse controls without blocking legitimate visitors solely because they share a network. Add an accessible challenge only when justified by abuse signals.

### 5.5 Test rides and showrooms

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| RIDE-01 / P0 | Buyer | Submit model, verified showroom, preferred date, optional time preference and contact details as a test-ride request | D2, D3, D4 | AT-08: Past dates blocked; closed/unavailable dates rejected using showroom configuration; confirmation says “request received”, never “appointment booked” |
| RIDE-02 / P0 | Staff; owner | Review requests, check availability manually, record confirmed start/end time, and send the customer the agreed arrangement | D3, D4, D5, D6 | AT-08: Only authorised assignee/owner can confirm; incompatible overlapping model/showroom appointments warn and block confirmation until the conflict is resolved |
| RIDE-03 / P1 | Buyer via staff; staff | Record reschedule and cancellation requests after staff verify the customer's details; communicate the resulting decision | D4, D5, D6 | AT-09: Rescheduling retains the previous appointment/history until a replacement is confirmed; cancellation releases the appointment; updates create one notification event |
| LOC-01 / P0 | Buyer; owner maintains | Show one verified showroom with address, hours, contact methods, directions, service area and model/test-ride availability | D2, D3 | AT-10: Directions point to the verified location; service coverage and availability are explicit; no invented showroom or hours |
| LOC-02 / P1 | Owner; buyer | Add/deactivate locations later without a redesign; let visitors choose between published locations when more than one exists | D3, D4 | AT-10: Inactive locations reject new requests; existing requests retain their location; owner can reassign and communicate changes |

The request form does not expose live bookable slots or promise capacity. Staff enter actual appointment times in Asia/Kolkata and see existing confirmed appointments. The initial capacity rule is one simultaneous test ride per model per showroom; increasing capacity requires an explicit configured capacity and acceptance coverage, not an informal override.

Validate the preferred date against business hours, closure dates, and the configured request horizon. Default horizon: 30 days; owner can change it. Staff must agree any same-day arrangement with the customer; the website makes no same-day guarantee. If a model is unavailable for test rides, explain that and offer a quote/general enquiry instead. Customers outside the supported area may submit an enquiry, but the site must not imply local service or home test rides are available.

No customer can view or modify an appointment solely by typing a reference or guessing a URL. Changes in this release happen through staff after customer verification; do not expose public appointment mutation endpoints. Staff must initiate a callback to the phone already stored on the request, or obtain a reply to a business-initiated message through an already recorded consented contact channel, before making customer-requested changes or disclosing private details. A caller reciting a reference, name or phone number is insufficient. Record the verification channel, time and staff actor without recording sensitive conversation content. If the customer cannot access the stored contact, escalate to the owner for a documented manual identity-recovery review; do not accept a newly supplied number as verification.

### 5.6 Ownership and support

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| OWN-01 / P1 | Buyer/owner; administrator approves | Publish charging education, approved model-specific warranty information, FAQs, and service-contact guidance | D2, D3 | AT-03, AT-11: Guidance is reviewed and variant-specific where necessary; no unsupported compatibility, battery-life, certification or warranty claims |
| SUP-01 / P0 | Existing owner or buyer | Submit a service/support request with contact details, category, issue description, optional model/vehicle reference and showroom | D3, D4 | AT-06, AT-11: Persists and returns a reference; optional vehicle details do not block submission; no customer account required |
| SUP-02 / P1 | Assigned staff; owner | Assign, investigate, resolve and close requests with internal notes and a customer-facing resolution summary | D4, D5, D6 | AT-11, AT-12: Resolution required before closure; private notes excluded from outbound messages; authorised reopening retains history |

Support categories: service enquiry, charging question, warranty enquiry, product question, complaint, and other. An initial service request is not a confirmed workshop appointment. Staff agree any visit separately and record the arrangement. Do not require file uploads at launch; do not collect identity documents or sensitive diagnostic records in the public form.

Charging content must be sourced from approved manufacturer/business guidance and must not imply that on-site public charging or swapping exists. Service coverage, compatible equipment and warranty terms require explicit verification.

## 6. Product facts, approval and publication

### 6.1 Source hierarchy

1. Owner-approved model/variant information backed by business/manufacturer evidence is publishable.
2. The supplied catalogue is a reference for investigation, not proof of specifications, prices or warranties for ARTH.Pravah's named products.
3. Folder names and image resemblance are candidate mapping clues only.
4. Unverified or missing information stays internal and does not become a public fact.

No price, speed, range, motor rating, battery capacity/type, charge time, payload, seating limit, warranty, colour availability, certification, subsidy eligibility or service capability may be invented to make a page look complete. The same rule applies to testimonials, business statistics, awards, company history and environmental claims.

### 6.2 Product content schema

Each model needs a stable ID and slug; display name; unique editorial brief; short introduction; approved feature statements; ordered sections; its own media; FAQs; availability; and quote/test-ride eligibility. Variant records hold values that differ by battery, configuration, price, colour, or other approved options.

Store specifications with field name, numeric/text value, unit, applicable variant, qualifying conditions/test basis, evidence reference, approval state, approver and timestamp. Record price as INR amount, “starting from” qualification, pricing basis (such as ex-showroom only when confirmed), included/excluded charges, location applicability and effective date. Do not label a bare catalogue figure as a final customer price.

Ranges, charging durations and warranties require their conditions next to the relevant claim. Capacity and maximum payload are distinct concepts; do not turn a filename such as `double` into a seating approval. Images showing an accessory or colour do not establish included equipment or availability.

### 6.3 Publication requirements

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| DATA-01 / P0 | Owner | Maintain draft, approved and published content versions with evidence for factual claims | D2, D5 | AT-03, AT-13: Only owner can approve/publish; an edited approved fact returns to draft; old published version remains until replacement publication |
| DATA-02 / P0 | Owner; public reader | Publish the same approved product version to pages, comparison, calculator inputs and structured data | D2, D8 | AT-03, AT-13: Publication invalidates stale caches; version consistency verified; rollback restores a prior approved version across surfaces |
| DATA-03 / P0 | Owner | Preview missing facts and publication blockers before launch or updates | D1, D2, D3 | AT-03, AT-13: Missing price falls back to quote; unsupported test rides/calculators disabled honestly; no pending claim enters public markup |

Minimum publishable product content: approved identity, rights/accuracy-reviewed model imagery, unique approved non-speculative introduction, quote route, and explicit availability status. Numeric specifications can remain unavailable; the product page must say so clearly. All six pages are required at launch. Model-specific calculators and test rides require their additional approved data and availability; general enquiries remain available where operationally supported.

Catalogue downloads must not expose the reference supplier PDF as ARTH.Pravah's official brochure. A public brochure requires separately approved brand/model content. Until then, omit a download action rather than linking misleading material.

## 7. Six-model differentiation and asset register

### 7.1 Editorial briefs

These are proposed storytelling directions based on supplied visual assets, not engineering claims. The owner approves final copy and media accuracy. Do not infer relative speed, quality, capacity, range, price or intended certified use from these briefs.

| Model | Distinct presentation direction | Page content order after hero | Required verification |
| --- | --- | --- | --- |
| Aero | City-setting visual story with a clean, direct introduction | Everyday-use questions → exterior detail gallery → approved highlights → specifications → video → FAQs → enquiry | Confirm B5 relationship and all mechanical/price claims |
| Apex | Evening-city presentation emphasising visual details and a bold silhouette | Detail-led gallery → unique approved feature story → video → specifications → comparison invitation → FAQs → enquiry | `optimus` filename has no confirmed named catalogue match |
| Nova | Residential-setting introduction and a guided, easy-to-scan information sequence | Gallery → design narrative → FAQs for first-time EV buyers → approved specifications → video → enquiry | `aura` filename suggests a candidate only; verify visual and variant consistency |
| Teja | Open-road imagery and journey-led storytelling without a performance promise | Video → exterior/design story → approved highlights → specifications → ownership guidance → FAQs → enquiry | `double` filename is not evidence of seating or payload; no confirmed catalogue match |
| Vayu | Workshop/utility visual context with emphasis on practical buyer questions | Practical-use FAQs → approved equipment/accessory information → gallery → specifications → video → enquiry | Verify depicted storage/accessories and allowed use; `single` is not a specification |
| Vega | City-night presentation with a distinct styling narrative | Styling gallery → video → approved highlights → specifications → comparison invitation → ownership FAQs → enquiry | Confirm D5 relationship, variant, available colours and all claims |

Common components for specification tables, CTAs, accessibility and navigation are encouraged. Differentiation requires unique approved copy, model-appropriate section emphasis, imagery and gallery sequence, rather than only swapping the model name in identical text. A module without approved content is omitted or shown as an honest unavailable state; it is not filled with generic product claims.

### 7.2 Verified local asset inventory

Inventory checked on 29 October 2026: 25 PNG images, each 1376 × 768, plus six MP4 videos at 1280 × 720, approximately 12.3–12.8 seconds each. Source videos include audio tracks; audio content and rights still require review. These are supplied source assets, not production-ready delivery sizes.

| Model | Hero | Additional images | Video |
| --- | --- | --- | --- |
| Aero | `Aero/b5_hero.png` | `Aero/b5_front.png`, `Aero/b5_side.png`, `Aero/b5_back.png` | `Aero/Aero_ARTH.Pravah.mp4` |
| Apex | `Apex/optimus_hero.png` | `Apex/optimus_front.png`, `Apex/optimus_side.png`, `Apex/optimus_back.png` | `Apex/Apex_ARTH.Pravah.mp4` |
| Nova | `Nova/aura_hero.png` | `Nova/aura_hero1.png`, `Nova/aura_front.png`, `Nova/aura_side.png`, `Nova/aura_back.png` | `Nova/Nova_ARTH.Pravah.mp4` |
| Teja | `Teja/double_hero.png` | `Teja/double_front.png`, `Teja/double_side.png`, `Teja/double_back.png` | `Teja/Teja_ARTH.Pravah.mp4` |
| Vayu | `Vayu/single_hero.png` | `Vayu/single_front.png`, `Vayu/single_side.png`, `Vayu/single_back.png` | `Vayu/Vayu_ARTH.Pravah.mp4` |
| Vega | `Vega/d5_hero.png` | `Vega/d5_front.png`, `Vega/d5_side.png`, `Vega/d5_back.png` | `Vega/Vega_ARTH.Pravah 2.mp4` |

Exclude all `__MACOSX` directories and `._` resource-fork metadata from ingestion, optimisation and publication. Preserve original assets; generated production derivatives belong in the later implementation. Review each view and video for matching vehicle identity, accessory/colour consistency, readable marks, and misleading visual artefacts before approval. Do not recolour a photograph to suggest an unverified product option.

### 7.3 Reference evidence register

| Source | What was observed | Permitted use / limitation |
| --- | --- | --- |
| [Colour_Pallette.jpeg](Colour_Pallette.jpeg) | Deep blue `#112C3B`, electric teal `#00A9B7`, warm white `#F4F5F2`, metallic grey `#B9C3C7` | Authoritative supplied palette reference; derive accessible usage as specified in Section 11 |
| [Showroom reference](<WhatsApp Image 2026-10-29 at 7.37.24 PM.jpeg>) | ARTH.Pravah branding and “An Arthasya Venture”; conceptual showroom/service/charging/swapping presentation | Brand/design context only; does not establish a real address, operating facility, hours or offered services |
| [allmodels_catalogue.pdf](allmodels_catalogue.pdf), page 7 (one-based) | B5 supplier model | Unconfirmed Aero candidate based on `b5` filenames; no values approved for public use |
| Same catalogue, page 18 | Aura supplier model | Unconfirmed Nova candidate based on `aura` filenames; imagery and identity need checking |
| Same catalogue, page 17 | D5 supplier model | Unconfirmed Vega candidate based on `d5` filenames; no values approved for public use |
| Same catalogue, all 20 pages reviewed as reference | Other supplier models; no confirmed named matches for Apex, Teja, Vayu | Do not select the closest-looking vehicle and copy its specifications |

The source catalogue is image-based; its contents require visual verification. Prices, range, dimensions and warranties in it are not approved ARTH.Pravah facts. Public copy must not present supplier reference names as confirmed equivalents.

## 8. Administration requirements and permissions

### 8.1 Access matrix

| Capability | Owner | Staff | Public/guest |
| --- | --- | --- | --- |
| View published content | Yes | Yes | Yes |
| Submit public requests | Yes | Yes | Yes |
| View all customer requests / unassigned intake | Yes | No | No |
| View assigned enquiries, appointments and support | Yes | Yes | No |
| Update assigned status, notes and agreed arrangements | Yes | Yes | No |
| Assign/reassign records | Yes | No | No |
| View consent/contact details needed for assigned work | Yes | Yes | No |
| Publish content, facts, prices, availability, policies | Yes | No | No |
| Manage staff, integrations, retention, exports and deletion | Yes | No | No |
| Read relevant operational history | All | Assigned records only | No |
| Approve/rollback publication | Yes | No | No |

Permissions apply to APIs, direct URLs, searches, list totals, exports and mutations, not only navigation visibility. Staff cannot gain broader access by omitting a filter or substituting a foreign request ID. An owner must assign initial requests; the owner receives unassigned-intake alerts. By default, related lead/appointment work shares one assignee; reassignment transfers access immediately and is audited.

### 8.2 Functional requirements

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| ADM-01 / P0 | Owner/staff | Secure login, logout, recovery and session expiry; owner-only account invitations/deactivation | D5 | AT-12: Public signup absent; disabled account loses active access; recovery responses do not reveal account existence; owner MFA enabled before launch |
| ADM-02 / P0 | Owner | View intake, assign/reassign records, filter by type/model/showroom/date/status/assignee, and inspect history | D4, D5 | AT-06, AT-12: Accepted requests visible; unassigned queue clear; filters do not leak restricted records |
| ADM-03 / P0 | Staff; owner | Manage permitted sales, appointment and support lifecycles with notes and outcomes | D4, D5 | AT-08, AT-09, AT-11, AT-12: Invalid transitions rejected; actor/time recorded; stale concurrent edits handled without overwriting another update |
| ADM-04 / P0 | Owner | Edit product/variant content, media order, facts, price basis, availability, FAQs, pages and showroom configuration | D1, D2, D3, D5 | AT-03, AT-13: Preview available; validation identifies missing dependencies; owner approval needed; staff writes rejected |
| ADM-05 / P1 | Owner | See aggregate counts by lifecycle, model, showroom and date, plus unassigned/aged records and delivery failures | D4, D5, D6 | AT-16: Counts reconcile to permitted source records and selected dates; “won” is a staff-reported outcome, not a paid order |
| ADM-06 / P0 | Owner | Inspect notification failures and retry eligible deliveries without duplicating successful sends | D4, D5, D6 | AT-07: Provider acceptance distinguished from delivery; retry history visible; staff restricted to assigned-record delivery status |
| ADM-07 / P0 | Owner | Review audit history, request deletion/anonymisation and perform controlled customer-data export | D4, D5, D7 | AT-12, AT-17: Exports owner-only and audited; spreadsheet-formula injection prevented; deletion follows configured retention and legal holds |

Staff should see their assigned workload and overdue items rather than company-wide customer analytics. Owner reporting must never make unassigned customer records accessible to staff through drill-downs.

### 8.3 State and transition rules

**Sales:** New → contacted → qualified → won/lost. New/contacted/qualified can be marked spam or lost with a reason. Owner may reopen a closed lead to contacted with a reason. “Won” records an offline sale reported by staff; it does not generate an online order or prove payment. Spam is a retained classification subject to retention rules, not silent deletion.

**Appointments:** Requested → confirmed → completed/no-show/cancelled. Requested may be cancelled. Requested or confirmed may move to reschedule requested; staff then confirm an agreed replacement or cancel. A confirmed appointment's time remains reserved while rescheduling is pending, until replacement confirmation or cancellation releases it. Store previous/next schedule, reason, actor and timestamps. Completed, cancelled and no-show are terminal; create a linked new request for another visit instead of rewriting history.

Cancellation requests handled through staff may move directly to cancelled after customer verification. Test rides that cannot be confirmed remain requested with an explanatory note until staff and customer choose an alternative or cancellation. No-show applies only after a confirmed appointment ends.

**Support:** New → assigned → in progress → resolved → closed. A staff/owner action can reopen resolved/closed to in progress with a reason and current assignee. Resolving requires a resolution summary; closing requires a prior resolved state. Internal investigation notes remain separate from messages intended for customers.

All transitions are enforced server-side and recorded with actor, timestamp and relevant reason. Duplicate clicks do not create duplicate events. Conflicting updates return a refresh/review prompt rather than silently replacing another staff member's work.

## 9. Notifications, consent and reliability

### 9.1 Message events

| Event | Staff/owner notification | Customer notification |
| --- | --- | --- |
| New enquiry, test-ride request, service/support request | Owner's configured intake recipients; assigned staff if already assigned | Acknowledgement with reference and next step through selected consented channels |
| Assignment/reassignment | New assignee; owner can inspect history | None by default |
| Appointment confirmed or replacement confirmed | Assigned staff; owner history | Agreed model, showroom, date/time, directions/contact and change instructions |
| Reschedule request recorded | Assigned staff | Acknowledgement that the change awaits agreement; do not claim the old appointment is already replaced |
| Appointment cancelled | Assigned staff | Cancellation acknowledgement |
| Support resolved | Assigned staff; owner history | Approved customer-facing resolution summary |
| Delivery repeatedly fails or intake remains unassigned | Owner operational alert/dashboard | No recursive failure notification |

Email and WhatsApp are both integration requirements. Customer sends depend on that customer's channel choices, required destination data and provider eligibility. Staff recipients are explicitly configured by the owner. No mass marketing campaign or appointment-reminder engine is included in this release.

### 9.2 Delivery requirements

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| MSG-01 / P0 | Owner; customer/staff recipient | Send the event-appropriate message only to authorised configured recipients and consented customer channels | D4, D6, D7 | AT-07: Opt-out respected; optional marketing refusal does not block service; messages contain no private notes or unrelated customer data |
| MSG-02 / P0 | Owner | Persist notification intent with the underlying business event, then deliver asynchronously with idempotency and observable outcomes | D4, D6 | AT-07: Worker outage preserves pending delivery; provider timeout becomes unknown/pending until reconciled; duplicate callbacks do not duplicate events |
| MSG-03 / P1 | Owner | Retry temporary failures and permit controlled manual retry of exhausted deliveries | D5, D6 | AT-07: Retries stop on permanent error, withdrawn consent or changed eligibility; successful deliveries are not resent by routine retry |

A durable outbox or equivalent transaction-safe queue must prevent the gap where a request is saved but its notification is never queued. Each delivery has business event ID, recipient, channel, template/version, status, attempts, timestamps, provider reference where available, and a sanitised error. Use pending, sending, provider-accepted, delivered, failed, suppressed and unknown states as applicable; do not pretend the provider supplies delivery proof it does not expose.

Default transient retry schedule: after 1 minute, 5 minutes, 30 minutes and 2 hours, then mark exhausted for owner review. Honour provider retry timing where required. An uncertain send outcome must be reconciled before resending to minimise duplicate messages. Manual retries need a reason, an audit entry and an idempotency boundary; deliberate resend is a separate explicit action.

Integration launch inputs: chosen email and WhatsApp providers, business-owned sender/number, credentials stored as secrets, verified recipient configuration, necessary templates/permissions, delivery callback validation, and tests of provider failures. Verify current provider policies and onboarding requirements during implementation; this PRD does not assert that an account or messaging approval already exists. Do not add SMS without a scope change.

## 10. Logical data and interface contracts

This section specifies product contracts, not a required database engine, framework or endpoint naming convention. Technology and hosting choices are subsequent engineering decisions constrained by this PRD.

| Entity | Minimum responsibilities |
| --- | --- |
| Model | Stable identity/slug, approved display content, publication version, enquiry/test-ride eligibility |
| Variant | Parent model, approved configuration, price and price basis, colours, availability, specification applicability |
| Specification/claim | Value/unit, conditions, evidence, approval state, approver, approval/version dates |
| Media asset | Owning model, source/derivative references, type, order, alt text/poster/captions, accuracy/rights approval |
| Showroom | Verified address/coordinates, contacts, hours/closures, timezone, coverage, availability and routing settings |
| Customer request | Opaque internal ID, nonsequential human reference, type, contact data, model/variant/location context, consent, assignee, status, created/updated timestamps |
| Sales enquiry | Quote/general type, qualification/outcome, linkage to test rides or related requests |
| Appointment | Request, model/variant, showroom, preferred date, confirmed interval, assignee, status, previous arrangements/history |
| Support request | Category, optional vehicle reference, issue, assignee, internal notes, customer-facing resolution |
| Staff account | Role, active state, identity/session links, assignment access; no public signup |
| Consent record | Purpose/channel, destination, granted/withdrawn state, wording/version, timestamps and source |
| Notification event/delivery | Business event, recipient/channel, eligibility decision, template/version, provider status, retry/idempotency history |
| Audit event | Actor, action, target, safe change summary, reason where required, timestamp |
| Business configuration | Public contacts, publication settings, retention rules, notification recipients, approved calculator assumptions |

### 10.1 Submission contract

- Public forms submit only allowlisted input fields. Clients cannot set assignee, internal status, publication approval, staff role, consent timestamps, or audit actor.
- The server validates referenced model/variant/showroom IDs and current eligibility. Tampered IDs, foreign variants and inactive locations return actionable validation errors.
- Generate an idempotency token per submission intent. Repeating the same token and payload returns the original result; changed payload with that token returns a conflict rather than silently altering the request. A deliberate new request uses a new token. Keep the key long enough to cover retries; initial minimum is 24 hours.
- Persist request, initial status, consent and notification intent atomically or through an equivalently recoverable mechanism. Return the public reference only after durable acceptance.
- Success contains the reference and next step; failure distinguishes field errors, temporary unavailability and submission conflict without exposing internals. Never return other customers' records or internal notes.
- Store timestamps consistently and display customer appointment dates/times in Asia/Kolkata with clear labels. Preserve model/variant/publication context so future content changes do not rewrite past requests.
- Store only necessary attribution fields from an allowlist. Do not copy arbitrary URL query strings into customer records or analytics.

### 10.2 Staff and publishing contracts

All staff reads and writes derive actor/role from the authenticated session and apply assigned-record scope on the server. Owner-only actions use separate permission checks. Related-record linkage must be authorised; a permitted enquiry must not expose another customer's support record through a manipulated relationship.

Operational updates require an expected version or equivalent concurrency control. Content publication is a coherent versioned change and must not leave public pages and calculators using mixed facts. External delivery callbacks require provider authenticity checks and idempotent processing. Secrets and raw provider errors must never enter public responses.

## 11. Visual design, media and accessibility

### 11.1 Design direction

Use cinematic product storytelling with readable information and straightforward enquiry actions. Large model imagery and selected video should establish personality; clear specifications, FAQs and staff-contact journeys support decisions.

| Token | Supplied colour | Intended application |
| --- | --- | --- |
| Deep blue | `#112C3B` | Header/footer, dark hero overlays, high-contrast text and primary structural surfaces |
| Electric teal | `#00A9B7` | Brand accents, selected states, interaction emphasis; validate text contrast before use |
| Warm white | `#F4F5F2` | Main reading surfaces and light content areas |
| Metallic grey | `#B9C3C7` | Secondary surfaces, dividers and supporting decoration; not the default small-text colour |

Use deep-blue text on teal actions when that pairing meets the required contrast. Do not assume white-on-teal or grey-on-white is readable. Add accessible shades/neutral tokens where needed while preserving the supplied brand identity. Statuses must use text/icons as well as colour.

Select a readable licensed typeface during design; avoid decorative fonts for forms/specifications. Use a consistent spacing/type scale, clear headings and restrained borders. Header and floating CTAs must leave reading and keyboard focus unobstructed. No forced splash screen, automatic audio, scroll hijacking or animation-only navigation.

### 11.2 Responsive and media behaviour

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| UX-01 / P0 | All visitors/staff | Responsive pages and forms usable from 320 px mobile through large desktop widths | D1, D8 | AT-14: No page-level horizontal overflow; comparison table can scroll with clear guidance; controls remain reachable at zoom |
| UX-02 / P0 | Keyboard/assistive-technology users | Semantic structure, labelled controls, visible focus, skip link, accessible validation and managed dialog/menu focus | D1 | AT-14: Full journeys work without a pointer; errors announced and linked to fields; no keyboard trap; WCAG 2.2 AA used as acceptance target |
| UX-03 / P1 | Visitors on constrained networks | Responsive image derivatives, reserved media dimensions, deferred offscreen media, posters and restrained video loading | D1, D8 | AT-14, AT-15: Initial page does not download all model videos; content/CTAs work with media blocked; failed image/video has a useful fallback |
| UX-04 / P0 | Motion-sensitive visitors | Respect reduced-motion and browser autoplay restrictions, with pause/play and static alternatives | D1, D8 | AT-14: No forced playback; muted autoplay only when permitted; reduced-motion uses poster/static presentation by default |

Use descriptive alt text for informative vehicle views; decorative imagery has empty alt text. Image captions must distinguish illustrative scenes from verified product details where needed. Review meaningful video speech/text for captions or equivalent text; essential product information must also exist outside video. A user-initiated sound control is required if audio is offered.

Forms expose idle, editing, invalid, submitting, accepted and failed states. Buttons prevent accidental duplicate submissions while keeping recoverable retries possible. Galleries and comparison expose loading, empty selection, unavailable data and error states. Admin lists expose empty results, no assigned work, loading and access-denied states. Do not use an endlessly loading screen for a permanent failure.

## 12. Security, privacy and operational requirements

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| SEC-01 / P0 | Owner/staff | Enforce role and assignment permissions on every private operation | D4, D5 | AT-12: Public, inactive, unassigned and foreign-record attempts fail without metadata/PII leakage |
| SEC-02 / P0 | Owner | Protect authentication, secrets, transport, forms, sessions and integration callbacks | D5, D6, D8 | AT-12, AT-17: Rate-limited auth/recovery; secure sessions; CSRF protection where applicable; safe output; credentials never shipped to browser |
| PRIV-01 / P0 | Owner; customer | Collect minimum required information, store consent and apply approved retention/deletion rules | D4, D7 | AT-17: No PII in public URLs/analytics; owner can locate and act on requests; withdrawal stops future eligible sends |
| OPS-01 / P0 | Owner/operations | Back up business data/configuration and demonstrate recovery | D4, D8 | AT-18: Restore into an isolated environment preserves requests/assignments/consent; sends remain disabled until controlled recovery completes |
| OPS-02 / P0 | Owner/operations | Monitor failed submissions, unassigned intake, notification backlog/failures, authentication anomalies and stale publication | D4, D5, D6, D8 | AT-07, AT-18: Owner can see actionable failures; alerts exclude unnecessary PII; operational incidents have an accountable recipient |

### 12.1 Authentication and safeguards

Use a maintained authentication implementation. No shared staff passwords or hard-coded credentials. Owner MFA is required before production launch. Owner invites staff; deactivation invalidates access and prompts reassignment of their active workload. Prevent removal of the last active owner without a replacement/recovery procedure. Default session policy: 30-minute idle timeout and 12-hour absolute session lifetime, with reauthentication for sensitive account/export/integration actions.

Encrypt traffic and protect stored data through hosting/database controls. Keep service credentials server-side. Validate uploads if owner media upload is implemented; allow only supported safe media, impose size limits and prohibit executable content. Public customer file uploads remain excluded. Apply safe rich-text/content rendering, request-size limits, injection prevention and restrictive cross-origin policies appropriate to the chosen stack.

### 12.2 Retention and customer-data handling

The owner must approve concrete retention periods, deletion/anonymisation rules, backup expiry and any legal hold handling before production. This document does not set a legal retention period. No indefinite retention default is permitted. Maintain contact-data access and export audit entries without copying whole message bodies or secrets into logs.

Provide an owner-operated process for data access/correction/deletion requests through the published contact channel, verifying identity using the existing-contact process in Section 5.5 before disclosure or mutation. Explain backup retention and delayed expiry in the approved policy. Retain only a minimal permitted audit trail after anonymisation. Deletion must update notification eligibility and downstream jobs; retries must not recreate removed customer records.

### 12.3 Recovery targets and runbook

Initial engineering targets, subject to owner acceptance of hosting costs: recovery point within 24 hours and recovery time within 8 hours. Use daily encrypted backups with restricted access and owner-approved retention; verify an isolated restore before launch and repeat quarterly after launch. Store production secrets separately from backups where practical and document how to recover configuration safely.

Recovery steps must cover request records, consent, assignments, publication versions, media references, and pending notification state. Keep outbound messaging disabled during restore verification. Reconcile completed/provider-accepted sends before re-enabling workers to prevent mass duplicate acknowledgements. Record incident ownership, backup time, recovered range and unresolved gaps.

## 13. Search, performance and measurement

| ID / priority | Responsible user | Expected behaviour | Dependencies | Acceptance criteria |
| --- | --- | --- | --- | --- |
| SEO-01 / P1 | Buyer/search visitor; owner approves | Unique titles/descriptions, canonical URLs, sitemap, social previews and structured data using only public approved facts | D1, D2, D3, D8 | AT-15: Six model URLs discoverable; no fabricated prices/reviews/stock; admin, previews, private APIs and confirmations excluded from indexing |
| ANA-01 / P1 | Owner | Measure discovery and successful conversions without collecting form contents in analytics | D7 | AT-16, AT-17: Accepted-event counts reconcile; retries do not double-count; personal details absent from events/session recordings |
| PERF-01 / P1 | All users | Deliver important content promptly and keep actions responsive on mobile | D1, D8 | AT-15: Meet prelaunch budgets below with optimised media and representative mobile testing |

Core analytics: model viewed, compare opened/completed, calculator completed, enquiry accepted, test-ride request accepted, support request accepted, and call/email/WhatsApp/directions link clicked. Distinguish external-link clicks from saved enquiries and confirmed appointments. Log conversion acceptance after persistent success, not button click. Use event IDs to deduplicate retries; do not send names, phone numbers, email addresses, exact addresses, issue text, vehicle identifiers or public references to marketing analytics.

The owner selects analytics and consent configuration before launch. Essential operational counters must work independently of optional tracking. Nonessential tracking follows the approved consent policy; no session recording of customer forms. Staff-assessed qualification/appointment outcomes belong to protected reporting, not public event payloads.

Prelaunch performance targets: LCP ≤ 2.5 s, CLS ≤ 0.1, and interaction response ≤ 200 ms in representative mobile testing. Limit initial transferred page resources to approximately 2 MB excluding user-initiated video and essential third-party exceptions documented by the owner. Test on a midrange mobile profile with a constrained network. Field p75 metrics, including INP, require postlaunch traffic and must not be claimed as proven by a build or synthetic run. Rendering should expose meaningful text and navigation without waiting for video or analytics.

## 14. Acceptance and verification matrix

These are requirements for the future implementation, not claims that the website already exists or has passed testing. Verify browser-visible behaviour and backend persistence/permissions separately; a successful build is not evidence of correct request routing or message delivery.

| Test | Coverage | Scenario and required evidence |
| --- | --- | --- |
| AT-01 | WEB-01, WEB-02, WEB-05 | At mobile and desktop sizes, reach all six model pages and each main journey; verify names, card links, navigation, CTAs and empty/missing-data states |
| AT-02 | WEB-03, WEB-04 | Inspect six pages against Section 7: distinct copy/order/emphasis, correct front/side/rear/hero/video, no cross-model assets, working gallery and video controls |
| AT-03 | WEB-02/03/06, CMP-02, CALC-02, OWN-01, DATA-01/02/03 | Seed draft/approved/published versions; prove draft price/spec/range/warranty is absent from UI, public API and structured data; missing values are honest; variant price and specs stay aligned |
| AT-04 | CMP-01/02 | Compare two and three models, reject fourth/duplicate, change variant, remove/clear, restore same-browser selection, show differences, and navigate a narrow-screen table with keyboard |
| AT-05 | CALC-01/02 | Reproduce Section 5.3 arithmetic fixture; test zero distance/prices, negative savings, invalid/huge values, zero mileage, day bounds, missing consumption, custom override and annual-period labelling |
| AT-06 | LEAD-01/02/03, SUP-01, ADM-02 | Submit each form type; inspect stored fields, consent, context, unique reference, assignment queue and acknowledgement intent; preserve form values on validation/storage failure |
| AT-07 | LEAD-02, MSG-01/02/03, ADM-06, OPS-02 | Inject database failure, network timeout after commit, repeated token, conflicting payload, worker outage, permanent/transient provider errors, duplicate callbacks, uncertain delivery and consent withdrawal; prove no false success, lost request or routine duplicate send |
| AT-08 | RIDE-01/02, ADM-03 | Submit preferred date without a booking guarantee; reject past/closed/out-of-horizon dates and unsupported models; staff confirm actual interval; reject overlap at configured capacity, including concurrent confirmation attempts |
| AT-09 | RIDE-03, ADM-03 | Request reschedule through a staff-initiated callback or reply on a recorded consented channel; reject reference-only or newly supplied-number verification; retain original reservation until replacement/cancellation; cancel, complete and mark no-show only from permitted states; inspect history and outbound event count |
| AT-10 | LOC-01/02 | Verify first showroom details/directions; add a second in test data, select location and route requests; deactivate one and retain old request context while rejecting new submissions there |
| AT-11 | OWN-01, SUP-01/02, ADM-03 | Submit without optional vehicle details; assign, investigate, resolve, close and reopen; reject closure without resolution; show no private notes to customers; service request never becomes an automatic workshop booking |
| AT-12 | ADM-01/02/03/07, SEC-01/02 | Test public user, owner, assigned staff, other staff and inactive staff across lists/detail/search/export/mutation/direct URLs; tamper IDs and omit scopes; confirm session revocation, recovery behaviour and role restrictions |
| AT-13 | DATA-01/02/03, ADM-04 | Edit an approved fact into draft, preview, approve/publish a coherent version, reject staff publication, invalidate caches and rollback; verify every public surface uses the intended version |
| AT-14 | WEB-04/05, UX-01/02/03/04 | Test at 320/375/768/1024/1440 px, keyboard-only and screen-reader form flow, 200% zoom, 400% reflow, reduced motion, blocked media, narrow comparison and failure states; verify contrast and focus visibility |
| AT-15 | WEB-06, LEAD-03, UX-03, SEO-01, PERF-01 | Inspect verified links, indexing exclusions, sitemap/canonicals/metadata/schema; measure mobile page budgets; test slow/offline transitions and video fallback; report synthetic and field proof separately |
| AT-16 | ADM-05, ANA-01 | Reconcile dashboard counts and accepted conversion events against persistent test records; distinguish clicks, requests and confirmations; prove retries and page reloads do not inflate conversions |
| AT-17 | ADM-07, PRIV-01, SEC-02, ANA-01 | Inspect logs/URLs/events for PII; test consent withdrawal, retention/deletion/anonymisation, owner-only audited export, malicious spreadsheet content and cross-customer disclosure attempts |
| AT-18 | OPS-01/02 | Restore a backup into isolation, verify records/publication/consent, exercise operational alerts, reconcile notification state, and demonstrate controlled resumption within agreed recovery targets |

Use synthetic test records in isolated development/test environments; never display them as real public customers, leads or testimonials. Remove or segregate test data before launch. Test email/WhatsApp recipients must be explicitly configured; no tests send to arbitrary customer numbers. Production readiness requires approved live end-to-end delivery checks to designated business recipients after provider configuration.

## 15. Launch inputs, gates and implementation sequence

### 15.1 Required owner-supplied inputs

| Input | Current state | Readiness rule |
| --- | --- | --- |
| First showroom city, full address, map position, hours, closures and coverage | Pending | Required for public showroom and visit workflows; no fabricated replacement |
| Customer phone, email and WhatsApp number | Pending | Required for corresponding public contacts and verification of actual routing |
| Intended domain and approved business/legal identity | Pending | Required for production domain, sender configuration, metadata and policy accuracy |
| Approved logo, brand copy and media rights/accuracy | Supplied references; final approval pending | Required before branded public publication |
| All six model identities and candidate supplier mappings | Names/folders known; mappings unconfirmed | Owner verifies identity; uncertain catalogue data stays internal |
| Product/variant facts, prices and basis, colours, warranty and availability | Pending | Require evidence and approval for every published claim; quote fallback permitted for missing price |
| Energy-consumption source and calculator assumptions | Pending | Required for model-specific calculator mode; explicit user-input custom mode remains possible |
| Test-ride model availability, staff assignees and calendar settings | Pending | Required before accepting test-ride requests for that model/location |
| Staff/owner accounts, intake recipient and operating response process | Pending | Required to ensure every request reaches an accountable human |
| Email/WhatsApp providers, sender ownership, credentials, templates and consent eligibility | Pending | Both channels configured and tested; no simulated delivery claims |
| Privacy/terms, consent wording and retention/deletion policy | Pending | Business-approved content and concrete settings required before collecting production data |
| Hosting, backup retention, recovery owner and operational alert recipient | Pending | Required before production; isolated restore and alert checks must pass |

### 15.2 Launch gates

1. **Content:** All six distinct product pages, approved brand/media, verified showroom/contact details, and honest handling of unavailable facts. No pending factual claims exposed publicly.
2. **Customer journeys:** Every P0/P1 journey works end to end. Quote, enquiry, test-ride and support forms persist records and return valid references; manual confirmation remains explicit.
3. **Administration:** Owner/staff permissions, assignment, state transitions, concurrency, publication and recovery work; owner MFA active; no shared/default credentials.
4. **Messaging:** Email and WhatsApp onboarding/configuration complete, consent respected, acknowledgement/update delivery verified, failures/retries observable and duplicates controlled.
5. **Trust/accessibility:** Approved policies, configured retention, accessible mobile/desktop journeys, keyboard/reduced-motion support, and no exposed customer information.
6. **Operations:** Performance budgets reviewed, alerts tested, owner response responsibilities accepted, and isolated backup recovery demonstrated.

Missing optional numeric facts do not justify invented content. A missing dependency may disable its dependent feature only where this PRD explicitly allows an honest fallback, such as quote instead of price or custom instead of model-specific cost estimates. Reducing the agreed release capability requires an explicit owner scope change.

### 15.3 Subsequent implementation order

1. Approve business inputs and product/media evidence; establish design tokens and reviewed content briefs.
2. Build product/showroom/content data, publication controls, owner/staff authentication and permissions.
3. Implement public discovery, six differentiated pages, comparison and calculator with missing-data rules.
4. Implement durable guest forms, staff queues, appointment/support workflows and audit history.
5. Integrate email/WhatsApp, consent enforcement, asynchronous delivery and operational failure handling.
6. Complete accessibility, search, measurement, performance, security and recovery verification against Section 14; deploy only under a separate implementation/deployment instruction.

## 16. Decision record

The following decisions were explicitly selected during requirements discovery and are the baseline for later development:

| Topic | Agreed decision |
| --- | --- |
| Public brand | ARTH.Pravah — An Arthasya Venture |
| Launch audience | Individual buyers in India |
| Language | English first; content structure can accommodate reviewed translations later |
| Sales journey | Enquiry, quote and test ride; no online payments |
| Product accuracy | Approval required before publication; reference matches remain unconfirmed |
| Management | Secure admin dashboard |
| Roles | Owner and assigned staff |
| Customer access | Guest forms; no account or OTP requirement |
| Test rides | Customer request followed by staff confirmation |
| Owner support | Information plus service/support requests |
| Notifications | Dashboard records plus email and automated WhatsApp for staff and consented customers |
| Visual style | Cinematic and informative, using the supplied palette and model assets |
| Buying tools | Comparison and running costs; no EMI tool |
| Location model | One verified showroom initially, expandable later |
| Price presentation | Approved starting price with basis/inclusions, followed by a quote request |
| Service offering | Vehicle sales and service; charging education; charging/swapping facilities require separate verification |
| Business inputs | Address, contacts, hours, domain, approved facts and prices to be supplied later |
| Current work | Create only this PRD.md file; no website implementation or deployment |
