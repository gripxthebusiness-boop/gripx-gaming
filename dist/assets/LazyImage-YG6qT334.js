import{c as v,j as e}from"./index-g0QaOA0e.js";import{b as t}from"./react-router-CN85jjlX.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],w=v("chevron-right",b);function x({src:c,alt:o,className:u="",placeholderSrc:r}){const[a,l]=t.useState(!1),[f,d]=t.useState(!1),s=t.useRef(null);return t.useEffect(()=>{if(typeof window=="undefined")return;const n=new IntersectionObserver((m,g)=>{m.forEach(i=>{i.isIntersecting&&(d(!0),g.unobserve(i.target))})},{rootMargin:"50px"});return s.current&&n.observe(s.current),()=>n.disconnect()},[]),e.jsxs("div",{ref:s,className:`relative overflow-hidden ${u}`,children:[!a&&(r?e.jsx("img",{src:r,alt:o,className:"absolute inset-0 w-full h-full object-cover filter blur-lg scale-105 animate-fade"}):e.jsx("div",{className:"absolute inset-0 bg-gray-800 animate-pulse"})),f&&e.jsx("img",{src:c,alt:o,className:`w-full h-full object-cover transition-opacity duration-700 ${a?"opacity-100":"opacity-0"}`,onLoad:()=>l(!0),loading:"lazy"})]})}export{w as C,x as L};
