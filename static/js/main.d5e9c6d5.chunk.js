(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{10:function(e,t,n){e.exports=n(20)},16:function(e,t,n){},18:function(e,t,n){e.exports=n.p+"static/media/logo.5d5d9eef.svg"},20:function(e,t,n){"use strict";n.r(t);var o=n(0),i=n.n(o),r=n(9),a=n.n(r),u=(n(16),n(1)),s=n(2),c=n(4),l=n(3),p=n(5),m=(n(18),n(8),n(6)),h=function(e){function t(){return Object(u.a)(this,t),Object(c.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return i.a.createElement("div",null,i.a.createElement("h3",null,this.props.name),i.a.createElement("span",null,this.props.description),i.a.createElement("ul",null,this.props.requirements.map(function(e){return i.a.createElement("li",{key:e.toString()},e.toString())})))}}]),t}(i.a.Component),f=0,d=1,g=2,y=3,b=4,v=5,j=6,O=7,w=8,k=9,q=10,S=11,E=function(){function e(t,n){Object(u.a)(this,e),this.type=t,this.amount=n}return Object(s.a)(e,[{key:"toString",value:function(){return this.amount+" of "+this.type}}]),e}();function G(e,t){return new E(e,t)}var x=new Set([d,g,f]),C=[{name:"File name change petition",description:"Go to court and file a petition for name change!",requirements:[G(f,50)],outputs:[k]},{name:"Get copies of court order",description:"Get a bunch of copies that you won't end up needing all of....",requirements:[k],outputs:[v]},{name:"Request therapist letter",description:"Get a therapist to give you a letter",requirements:[d],outputs:[y]},{name:"Request physician letter",description:"Get a physician to give you a letter",requirements:[g],outputs:[b]},{name:"Go to Social Security",description:"Thanks FDR",requirements:[G(v,1),G(b,1)],outputs:[j,w]},{name:"Go to MVA HQ",description:"Did you know Glen Burnie is actually still PG County?",requirements:[G(b,1),G(y,1)],outputs:[O]},{name:"Go to MVA",description:"Do that",requirements:[w,G(O,1)],outputs:[q]},{name:"Go to passport place",description:"Do that",requirements:[G(v,1),G(b,1)],outputs:[S]}],R=function(e){function t(){return Object(u.a)(this,t),Object(c.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(s.a)(t,[{key:"satisfiesRequirement",value:function(e,t){return console.log(e),console.log(t),console.log(e instanceof E),console.log(t.has(e)),e instanceof E&&t.has(e.type)||t.has(e)}},{key:"getNextColumn",value:function(e,t){var n=this,o=new Set(t),i=[],r=[];return e.forEach(function(e){e.requirements.map(function(e){return n.satisfiesRequirement(e,t)}).reduce(function(e,t){return e&&t})?(i.push(e),o=new Set([].concat(Object(m.a)(o),Object(m.a)(e.outputs)))):r.push(e)}),{nextMaterials:new Set(o),nextSteps:i,remainingSteps:r}}},{key:"getColumns",value:function(){for(var e=[],t=x,n=C,o=0;o<4&&n!==[];){console.log(t);var i=this.getNextColumn(n,t);e.push(i.nextSteps),n=i.remainingSteps,t=i.nextMaterials,console.log(n),o++}return e}},{key:"render",value:function(){return i.a.createElement("div",null,this.getColumns().map(function(e,t){return i.a.createElement("div",{className:"column",key:t},e.map(function(e){return i.a.createElement(h,Object.assign({key:e.name},e))}))}))}}]),t}(i.a.Component),D=function(e){function t(){return Object(u.a)(this,t),Object(c.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(s.a)(t,[{key:"render",value:function(){return i.a.createElement(R,null)}}]),t}(o.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(i.a.createElement(D,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})},8:function(e,t,n){}},[[10,2,1]]]);
//# sourceMappingURL=main.d5e9c6d5.chunk.js.map