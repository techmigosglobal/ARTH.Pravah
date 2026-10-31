import {catalogue} from './catalogue.js';
export const models = [
  {id:'aero',name:'Aero',line:'A fresh take on the everyday.',description:'City lights. Familiar streets. A different perspective. Meet Aero, the beginning of your next electric chapter.',story:'Find a new rhythm.',detail:'The route may be familiar. The way you see it doesn’t have to be. Explore Aero from the front, the side, and every detail in between.',scene:'The city, seen differently.',chapter:['A first impression','A closer perspective','Details worth a second look']},
  {id:'apex',name:'Apex',line:'A different kind of presence.',description:'An evening in the city. A silhouette that catches your eye. Get to know Apex, one detail at a time.',story:'Stay a little longer.',detail:'Some designs ask for a second look. Step closer to Apex, from its city-night introduction to its individual exterior details.',scene:'After hours. In focus.',chapter:['An evening introduction','A bolder silhouette','Up close with Apex']},
  {id:'nova',name:'Nova',line:'Make room for a new beginning.',description:'A quieter setting. A fresh point of view. Take a closer look at Nova and start imagining your electric everyday.',story:'A little space to discover.',detail:'Discover Nova at your own pace. Start with the shape, explore the details, and ask the questions that matter to your everyday.',scene:'A moment, just for you.',chapter:['A new beginning','A different angle','Look a little closer']},
  {id:'teja',name:'Teja',line:'See where the day takes you.',description:'Open-road imagery. A vivid blue introduction. Discover Teja through its own visual journey.',story:'Leave room for possibility.',detail:'A new perspective begins with a little curiosity. Follow the visual story of Teja, then explore the exterior from every supplied view.',scene:'A change of scenery.',chapter:['The first encounter','Details in focus','A wider perspective']},
  {id:'vayu',name:'Vayu',line:'A fresh perspective on purpose.',description:'From workshop scenes to open city views. Discover Vayu and the details that make up its visual story.',story:'Get to know the details.',detail:'Good questions lead to a better choice. Explore Vayu’s exterior and ask us about approved equipment, availability, and your intended use.',scene:'Purpose, in perspective.',chapter:['Meet Vayu','A closer look','The view ahead']},
  {id:'vega',name:'Vega',line:'Your city. A new perspective.',description:'City-night scenes. A distinctive silhouette. Meet Vega and explore a different expression of electric.',story:'Some things deserve a closer look.',detail:'Take in the shape. Explore the details. Discover the visual character of Vega through its gallery and city-night film.',scene:'Night falls. Vega arrives.',chapter:['A city-night introduction','Styling, in focus','The finer details']}
];
for (const model of models) model.specs = catalogue[model.id];
export const getModel = id => models.find(m=>m.id===id);
export const media = (id,view='hero') => `/assets/models/${id}/${view}.webp`;
export const clamp = (n,min=0,max=1) => Math.max(min,Math.min(max,n));
export const progressToFrame = (progress,count) => Math.round(clamp(progress)*Math.max(0,count-1));
export function containSize(width,height,sourceWidth,sourceHeight){const scale=Math.min(width/sourceWidth,height/sourceHeight);return {width:sourceWidth*scale,height:sourceHeight*scale,x:(width-sourceWidth*scale)/2,y:(height-sourceHeight*scale)/2};}
export function calculateCosts({distance,days,electricity,petrol,mileage,consumption}){
  const values=[distance,days,electricity,petrol,mileage,consumption];
  if(values.some(v=>v===''||v===null||!Number.isFinite(Number(v)))) throw new Error('Enter a number in every field.');
  const [d,n,e,p,m,c]=values.map(Number);
  if(d<0||d>1000||n<1||n>31||!Number.isInteger(n)||e<0||e>100||p<0||p>500||m<=0||m>200||c<=0||c>100) throw new Error('Check the field limits and use positive mileage and consumption.');
  const km=d*n,ev=km*c/100*e,fuel=km/m*p;return {km,ev,fuel,difference:fuel-ev,evPerKm:c/100*e,petrolPerKm:p/m};
}
export const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
