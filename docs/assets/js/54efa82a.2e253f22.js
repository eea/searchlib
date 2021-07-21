(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[736],{3905:function(e,t,a){"use strict";a.d(t,{Zo:function(){return u},kt:function(){return d}});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},i=Object.keys(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)a=i[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var s=r.createContext({}),c=function(e){var t=r.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},u=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),h=c(a),d=n,m=h["".concat(s,".").concat(d)]||h[d]||p[d]||i;return a?r.createElement(m,o(o({ref:t},u),{},{components:a})):r.createElement(m,o({ref:t},u))}));function d(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=a.length,o=new Array(i);o[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,o[1]=l;for(var c=2;c<i;c++)o[c]=a[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,a)}h.displayName="MDXCreateElement"},4489:function(e,t,a){"use strict";a.r(t),a.d(t,{frontMatter:function(){return o},metadata:function(){return l},toc:function(){return s},default:function(){return u}});var r=a(2122),n=a(9756),i=(a(7294),a(3905)),o={},l={unversionedId:"searchlib-ui/architecture",id:"searchlib-ui/architecture",isDocsHomePage:!1,title:"Architecture",description:"ElasticSearch-powered React components and independent service.",source:"@site/docs/searchlib-ui/1-architecture.md",sourceDirName:"searchlib-ui",slug:"/searchlib-ui/architecture",permalink:"/searchlib/docs/searchlib-ui/architecture",editUrl:"https://github.com/eea/searchlib/edit/develop/website/docs/searchlib-ui/1-architecture.md",version:"current",sidebarPosition:1,frontMatter:{},sidebar:"sidebar",previous:{title:"Intro",permalink:"/searchlib/docs/searchlib-ui/intro"},next:{title:"Language features",permalink:"/searchlib/docs/searchlib-ui/language"}},s=[{value:"Context",id:"context",children:[{value:"Requirements",id:"requirements",children:[]},{value:"Solution",id:"solution",children:[]},{value:"Technology stack",id:"technology-stack",children:[]},{value:"Monorepo setup",id:"monorepo-setup",children:[]},{value:"Language infrastructure",id:"language-infrastructure",children:[]}]}],c={toc:s};function u(e){var t=e.components,a=(0,n.Z)(e,["components"]);return(0,i.kt)("wrapper",(0,r.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"ElasticSearch-powered React components and independent service."),(0,i.kt)("h2",{id:"context"},"Context"),(0,i.kt)("p",null,"EEA needs a modern, flexible and generic search solution, one that is\nplatform-independent and that can scale from micro-small listings to\nfull-featured custom search engines."),(0,i.kt)("p",null,"We already have eea.searchserver.js which provides a solid and viable solution\nfor common operations such as indexing from various sources, index updating and\nprovides a public-facing Search UI. The problem is one of outdated technology,\ndifficulties in expanding it and the need for domain-specific knowledge."),(0,i.kt)("h3",{id:"requirements"},"Requirements"),(0,i.kt)("p",null,"The Search Server UI should have the following characteristics:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"It should be a reusable component. It needs to be easily deployable as a\nseparate app or integrated in other websites (Plone 4/5 classic, Volto)."),(0,i.kt)("li",{parentName:"ul"},"It should be easy to extend and contribute from many developer teams."),(0,i.kt)("li",{parentName:"ul"},'In its most basic instance, it needs to function based on declarative\nconfiguration. With just configuration it should be possible to create\ncomplex search-level experiences (various facets, configurable listing views,\nautocomplete experience, etc). The idea is to make all the "special cases"\npart of the default library, so that it will grow its capabilities.'),(0,i.kt)("li",{parentName:"ul"},"The configuration can be passed as a JSON."),(0,i.kt)("li",{parentName:"ul"},"It should allow multiple instances per website."),(0,i.kt)("li",{parentName:"ul"},"It should function in conjunction with the indexing done in the EEA Search\nServer Harvester.")),(0,i.kt)("h3",{id:"solution"},"Solution"),(0,i.kt)("p",null,"The next generate EEA Semantic Search UI will be based on React, as it will\nprovide synergy with the rest of the active web development teams. React is the\nmost popular frontend framework and it has the benefit of having a large\nsupport from many communities and vendors. The ElasticSearch corporation\nalready provides a library to integrate with their ElasticSearch servers and\nthat library will be used as the basis for our SearchUI solution."),(0,i.kt)("p",null,'ElasticSearch company\'s official ElasticSearch UI components are considered the\nmost future-proof base for our final product. The react-search-ui library\nprovides a set of "headless" virtual components with concrete implementation in\nreact-search-ui-views. It is a solid base, with code that is easy to understand\nand we will start our implementation from there.'),(0,i.kt)("p",null,"We will also draw inspiration and adopt or include implementations of search\ncomponents from other ES libraries:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/searchkit/searchkit"},"https://github.com/searchkit/searchkit")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/appbaseio/reactivesearch"},"https://github.com/appbaseio/reactivesearch")),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/appbaseio/searchbox"},"https://github.com/appbaseio/searchbox"))),(0,i.kt)("h3",{id:"technology-stack"},"Technology stack"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"React"),(0,i.kt)("li",{parentName:"ul"},"react-search-ui - ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/elastic/search-ui/"},"https://github.com/elastic/search-ui/")),(0,i.kt)("li",{parentName:"ul"},"react-search-ui-views"),(0,i.kt)("li",{parentName:"ul"},"EEA SemanticSearch monorepo")),(0,i.kt)("h3",{id:"monorepo-setup"},"Monorepo setup"),(0,i.kt)("p",null,"To facilitate the development of a flexible package architecture, we will use\na monorepo setup. This means that the components and implementation shells will\nbe developed and run side by side, ensuring ease of development and testing."),(0,i.kt)("p",null,"The following packages will be part of the initial setup:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"@eeacms/searchlib (main library, React)"),(0,i.kt)("li",{parentName:"ul"},"@eeacms/searchlib-hierarchical-multifacet-x (various addons)"),(0,i.kt)("li",{parentName:"ul"},"@eeacms/search-shell-react (Full-features standalone React app. Should be able to do SSR)"),(0,i.kt)("li",{parentName:"ul"},"@eeacms/search-shell-classic (Shell around the main library to use in plain Plone)"),(0,i.kt)("li",{parentName:"ul"},"@eeacms/search-shell-component (web component variant)")),(0,i.kt)("p",null,"Later, we may develop new package, such as:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"@eeacms/searchlib-editor - TTW builder of Search Engine configuration")),(0,i.kt)("p",null,"The monorepo setup will be based on Lerna and Yarn workspaces (NX might be possible, but it's too TypeScript-centric)."),(0,i.kt)("p",null,"We will integrate Storybook and use it as testing infrastructure for Cypress E2E testing."),(0,i.kt)("p",null,"For documentation we will use Docusaurus ",(0,i.kt)("a",{parentName:"p",href:"https://docusaurus.io/"},"https://docusaurus.io/")),(0,i.kt)("h3",{id:"language-infrastructure"},"Language infrastructure"),(0,i.kt)("p",null,"Distribution and package setup:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"use React/babel/webpack setup"),(0,i.kt)("li",{parentName:"ul"},"all packages can be distributed as compiled libraries"),(0,i.kt)("li",{parentName:"ul"},"To use the shells, include two distributed libs: main library + shell dist,\nthen use from plan JS"),(0,i.kt)("li",{parentName:"ul"},"main library can be used directly from React")))}u.isMDXComponent=!0}}]);