(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[771],{3905:function(e,t,r){"use strict";r.d(t,{Zo:function(){return u},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),d=s(r),f=a,m=d["".concat(c,".").concat(f)]||d[f]||p[f]||i;return r?n.createElement(m,o(o({ref:t},u),{},{components:r})):n.createElement(m,o({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var s=2;s<i;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},10:function(e,t,r){"use strict";r.r(t),r.d(t,{frontMatter:function(){return o},metadata:function(){return l},toc:function(){return c},default:function(){return u}});var n=r(2122),a=r(9756),i=(r(7294),r(3905)),o={},l={unversionedId:"searchlib-ui/developing",id:"searchlib-ui/developing",isDocsHomePage:!1,title:"Developing Searchlib-UI",description:"Searchlib is developed as a React library.",source:"@site/docs/searchlib-ui/4-developing.md",sourceDirName:"searchlib-ui",slug:"/searchlib-ui/developing",permalink:"/searchlib/docs/searchlib-ui/developing",editUrl:"https://github.com/eea/searchlib/edit/main/website/docs/searchlib-ui/4-developing.md",version:"current",sidebarPosition:4,frontMatter:{},sidebar:"sidebar",previous:{title:"Configuration",permalink:"/searchlib/docs/searchlib-ui/configuration"},next:{title:"Running as standalone app",permalink:"/searchlib/docs/searchlib-ui/standalone"}},c=[{value:"Catalogue of measures",id:"catalogue-of-measures",children:[]}],s={toc:c};function u(e){var t=e.components,r=(0,a.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Searchlib is developed as a React library."),(0,i.kt)("p",null,'To be able to "demo" and develop it, we have the ',(0,i.kt)("inlineCode",{parentName:"p"},"packages/demo")," package."),(0,i.kt)("p",null,"To run it, run:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install -g pnpm\npnpm install\npnpm build\npnpm start\n")),(0,i.kt)("p",null,"To facilitate development we have some sample datasets that are integrated with\nElasticSearch."),(0,i.kt)("h3",{id:"catalogue-of-measures"},"Catalogue of measures"),(0,i.kt)("p",null,"See the ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/eea/searchlib/tree/main/sampledata/catalogue-of-measures"},"catalogue of measures")," folder.\nIt contains docker-compose services with ElasticSearch, indexer and CSV files."))}u.isMDXComponent=!0}}]);