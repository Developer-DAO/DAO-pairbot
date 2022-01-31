"use strict";(self.webpackChunkpairbot_wiki=self.webpackChunkpairbot_wiki||[]).push([[103],{8665:function(e,t,a){a.d(t,{Z:function(){return b}});var n=a(3366),l=a(7294),r=a(6010),i=a(2434),o=a(9960),m="sidebar_a9qW",s="sidebarItemTitle_uKok",c="sidebarItemList_Kvuv",u="sidebarItem_CF0Q",d="sidebarItemLink_miNk",g="sidebarItemLinkActive_RRTD",v=a(5999);function p(e){var t=e.sidebar;return 0===t.items.length?null:l.createElement("nav",{className:(0,r.Z)(m,"thin-scrollbar"),"aria-label":(0,v.I)({id:"theme.blog.sidebar.navAriaLabel",message:"Blog recent posts navigation",description:"The ARIA label for recent posts in the blog sidebar"})},l.createElement("div",{className:(0,r.Z)(s,"margin-bottom--md")},t.title),l.createElement("ul",{className:c},t.items.map((function(e){return l.createElement("li",{key:e.permalink,className:u},l.createElement(o.Z,{isNavLink:!0,to:e.permalink,className:d,activeClassName:g},e.title))}))))}var h=["sidebar","toc","children"];var b=function(e){var t=e.sidebar,a=e.toc,o=e.children,m=(0,n.Z)(e,h),s=t&&t.items.length>0;return l.createElement(i.Z,m,l.createElement("div",{className:"container margin-vert--lg"},l.createElement("div",{className:"row"},s&&l.createElement("aside",{className:"col col--3"},l.createElement(p,{sidebar:t})),l.createElement("main",{className:(0,r.Z)("col",{"col--7":s,"col--9 col--offset-1":!s}),itemScope:!0,itemType:"http://schema.org/Blog"},o),a&&l.createElement("div",{className:"col col--2"},a))))}},8561:function(e,t,a){a.d(t,{Z:function(){return k}});var n=a(7294),l=a(6010),r=a(3905),i=a(5999),o=a(9960),m=a(4996),s=a(9548),c=a(8780),u=a(4689),d=a(6753),g="blogPostTitle_rzP5",v="blogPostData_Zg1s",p="blogPostDetailsFull_h6_j",h=a(62),b="image_o0gy";var E=function(e){var t=e.author,a=t.name,l=t.title,r=t.url,i=t.imageURL;return n.createElement("div",{className:"avatar margin-bottom--sm"},i&&n.createElement(o.Z,{className:"avatar__photo-link avatar__photo",href:r},n.createElement("img",{className:b,src:i,alt:a})),a&&n.createElement("div",{className:"avatar__intro",itemProp:"author",itemScope:!0,itemType:"https://schema.org/Person"},n.createElement("div",{className:"avatar__name"},n.createElement(o.Z,{href:r,itemProp:"url"},n.createElement("span",{itemProp:"name"},a))),l&&n.createElement("small",{className:"avatar__subtitle",itemProp:"description"},l)))},f="authorCol_FlmR",_="imageOnlyAuthorRow_trpF",N="imageOnlyAuthorCol_S2np";function Z(e){var t=e.authors,a=e.assets;if(0===t.length)return null;var r=t.every((function(e){return!e.name}));return n.createElement("div",{className:(0,l.Z)("margin-top--md margin-bottom--sm",r?_:"row")},t.map((function(e,t){var i;return n.createElement("div",{className:(0,l.Z)(!r&&"col col--6",r?N:f),key:t},n.createElement(E,{author:Object.assign({},e,{imageURL:null!=(i=a.authorsImageUrls[t])?i:e.imageURL})}))})))}var k=function(e){var t,a,b,E=(b=(0,s.c2)().selectMessage,function(e){var t=Math.ceil(e);return b(t,(0,i.I)({id:"theme.blog.post.readingTime.plurals",description:'Pluralized label for "{readingTime} min read". Use as much plural forms (separated by "|") as your language support (see https://www.unicode.org/cldr/cldr-aux/charts/34/supplemental/language_plural_rules.html)',message:"One min read|{readingTime} min read"},{readingTime:t}))}),f=(0,m.C)().withBaseUrl,_=e.children,N=e.frontMatter,k=e.assets,P=e.metadata,C=e.truncated,L=e.isBlogPostPage,T=void 0!==L&&L,w=P.date,y=P.formattedDate,I=P.permalink,x=P.tags,A=P.readingTime,H=P.title,M=P.editUrl,R=P.authors,U=null!=(t=k.image)?t:N.image,B=!T&&C,D=x.length>0,O=T?"h1":"h2";return n.createElement("article",{className:T?void 0:"margin-bottom--xl",itemProp:"blogPost",itemScope:!0,itemType:"http://schema.org/BlogPosting"},n.createElement("header",null,n.createElement(O,{className:g,itemProp:"headline"},T?H:n.createElement(o.Z,{itemProp:"url",to:I},H)),n.createElement("div",{className:(0,l.Z)(v,"margin-vert--md")},n.createElement("time",{dateTime:w,itemProp:"datePublished"},y),void 0!==A&&n.createElement(n.Fragment,null," \xb7 ",E(A))),n.createElement(Z,{authors:R,assets:k})),U&&n.createElement("meta",{itemProp:"image",content:f(U,{absolute:!0})}),n.createElement("div",{id:T?c.blogPostContainerID:void 0,className:"markdown",itemProp:"articleBody"},n.createElement(r.Zo,{components:u.Z},_)),(D||C)&&n.createElement("footer",{className:(0,l.Z)("row docusaurus-mt-lg",(a={},a[p]=T,a))},D&&n.createElement("div",{className:(0,l.Z)("col",{"col--9":B})},n.createElement(h.Z,{tags:x})),T&&M&&n.createElement("div",{className:"col margin-top--sm"},n.createElement(d.Z,{editUrl:M})),B&&n.createElement("div",{className:(0,l.Z)("col text--right",{"col--3":D})},n.createElement(o.Z,{to:P.permalink,"aria-label":"Read more about "+H},n.createElement("b",null,n.createElement(i.Z,{id:"theme.blog.post.readMore",description:"The label used in blog post item excerpts to link to full blog posts"},"Read More"))))))}},9360:function(e,t,a){a.r(t),a.d(t,{default:function(){return g}});var n=a(7294),l=a(1217),r=a(8665),i=a(8561),o=a(7462),m=a(5999),s=a(1750);var c=function(e){var t=e.nextItem,a=e.prevItem;return n.createElement("nav",{className:"pagination-nav docusaurus-mt-lg","aria-label":(0,m.I)({id:"theme.blog.post.paginator.navAriaLabel",message:"Blog post page navigation",description:"The ARIA label for the blog posts pagination"})},n.createElement("div",{className:"pagination-nav__item"},a&&n.createElement(s.Z,(0,o.Z)({},a,{subLabel:n.createElement(m.Z,{id:"theme.blog.post.paginator.newerPost",description:"The blog post button label to navigate to the newer/previous post"},"Newer Post")}))),n.createElement("div",{className:"pagination-nav__item pagination-nav__item--next"},t&&n.createElement(s.Z,(0,o.Z)({},t,{subLabel:n.createElement(m.Z,{id:"theme.blog.post.paginator.olderPost",description:"The blog post button label to navigate to the older/next post"},"Older Post")}))))},u=a(9548),d=a(1575);var g=function(e){var t,a=e.content,o=e.sidebar,m=a.assets,s=a.metadata,g=s.title,v=s.description,p=s.nextItem,h=s.prevItem,b=s.date,E=s.tags,f=s.authors,_=s.frontMatter,N=_.hide_table_of_contents,Z=_.keywords,k=_.toc_min_heading_level,P=_.toc_max_heading_level,C=null!=(t=m.image)?t:_.image;return n.createElement(r.Z,{wrapperClassName:u.kM.wrapper.blogPages,pageClassName:u.kM.page.blogPostPage,sidebar:o,toc:!N&&a.toc&&a.toc.length>0?n.createElement(d.Z,{toc:a.toc,minHeadingLevel:k,maxHeadingLevel:P}):void 0},n.createElement(l.Z,{title:g,description:v,keywords:Z,image:C},n.createElement("meta",{property:"og:type",content:"article"}),n.createElement("meta",{property:"article:published_time",content:b}),f.some((function(e){return e.url}))&&n.createElement("meta",{property:"article:author",content:f.map((function(e){return e.url})).filter(Boolean).join(",")}),E.length>0&&n.createElement("meta",{property:"article:tag",content:E.map((function(e){return e.label})).join(",")})),n.createElement(i.Z,{frontMatter:_,assets:m,metadata:s,isBlogPostPage:!0},n.createElement(a,null)),(p||h)&&n.createElement(c,{nextItem:p,prevItem:h}))}},6753:function(e,t,a){a.d(t,{Z:function(){return d}});var n=a(7294),l=a(5999),r=a(7462),i=a(3366),o=a(6010),m="iconEdit_dcUD",s=["className"];var c=function(e){var t=e.className,a=(0,i.Z)(e,s);return n.createElement("svg",(0,r.Z)({fill:"currentColor",height:"20",width:"20",viewBox:"0 0 40 40",className:(0,o.Z)(m,t),"aria-hidden":"true"},a),n.createElement("g",null,n.createElement("path",{d:"m34.5 11.7l-3 3.1-6.3-6.3 3.1-3q0.5-0.5 1.2-0.5t1.1 0.5l3.9 3.9q0.5 0.4 0.5 1.1t-0.5 1.2z m-29.5 17.1l18.4-18.5 6.3 6.3-18.4 18.4h-6.3v-6.2z"})))},u=a(9548);function d(e){var t=e.editUrl;return n.createElement("a",{href:t,target:"_blank",rel:"noreferrer noopener",className:u.kM.common.editThisPage},n.createElement(c,null),n.createElement(l.Z,{id:"theme.common.editThisPage",description:"The link label to edit the current page"},"Edit this page"))}},1750:function(e,t,a){var n=a(7294),l=a(9960);t.Z=function(e){var t=e.permalink,a=e.title,r=e.subLabel;return n.createElement(l.Z,{className:"pagination-nav__link",to:t},r&&n.createElement("div",{className:"pagination-nav__sublabel"},r),n.createElement("div",{className:"pagination-nav__label"},a))}},1575:function(e,t,a){a.d(t,{Z:function(){return c}});var n=a(7462),l=a(3366),r=a(7294),i=a(6010),o=a(5002),m="tableOfContents_cNA8",s=["className"];var c=function(e){var t=e.className,a=(0,l.Z)(e,s);return r.createElement("div",{className:(0,i.Z)(m,"thin-scrollbar",t)},r.createElement(o.Z,(0,n.Z)({},a,{linkClassName:"table-of-contents__link toc-highlight",linkActiveClassName:"table-of-contents__link--active"})))}},5002:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(7462),l=a(3366),r=a(7294),i=a(9548),o=["toc","className","linkClassName","linkActiveClassName","minHeadingLevel","maxHeadingLevel"];function m(e){var t=e.toc,a=e.className,n=e.linkClassName,l=e.isChild;return t.length?r.createElement("ul",{className:l?void 0:a},t.map((function(e){return r.createElement("li",{key:e.id},r.createElement("a",{href:"#"+e.id,className:null!=n?n:void 0,dangerouslySetInnerHTML:{__html:e.value}}),r.createElement(m,{isChild:!0,toc:e.children,className:a,linkClassName:n}))}))):null}function s(e){var t=e.toc,a=e.className,s=void 0===a?"table-of-contents table-of-contents__left-border":a,c=e.linkClassName,u=void 0===c?"table-of-contents__link":c,d=e.linkActiveClassName,g=void 0===d?void 0:d,v=e.minHeadingLevel,p=e.maxHeadingLevel,h=(0,l.Z)(e,o),b=(0,i.LU)(),E=null!=v?v:b.tableOfContents.minHeadingLevel,f=null!=p?p:b.tableOfContents.maxHeadingLevel,_=(0,i.DA)({toc:t,minHeadingLevel:E,maxHeadingLevel:f}),N=(0,r.useMemo)((function(){if(u&&g)return{linkClassName:u,linkActiveClassName:g,minHeadingLevel:E,maxHeadingLevel:f}}),[u,g,E,f]);return(0,i.Si)(N),r.createElement(m,(0,n.Z)({toc:_,className:s,linkClassName:u},h))}},7774:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(7294),l=a(6010),r=a(9960),i="tag_hD8n",o="tagRegular_D6E_",m="tagWithCount_i0QQ";var s=function(e){var t,a=e.permalink,s=e.name,c=e.count;return n.createElement(r.Z,{href:a,className:(0,l.Z)(i,(t={},t[o]=!c,t[m]=c,t))},s,c&&n.createElement("span",null,c))}},62:function(e,t,a){a.d(t,{Z:function(){return s}});var n=a(7294),l=a(6010),r=a(5999),i=a(7774),o="tags_XVD_",m="tag_JSN8";function s(e){var t=e.tags;return n.createElement(n.Fragment,null,n.createElement("b",null,n.createElement(r.Z,{id:"theme.tags.tagsListLabel",description:"The label alongside a tag list"},"Tags:")),n.createElement("ul",{className:(0,l.Z)(o,"padding--none","margin-left--sm")},t.map((function(e){var t=e.label,a=e.permalink;return n.createElement("li",{key:a,className:m},n.createElement(i.Z,{name:t,permalink:a}))}))))}}}]);