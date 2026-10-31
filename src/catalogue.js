// Visually transcribed from allmodels_catalogue.pdf. Owner-confirmed identity mapping.
// Keep source conflicts here; do not silently turn brochure figures into guarantees.
export const catalogue = {
  aero: {reference:'B2+',page:2,tyres:'10 inch',payload:150,brakes:'Front disc brake',headlineRange:'up to 100 km*',lithiumRange:'>100 km*'},
  apex: {reference:'B1',page:3,tyres:'10 inch',payload:150,brakes:'Front disc brake',headlineRange:'up to 100 km*',lithiumRange:'>100 km*'},
  nova: {reference:'B2',page:4,tyres:'10 inch',payload:175,brakes:'Front disc brake',headlineRange:'up to 100 km*',lithiumRange:'>100 km*'},
  teja: {reference:'B4',page:5,tyres:'10/12 inch',payload:200,brakes:'Front disc brake',headlineRange:'up to 100 km*',lithiumRange:'>100 km*'},
  vayu: {reference:'B5',page:7,tyres:'12 inch',payload:220,brakes:'Front / rear disc brakes',headlineRange:'up to 120 km*',lithiumRange:'>120 km*'},
  vega: {reference:'B5 Pro',page:9,tyres:'12 inch',payload:250,brakes:'Front / rear disc brakes',headlineRange:'up to 250 km*',lithiumRange:'>250 km*'}
};
export const colours = [{name:'Black',hex:'#171b1e'},{name:'Grey',hex:'#b5b8b9'},{name:'White',hex:'#fff'},{name:'Red',hex:'#bf2635'}];
export const batteries = {
  lithium:{name:'Lithium-ion',charging:'3–4 hours*',sourceWarranty:'3 years**'},
  lead:{name:'Lead-acid',charging:'4–5 hours*',sourceWarranty:'1 year**'}
};
for(const value of Object.values(catalogue)) Object.assign(value,{
  dimensions:'1870 × 800 × 1150 mm',wheelbase:1330,seatLength:710,clearance:180,
  colours, batteries, leadRange:'>80 km*',
  warrantyFooter:'Battery 1 Years Warranty',
  qualification:'Catalogue figures; configuration, test conditions and warranty terms require confirmation.',
  rangeStatus:'Requires confirmation', warrantyStatus:'Requires confirmation',
  equipment:['LED display','LED headlamp with DRL','Anti-theft alarm','USB charging','Reverse mode','Telescopic suspension','Alloy rims','Remote centre lock / start button']
});
export function features(model){return [
  ['LED headlamp with DRL','The catalogue lists an LED headlamp with daytime running light. Confirm the supplied lighting configuration when enquiring.'],
  [model.specs.brakes,'Disc braking is listed in the catalogue. Ask about the complete braking configuration for your selected vehicle.'],
  ['USB charging','A USB charging connection is listed for small devices. Port rating and compatibility require confirmation.'],
  ['Reverse mode','The catalogue lists a reverse mode. Ask the team to demonstrate its operation before use.'],
  ['Anti-theft alarm','An anti-theft alarm and remote centre lock / start button are listed. Included equipment requires confirmation.']
];}
