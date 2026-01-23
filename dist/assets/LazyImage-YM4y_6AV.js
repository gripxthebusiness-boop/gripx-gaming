import{c as v,r as e,j as s}from"./index-HZigOWmi.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],p=v("chevron-right",h);function w({src:c,alt:o,className:u="",placeholderSrc:r}){const[a,l]=e.useState(!1),[f,d]=e.useState(!1),t=e.useRef(null);return e.useEffect(()=>{if(typeof window>"u")return;const n=new IntersectionObserver((m,g)=>{m.forEach(i=>{i.isIntersecting&&(d(!0),g.unobserve(i.target))})},{rootMargin:"50px"});return t.current&&n.observe(t.current),()=>n.disconnect()},[]),s.jsxs("div",{ref:t,className:`relative overflow-hidden ${u}`,children:[!a&&(r?s.jsx("img",{src:r,alt:o,className:"absolute inset-0 w-full h-full object-cover filter blur-lg scale-105 animate-fade"}):s.jsx("div",{className:"absolute inset-0 bg-gray-800 animate-pulse"})),f&&s.jsx("img",{src:c,alt:o,className:`w-full h-full object-cover transition-opacity duration-700 ${a?"opacity-100":"opacity-0"}`,onLoad:()=>l(!0),loading:"lazy"})]})}export{p as C,w as L};
