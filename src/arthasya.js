// Shared server-rendered content for the Arthasya parent homepage and business pages.
export const parentAssets = '/assets/arthasya';
export const arrow = '<svg class="arth-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg>';
export const backArrow = '<svg class="arth-arrow arth-arrow-back" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 12H5M11 5l-7 7 7 7"/></svg>';

const pendingDetail = 'Detail page link pending owner confirmation.';

export const businesses = [
  {
    id:'export', name:'Export', heroName:'ARTHASYA EXPORT', label:'Red chillies & turmeric',
    title:'Trade that travels.', description:'Red chillies and turmeric, prepared for the next destination.',
    action:'Explore exports', photo:'export', alt:'Turmeric and export ingredients prepared in a warm studio setting',
    accent:'#e8752b', href:'/arth.export',
    detail:'Arthasya export enquiries for red chillies and turmeric will be available when verified business details are confirmed.',
    page:{
      kicker:'ARTHASYA EXPORT', title:'Red chillies and turmeric with a sense of place.',
      description:'Arthasya Export brings red chillies and turmeric into one clear, purposeful business.', photo:'export',
      offerings:[
        {title:'Red chillies',copy:'A focused export vertical for red chillies.',detail:pendingDetail},
        {title:'Turmeric',copy:'Turmeric as a distinct part of the Arthasya export story.',detail:pendingDetail}
      ],
      strengths:[
        {title:'Trade that travels.',copy:'A business shaped around clear products, careful presentation and the next destination.'},
        {title:'Value with purpose.',copy:'A measured starting point for future export partnerships.'}
      ]
    },
    availability:{label:'Coming soon',title:'Export details are on their way.',copy:'Verified business details and destination pages for red chillies and turmeric are being prepared.'}
  },
  {
    id:'pravah', name:'arth.pravah', heroName:'ARTHASYA PRAVAH', label:'Electric mobility',
    title:'Electric, every day.', description:'A calmer, cleaner way to move through the city.',
    action:'Explore EV bikes', photo:'pravah', alt:'Teal electric scooter in a sunlit architectural courtyard',
    accent:'#42c6c2', href:'/arth.pravah'
  },
  {
    id:'urja', name:'arth.urja', heroName:'ARTHASYA URJA', label:'Charging stations',
    title:'Charge the next move.', description:'Charging infrastructure designed around everyday movement.',
    action:'Explore charging', photo:'urja', alt:'Green electric scooter connected to a clearly visible green charging point',
    accent:'#4ddf8c', href:'/arth.urja',
    detail:'arth.urja charging locations and access details will be available when verified business details are confirmed.',
    page:{
      kicker:'ARTHASYA URJA', title:'Charge the next move.',
      description:'arth.urja is Arthasya’s charging-station business, built around visible charging points for electric mobility.', photo:'urja',
      offerings:[
        {title:'Charging points',copy:'Dedicated charging infrastructure shown clearly and accessibly.'},
        {title:'Connected movement',copy:'A charging experience designed around the daily rhythm of electric bikes.'}
      ],
      strengths:[
        {title:'Green by direction.',copy:'A green visual and service identity for the charging layer of mobility.'},
        {title:'Infrastructure first.',copy:'Charging hardware remains central to the experience, not hidden in the background.'}
      ]
    },
    availability:{label:'Coming soon',title:'Charging details are on their way.',copy:'Verified charging locations, access details and service information are being prepared.'}
  },
  {
    id:'gati', name:'arth.gati', heroName:'ARTHASYA GATI', label:'Fleet services',
    title:'Fleet built to move.', description:'Affordable electric-bike fleets with cargo-ready service for moving work forward.',
    action:'Explore fleet services', photo:'gati', alt:'Coordinated yellow electric bikes with yellow cargo boxes outside a modern depot',
    accent:'#f2c14e', href:'/arth.gati',
    detail:'arth.gati fleet configurations and service coverage will be available when verified business details are confirmed.',
    page:{
      kicker:'ARTHASYA GATI', title:'Fleet built to move.',
      description:'arth.gati brings affordable electric bikes and cargo-ready fleet service into one focused business.', photo:'gati',
      offerings:[
        {title:'Affordable electric-bike fleets',copy:'Electric bikes for coordinated fleet movement and practical work.'},
        {title:'Cargo-ready service',copy:'Fleet imagery and service language built around cargo boxes and moving work forward.'}
      ],
      strengths:[
        {title:'Built to move.',copy:'A practical fleet direction with electric bikes at its centre.'},
        {title:'Clear operating focus.',copy:'A dedicated business for fleet service conversations when verified details are ready.'}
      ]
    },
    availability:{label:'Coming soon',title:'Fleet details are on their way.',copy:'Verified fleet configurations, pricing and service coverage are being prepared.'}
  }
];

export const slides = businesses;

export const directionCards = [
  {id:'presence',label:'Our presence',title:'A footprint with purpose.',copy:'Our presence story and locations will be published after the group’s verified footprint is confirmed.'},
  {id:'vision',label:'Vision',title:'Move value forward.',copy:'Move value forward through purposeful businesses.',href:'/about#vision',action:'Read our vision'},
  {id:'mission',label:'Mission',title:'Build focused ventures.',copy:'Build focused ventures across exports, mobility, charging and fleet services.'},
  {id:'values',label:'Core values',title:'Clarity, responsibility, usefulness.',copy:'Respect the people each business serves, with clarity and responsibility at the centre.'}
];

const logo = (className='') => `<img class="arth-logo ${className}" src="${parentAssets}/logo-transparent.png" alt="Arthasya — Value with purpose" width="480" height="510">`;
const businessLink = (b, content, classes='') => b.href ? `<a class="${classes}" href="${b.href}">${content}</a>` : `<button class="${classes}" type="button" data-business="${b.id}" aria-haspopup="dialog">${content}</button>`;
const directionCard = card => {
  const attributes=card.id==='presence'?' class="arth-direction-card is-pending" id="presence"':' class="arth-direction-card"';
  return `<article${attributes}><p class="arth-eyebrow">${card.label}</p><h3>${card.title}</h3><p>${card.copy}</p>${card.href?`<a class="arth-text-link" href="${card.href}">${card.action} ${arrow}</a>`:''}</article>`;
};

export function parentHeader({inner=false,active=''}={}){
  const businessesHref=inner?'/#businesses':'#businesses';
  const navLink=(href,label,key=href)=>`<a href="${href}"${active===key?' class="is-active" aria-current="page"':''}>${label}</a>`;
  const homeLink=inner?`<a class="arth-home-link" href="/" aria-label="Arthasya home"><span class="arth-home-link-icon">${backArrow}</span><span>Arthasya home</span></a>`:'';
  return `<a class="arth-skip" href="#main">Skip to content</a><header class="arth-header"><div class="arth-header-leading"><a class="arth-brand" href="/" aria-label="Arthasya home">${logo()}</a>${homeLink}</div><nav class="arth-nav" aria-label="Main navigation">${navLink(businessesHref,'Businesses','businesses')}${navLink('/about','About')}${navLink('/contact','Contact')}<a class="arth-outline" href="/contact">Connect</a></nav><button class="arth-menu-toggle" type="button" aria-expanded="false" aria-controls="arth-mobile-nav" aria-label="Open navigation"><span></span><span></span></button><nav id="arth-mobile-nav" class="arth-mobile-nav" aria-label="Mobile navigation" hidden>${homeLink}${navLink(businessesHref,'Businesses','businesses')}${navLink('/about','About')}${navLink('/contact','Contact')}</nav></header>`;
}

const slideMarkup = (slide, index) => `<article class="arth-slide${index===0?' is-active':''}" data-slide="${slide.id}" aria-hidden="${index===0?'false':'true'}"><img class="arth-slide-image" src="${parentAssets}/slide-${slide.photo}.png" alt="${slide.alt}"><div class="arth-slide-shade"></div><div class="arth-slide-copy"><p class="arth-eyebrow">${slide.heroName}</p><h1>${slide.title}</h1><p>${slide.description}</p>${businessLink(slide, `${slide.action} ${arrow}`, 'arth-button arth-slide-link')}</div></article>`;
const slideTab = (slide, index) => `<button type="button" class="arth-slide-tab${index===0?' is-active':''}" data-slide-select="${slide.id}" aria-label="Show ${slide.heroName}" aria-current="${index===0?'true':'false'}"><span>${String(index+1).padStart(2,'0')}</span>${slide.heroName}</button>`;

export function parentHome(){
  return `<section class="arth-slider" data-slider data-theme="export" tabindex="0" aria-roledescription="carousel" aria-label="Arthasya businesses"><div class="arth-slides">${slides.map(slideMarkup).join('')}</div><div class="arth-slider-chrome"><div class="arth-slider-controls"><button class="arth-slider-arrow" type="button" data-slider-prev aria-label="Previous slide"><span aria-hidden="true">←</span></button><button class="arth-slider-arrow" type="button" data-slider-next aria-label="Next slide"><span aria-hidden="true">→</span></button><button class="arth-slider-pause" type="button" data-slider-pause aria-pressed="false"><span class="arth-pause-icon" aria-hidden="true">Ⅱ</span><span data-pause-label>Pause</span></button><span class="arth-slider-count" aria-live="polite"><strong data-slide-current>01</strong><span>/ 04</span></span></div><div class="arth-slider-tabs" role="tablist" aria-label="Choose a business slide">${slides.map(slideTab).join('')}</div><div class="arth-progress" aria-hidden="true"><span data-slide-progress></span></div></div></section>
<section class="arth-intro arth-container" aria-labelledby="arth-intro-title"><div><p class="arth-eyebrow">ARTHASYA / VALUE WITH PURPOSE</p><h2 id="arth-intro-title">Arthasya brings together exports, electric mobility, charging and fleet services.</h2></div><div class="arth-intro-actions"><a class="arth-button" href="#businesses">Explore Our Businesses ${arrow}</a><a class="arth-text-link" href="/about#vision">Our Vision ${arrow}</a></div></section>
<section class="arth-direction arth-container" aria-labelledby="arth-direction-title"><div class="arth-direction-heading"><div><p class="arth-eyebrow">ARTHASYA / DIRECTION</p><h2 id="arth-direction-title">One group. Four focused directions.</h2></div><p>Presence, purpose and practical businesses moving in the same direction.</p></div><div class="arth-direction-grid">${directionCards.map(directionCard).join('')}</div></section>
<section class="arth-businesses arth-container" id="businesses" aria-labelledby="businesses-title"><div class="arth-section-heading"><p class="arth-eyebrow">ARTHASYA / BUSINESSES</p><h2 id="businesses-title">Four ways forward.</h2><p>Distinct businesses, one shared direction: value with purpose.</p></div><div class="arth-business-list">${businesses.map((b,i)=>`<article class="arth-business-row" id="business-${b.id}" data-business-row data-theme="${b.id}"><div class="arth-business-index">0${i+1}</div><div class="arth-business-photo"><img src="${parentAssets}/slide-${b.photo}.png" alt="${b.alt}" loading="lazy"></div><div class="arth-business-copy"><p class="arth-eyebrow">${b.label}</p><h3>${b.name}</h3><p>${b.description}</p>${businessLink(b, `${b.action} ${arrow}`, 'arth-text-link')}</div></article>`).join('')}</div></section>
<section class="arth-movement" id="contact"><div><p class="arth-eyebrow">ARTHASYA</p><h2>Built around movement.</h2></div><a class="arth-button" href="/contact">Start a conversation ${arrow}</a></section>`;
}

export function parentFooter(){return `<footer class="arth-footer"><div class="arth-footer-brand"><a href="/" aria-label="Arthasya home">${logo()}</a><p>Value with purpose.</p><p class="arth-footer-intro">Exports · Energy · Mobility</p></div><div class="arth-footer-group"><p class="arth-footer-heading">Businesses</p><nav aria-label="Business links">${businesses.map(b=>businessLink(b,b.name,'arth-footer-link')).join('')}</nav></div><div class="arth-footer-group"><p class="arth-footer-heading">Company</p><nav aria-label="Company links"><a class="arth-footer-link" href="/about">About Arthasya</a><a class="arth-footer-link" href="/contact">Contact</a><a class="arth-footer-link" href="/privacy">Privacy Policy</a><a class="arth-footer-link" href="/terms">Terms &amp; Conditions</a></nav></div><div class="arth-footer-bottom"><span>© Arthasya</span><span>Value with purpose.</span></div></footer>`;}
