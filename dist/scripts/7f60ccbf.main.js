(function(){var a;a=function(){function a(a){this.token=a,this.baseUrl="https://www.googleapis.com/plus/v1"}return a.prototype.getCurrentUser=function(a){var b;return b={url:this.baseUrl+"/people/me",data:{access_token:this.token,v:3,alt:"json","max-results":1e4}},$.ajax(b).done(a)},a.prototype.getContacts=function(a){var b;return b={url:this.baseUrl+"/people/me/people/visible",data:{access_token:this.token,v:3,alt:"json","max-results":1e4}},$.ajax(b).done(a)},a}(),$(document).ready(function(){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z;return q={login:document.querySelector("#page-login"),caller:document.querySelector("#page-caller")},window.pubnub=null,y=null,d=null,o=null,r=null,document.querySelector("#login").addEventListener("click",function(){return y=document.querySelector("#userid").value,i("guest-"+y)}),i=function(a){return y=a,null!=r&&r.getContacts(function(){}),window.pubnub=PUBNUB.init({publish_key:"pub-c-7070d569-77ab-48d3-97ca-c0c3f7ab6403",subscribe_key:"sub-c-49a2a468-ced1-11e2-a5be-02ee2ddab7fe",uuid:a}),pubnub.onNewConnection(function(a){return o?s(a):void 0}),q.login.className=q.login.className.replace("active",""),q.caller.className+=" active",$(document).trigger("pubnub:ready")},window.signinCallback=function(b){return b.access_token?($("#signinButton").hide(),r=new a(b.access_token),r.getCurrentUser(function(a){var b;return b=a.displayName.split(" "),b=b[0]+" "+b[1].charAt(0)+".",i(""+a.id+"-"+b)})):b.error?console.log("Sign-in state: "+b.error):void 0},x=_.template($("#user-item-template").text()),w=$("#user-list"),$(document).on("pubnub:ready",function(){return pubnub.subscribe({channel:"phonebook",callback:function(){},presence:function(a){var b,c;return"join"===a.action&&a.uuid!==y?(c=x({name:a.uuid.split("-")[1],id:a.uuid}),w.append(c)):"leave"===a.action&&a.uuid!==y?(b=w.find('li[data-user="'+a.uuid+'"]'),b.remove()):void 0}})}),c="",m=$("#answer-modal"),m.modal({show:!1}),s=function(a){return pubnub.publish({user:a,stream:o}),pubnub.subscribe({user:a,stream:function(a,b){return document.querySelector("#call-video").src=URL.createObjectURL(b.stream)},disconnect:function(){return document.querySelector("#call-video").src="",$(document).trigger("call:end")},connect:function(){}})},b=function(a){return d=a,s(a),null!=d&&g(),$(document).trigger("call:start",a),pubnub.publish({channel:"answer",message:{caller:c,callee:y}})},$(document).on("pubnub:ready",function(){return pubnub.subscribe({channel:"call",callback:function(a){return a.callee===y?(c=a.caller,p(a.caller)):void 0}}),pubnub.subscribe({channel:"answer",callback:function(a){return a.caller===y?(g(),d=a.callee,s(a.callee),$(document).trigger("call:start",a.callee)):void 0}})}),p=function(a){return a=a.split("-")[1],m.find(".caller").text(""+a+" is calling..."),m.modal("show")},m.find(".btn-primary").on("click",function(){return b(c),m.modal("hide")}),n=$("#calling-modal"),n.modal({show:!1}),$("#user-list").on("click","a[data-user]",function(a){var b,c;return c=$(a.target).data("user"),d=c,b=c.split("-")[1],n.find(".calling").text("Calling "+b+"..."),n.modal("show"),pubnub.publish({channel:"call",message:{caller:y,callee:c}})}),$(document).on("call:start",function(){return n.modal("hide")}),j=$("#chat-receive-message"),l=$("#chat-message"),j.text(""),k=$("#chat-area"),k.hide(),e=function(){return d>y?""+d+"-"+y:""+y+"-"+d},$(document).on("call:start",function(){return k.show(),j.text(""),pubnub.subscribe({channel:e(),callback:function(a){return j.append("<br />"+a),j.attr({scrollTop:j.attr("scrollHeight")})}})}),$(document).on("call:end",function(){return k.hide(),pubnub.unsubscribe({channel:e()})}),l.on("keydown",function(a){return 13===a.keyCode&&null!=d?(pubnub.publish({channel:e(),message:l.val()}),l.val("")):void 0}),$("#hang-up").on("click",function(){return g()}),g=function(){return pubnub.closeConnection(d,function(){return $(document).trigger("call:end")})},z=$("#video-controls"),u=z.find("#time"),t=0,v=null,z.hide(),h=function(){var a,b;return t+=1,a=Math.floor(t/60),b=t%60,1===a.toString().length&&(a="0"+a),1===b.toString().length&&(b="0"+b),u.text(""+a+":"+b)},$(document).on("call:start",function(){return z.show(),t=0,u.text("00:00"),v=setInterval(h,1e3)}),$(document).on("call:end",function(){return z.hide(),clearInterval(v)}),f=function(a){return document.querySelector("#self-call-video").src=URL.createObjectURL(a),o=a},navigator.webkitGetUserMedia({audio:!0,video:!0},f),q.login.className+=" active"})}).call(this);