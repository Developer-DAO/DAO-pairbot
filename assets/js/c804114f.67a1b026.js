"use strict";(self.webpackChunkpairbot_wiki=self.webpackChunkpairbot_wiki||[]).push([[338],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var r=t(7294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function i(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?i(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):i(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function o(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)t=i[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=r.createContext({}),u=function(e){var n=r.useContext(s),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=u(e.components);return r.createElement(s.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),d=u(t),m=a,v=d["".concat(s,".").concat(m)]||d[m]||p[m]||i;return t?r.createElement(v,l(l({ref:n},c),{},{components:t})):r.createElement(v,l({ref:n},c))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var i=t.length,l=new Array(i);l[0]=d;var o={};for(var s in n)hasOwnProperty.call(n,s)&&(o[s]=n[s]);o.originalType=e,o.mdxType="string"==typeof e?e:a,l[1]=o;for(var u=2;u<i;u++)l[u]=t[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8215:function(e,n,t){var r=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,a=e.className;return r.createElement("div",{role:"tabpanel",hidden:t,className:a},n)}},6396:function(e,n,t){t.d(n,{Z:function(){return d}});var r=t(7462),a=t(7294),i=t(2389),l=t(9443);var o=function(){var e=(0,a.useContext)(l.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},s=t(3616),u=t(6010),c="tabItem_vU9c";function p(e){var n,t,i,l=e.lazy,p=e.block,d=e.defaultValue,m=e.values,v=e.groupId,f=e.className,b=a.Children.map(e.children,(function(e){if((0,a.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),h=null!=m?m:b.map((function(e){var n=e.props;return{value:n.value,label:n.label,attributes:n.attributes}})),k=(0,s.lx)(h,(function(e,n){return e.value===n.value}));if(k.length>0)throw new Error('Docusaurus error: Duplicate values "'+k.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var y=null===d?d:null!=(n=null!=d?d:null==(t=b.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(i=b[0])?void 0:i.props.value;if(null!==y&&!h.some((function(e){return e.value===y})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+y+'" but none of its children has the corresponding value. Available values are: '+h.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var g=o(),N=g.tabGroupChoices,w=g.setTabGroupChoices,C=(0,a.useState)(y),O=C[0],j=C[1],x=[],P=(0,s.o5)().blockElementScrollPositionUntilNextRender;if(null!=v){var E=N[v];null!=E&&E!==O&&h.some((function(e){return e.value===E}))&&j(E)}var T=function(e){var n=e.currentTarget,t=x.indexOf(n),r=h[t].value;r!==O&&(P(n),j(r),null!=v&&w(v,r))},D=function(e){var n,t=null;switch(e.key){case"ArrowRight":var r=x.indexOf(e.currentTarget)+1;t=x[r]||x[0];break;case"ArrowLeft":var a=x.indexOf(e.currentTarget)-1;t=x[a]||x[x.length-1]}null==(n=t)||n.focus()};return a.createElement("div",{className:"tabs-container"},a.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,u.Z)("tabs",{"tabs--block":p},f)},h.map((function(e){var n=e.value,t=e.label,i=e.attributes;return a.createElement("li",(0,r.Z)({role:"tab",tabIndex:O===n?0:-1,"aria-selected":O===n,key:n,ref:function(e){return x.push(e)},onKeyDown:D,onFocus:T,onClick:T},i,{className:(0,u.Z)("tabs__item",c,null==i?void 0:i.className,{"tabs__item--active":O===n})}),null!=t?t:n)}))),l?(0,a.cloneElement)(b.filter((function(e){return e.props.value===O}))[0],{className:"margin-vert--md"}):a.createElement("div",{className:"margin-vert--md"},b.map((function(e,n){return(0,a.cloneElement)(e,{key:n,hidden:e.props.value!==O})}))))}function d(e){var n=(0,i.Z)();return a.createElement(p,(0,r.Z)({key:String(n)},e))}},6653:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return u},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return v}});var r=t(7462),a=t(3366),i=(t(7294),t(3905)),l=t(6396),o=t(8215),s=["components"],u={title:"Invite",sidebar_position:6},c="Installation",p={unversionedId:"Commands/invite",id:"Commands/invite",title:"Invite",description:"Requirements",source:"@site/docs/Commands/invite.md",sourceDirName:"Commands",slug:"/Commands/invite",permalink:"/DAO-pairbot/docs/Commands/invite",editUrl:"https://github.com/developer-dao/DAO-pairbot/docs/Commands/invite.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"Invite",sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Developers",permalink:"/DAO-pairbot/docs/Commands/developers"},next:{title:"Invites",permalink:"/DAO-pairbot/docs/Commands/invites"}},d=[{value:"Requirements",id:"requirements",children:[],level:2},{value:"Project structure",id:"project-structure",children:[{value:"Project structure rundown",id:"project-structure-rundown",children:[],level:3}],level:2},{value:"Install",id:"install",children:[],level:2},{value:"Problems?",id:"problems",children:[],level:2}],m={toc:d};function v(e){var n=e.components,t=(0,a.Z)(e,s);return(0,i.kt)("wrapper",(0,r.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"installation"},"Installation"),(0,i.kt)("h2",{id:"requirements"},"Requirements"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://nodejs.org/en/download/"},"Node.js")," version >= 16 or above (which can be checked by running ",(0,i.kt)("inlineCode",{parentName:"li"},"node -v"),"). You can use ",(0,i.kt)("a",{parentName:"li",href:"https://github.com/nvm-sh/nvm"},"nvm")," for managing multiple Node versions on a single machine installed.",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"When installing Node.js, you are recommended to check all checkboxes related to dependencies."))),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://yarnpkg.com/en/"},"Yarn")," version >= 1.5 (which can be checked by running ",(0,i.kt)("inlineCode",{parentName:"li"},"yarn --version"),"). Yarn is a performant package manager for JavaScript and replaces the ",(0,i.kt)("inlineCode",{parentName:"li"},"npm")," client. It is not strictly necessary but highly encouraged."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://discord.com/developers/applications"},"Discord bot")," account."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://supabase.com/"},"Supabase")," account.")),(0,i.kt)("h2",{id:"project-structure"},"Project structure"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"DAO-PAIRBOT\n\u251c\u2500\u2500 commands\n\u2502   \u251c\u2500\u2500 add.ts\n\u2502   \u251c\u2500\u2500 available.ts\n\u2502   \u251c\u2500\u2500 developers.ts\n\u2502   \u251c\u2500\u2500 edit.ts\n\u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u251c\u2500\u2500 invite.ts\n\u2502   \u251c\u2500\u2500 invites.ts\n\u2502   \u251c\u2500\u2500 remove.ts\n\u2502   \u251c\u2500\u2500 unavailable.ts\n\u2502   \u2514\u2500\u2500 view.ts\n\u251c\u2500\u2500 components\n\u2502   \u251c\u2500\u2500 developerEmbed.ts\n\u2502   \u251c\u2500\u2500 developersPaginator.ts\n\u2502   \u251c\u2500\u2500 inviteDeveloper.ts\n\u2502   \u251c\u2500\u2500 invitesPaginator.ts\n\u2502   \u2514\u2500\u2500 skills.ts\n\u251c\u2500\u2500 database\n\u2502   \u251c\u2500\u2500 database.ts\n\u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u2514\u2500\u2500 schema.sql\n\u251c\u2500\u2500 events\n\u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u251c\u2500\u2500 interactionCreate.ts\n\u2502   \u2514\u2500\u2500 ready.ts\n\u251c\u2500\u2500 utils\n\u2502   \u251c\u2500\u2500 classes.ts\n\u2502   \u251c\u2500\u2500 githubHandle.ts\n\u2502   \u251c\u2500\u2500 index.ts\n\u2502   \u251c\u2500\u2500 scheduledJobs.ts\n\u2502   \u2514\u2500\u2500 twitterHandle.ts\n\u251c\u2500\u2500 wiki\n\u251c\u2500\u2500 .all-contributorsrc\n\u251c\u2500\u2500 .env.example\n\u251c\u2500\u2500 .gitignore\n\u251c\u2500\u2500 index.ts\n\u251c\u2500\u2500 package.json\n\u251c\u2500\u2500 Procfile\n\u251c\u2500\u2500 README.md\n\u251c\u2500\u2500 tsconfig.json\n\u2514\u2500\u2500 yarn.lock\n")),(0,i.kt)("h3",{id:"project-structure-rundown"},"Project structure rundown"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/commands/")," - Contains the commands."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/components/")," - Contains the custom made components."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/database/")," - Contains the necessary database files and schema to setup Supabase database."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/events/")," - Contains the events."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/utils/")," - Contain helper files."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/.env.example")," - Example of how the .env files should look like and all variables needed to run Pairbot."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/index.ts")," - Is the entry file to the Pairbot."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/package.json")," - Contains all the node modules required to run the pairbot."),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"/Profcfile")," - Contains the command that Heroku needs to run the bot.")),(0,i.kt)("h2",{id:"install"},"Install"),(0,i.kt)("p",null,"Pairbot requires a few packges to work. To install these packages:"),(0,i.kt)(l.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,i.kt)(o.Z,{value:"npm",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"npm install\n"))),(0,i.kt)(o.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-bash"},"yarn install\n")))),(0,i.kt)("h2",{id:"problems"},"Problems?"),(0,i.kt)("p",null,"Ask for help on our ",(0,i.kt)("a",{parentName:"p",href:"https://github.com/developer-dao/DAO-pairbot"},"GitHub repository")))}v.isMDXComponent=!0}}]);