(this["webpackJsonpfova-web"]=this["webpackJsonpfova-web"]||[]).push([[0],{168:function(e,a,t){e.exports=t.p+"static/media/logo.ee7cd8ed.svg"},201:function(e,a,t){e.exports=t(363)},206:function(e,a,t){},207:function(e,a,t){},208:function(e,a,t){},209:function(e,a,t){},240:function(e,a,t){},314:function(e,a,t){},315:function(e,a,t){},316:function(e,a,t){},317:function(e,a,t){},318:function(e,a,t){},363:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),l=t(26),o=t.n(l),i=t(191),c=(t(206),t(44)),s=t(45),u=t(95),m=t(47),d=t(46),p=t(34),h=t(364),g=(t(207),t(63)),E=t(379),f=t(380),b=(t(208),t(209),t(168)),v=t.n(b),y=function(){return r.a.createElement("div",{className:"Logo"},r.a.createElement("div",{className:"Logo-icon-box"},r.a.createElement("img",{src:v.a,className:"Logo-icon",alt:"logo"})),r.a.createElement("span",{className:"Logo-title"},"FOVA Energy"))},k=t(108),S=t.n(k),w=t(144),I=t(373),D=function(e){var a=document.cookie.match(new RegExp("(^| )"+e+"=([^;]+)"));if(a){var t="";try{t=decodeURIComponent(a[2])}catch(n){console.warn("Cookie parse error: ",n)}return t}return""},N=function(){var e=Object(w.a)(S.a.mark((function e(a,t){var n;return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={"X-CSRFToken":"/api/account/login"===a?"ImI0M2ZlZjgxZmRiNTAwZWMxYmE4NDYzYjQzNTM1MDFmZTk5OWRjOGEi.Xyw2Iw.xYuZelp39q-HpjGf_abdtEdT-Ag":D("csrf_token"),"Content-Type":"application/json"},e.abrupt("return",fetch(a,{method:"POST",headers:n,body:t}).then((function(e){return e.json()})).then((function(e){return"OK"===e.code?console.log("SUCCESS!",a,n,t,e):console.warn("FAIL!",a,n,t,e),e})));case 2:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}(),O=function(){var e=Object(w.a)(S.a.mark((function e(a,t){var n;return S.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n={"X-CSRFToken":D("csrf_token"),"Content-Type":"application/json"},e.abrupt("return",fetch(a,{method:"GET",headers:n,body:t}).then((function(e){return e.json()})).then((function(e){return"OK"===e.code?console.log("SUCCESS!",a,n,t,e):console.warn("FAIL!",a,n,t,e),e})));case 2:case"end":return e.stop()}}),e)})));return function(a,t){return e.apply(this,arguments)}}(),C=function(e,a){var t;if(void 0===T.get(e)&&I.b.error(T.get("default")+e),"en-us"===a)I.b.warn(null===(t=T.get(e))||void 0===t?void 0:t["en-us"]);else if("zh-hans"===a){var n;I.b.warn(null===(n=T.get(e))||void 0===n?void 0:n["zh-hans"])}},T=new Map([["User Not Exist",{"en-us":"The credential you provided does not match our record. Please try again. ","zh-hans":"\u60a8\u6240\u63d0\u4f9b\u7684\u767b\u5f55\u4fe1\u606f\u6709\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002"}],["Password Error",{"en-us":"The credential you provided does not match our record. Please try again. ","zh-hans":"\u60a8\u6240\u63d0\u4f9b\u7684\u767b\u5f55\u4fe1\u606f\u6709\u8bef\uff0c\u8bf7\u91cd\u8bd5\u3002"}],["Login Required",{"en-us":"Login is required for this operation.","zh-hans":"\u6b64\u64cd\u4f5c\u9700\u8981\u767b\u5f55\u6743\u9650\uff0c\u8bf7\u767b\u5f55\u3002"}],["Product Not Allowed",{"en-us":"Product permission denied. Please contact administrator. ","zh-hans":"\u60a8\u6682\u65f6\u6ca1\u6709\u4f7f\u7528\u6b64\u670d\u52a1\u7684\u6743\u9650\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u3002"}],["Internal Server Error",{"en-us":"Internal Server Error. Please contact administrator. ","zh-hans":"\u7cfb\u7edf\u5185\u90e8\u9519\u8bef\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u3002"}],["External Error",{"en-us":"External Error. Please contact administrator. ","zh-hans":"\u7cfb\u7edf\u5916\u90e8\u9519\u8bef\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u3002"}],["Method Not Allowed",{"en-us":"HTTP method Error. Please contact administrator. ","zh-hans":"\u65e0\u6548\u7684HTTP\u8bf7\u6c42\uff0c\u8bf7\u8054\u7cfb\u7ba1\u7406\u5458\u3002"}],["defualt",{"en-us":"An unkown error has occured, CODE: ","zh-hans":"\u672a\u77e5\u9519\u8bef\uff0c\u9519\u8bef\u7801\uff1a"}]]),j=h.a.Header,x=g.a.SubMenu,A=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(){var e;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(e=a.call.apply(a,[this].concat(r))).handleSelectLanguage=function(a){e.props.switchLanguage(a.key)},e.handleClickLogout=function(){N("/api/account/logout").then((function(a){"OK"===a.code?e.props.handleSignout():C(a.code,e.props.language)}))},e.enzh=function(a,t){return"en-us"===e.props.language?a:t},e}return Object(s.a)(t,[{key:"render",value:function(){var e=r.a.createElement(g.a.Item,{key:"menu-signout",icon:r.a.createElement(E.a,{height:"3em"}),style:{float:"right"},onClick:this.handleClickLogout},this.enzh("Sign Out","\u9000\u51fa\u767b\u5f55"));return r.a.createElement("div",{className:"TopBar"},r.a.createElement(j,{className:"header"},r.a.createElement(y,null),r.a.createElement(g.a,{theme:"dark",mode:"horizontal"},this.props.authorized?e:null,r.a.createElement(x,{key:"menu-language",icon:r.a.createElement(f.a,{height:"3em"}),title:this.enzh("Intl-English","Intl-\u7b80\u4f53\u4e2d\u6587"),style:{float:"right"}},r.a.createElement(g.a.Item,{key:"zh-hans",onClick:this.handleSelectLanguage},"\u7b80\u4f53\u4e2d\u6587"),r.a.createElement(g.a.Item,{key:"en-us",onClick:this.handleSelectLanguage},"English - US")))))}}]),t}(r.a.Component),P=t(370),z=t(372),L=t(107),U=t(48),M=t(381),F=t(382),R=(t(240),function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(){var e;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),l=0;l<n;l++)r[l]=arguments[l];return(e=a.call.apply(a,[this].concat(r))).onFinish=function(a){var t={name:a.username,password:a.password};N("/api/account/login",JSON.stringify(t)).then((function(a){"OK"===a.code?e.props.handleSignin():C(a.code,e.props.language)}))},e}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Signin"},r.a.createElement(P.a,{name:"normal_login",className:"login-form",initialValues:{remember:!0},onFinish:this.onFinish},r.a.createElement(P.a.Item,{name:"username",rules:[{required:!0,message:"en-us"===this.props.language?"Please input your name":"\u8bf7\u8f93\u5165\u7528\u6237\u540d"}]},r.a.createElement(z.a,{prefix:r.a.createElement(M.a,{className:"site-form-item-icon"}),placeholder:"en-us"===this.props.language?"Name":"\u7528\u6237\u540d"})),r.a.createElement(P.a.Item,{name:"password",rules:[{required:!0,message:"en-us"===this.props.language?"Please input your Password":"\u8bf7\u8f93\u5165\u767b\u5f55\u53e3\u4ee4"}]},r.a.createElement(z.a,{prefix:r.a.createElement(F.a,{className:"site-form-item-icon"}),type:"password",placeholder:"en-us"===this.props.language?"Password":"\u767b\u5f55\u53e3\u4ee4"})),r.a.createElement(P.a.Item,null,r.a.createElement(P.a.Item,{name:"remember",valuePropName:"unchecked",noStyle:!0},r.a.createElement(L.a,null,"en-us"===this.props.language?"Remember me":"\u4fdd\u5b58\u767b\u5f55\u4fe1\u606f")),r.a.createElement("a",{href:"/",onClick:function(e){return e.preventDefault()},className:"login-form-portal"},"en-us"===this.props.language?"Administartor Portal":"\u7ba1\u7406\u5458\u901a\u9053")),r.a.createElement(P.a.Item,null,r.a.createElement(U.a,{type:"primary",htmlType:"submit",className:"login-form-button"},"en-us"===this.props.language?"Log in":"\u767b\u5f55"))))}}]),t}(r.a.Component)),V=t(193),B=t(389),J=t(390),_=t(391),q=(t(314),t(375)),H=t(197),K=t(376),Z=t(377),Y=t(367),G=t(387),W=t(388),X=(t(315),t(365)),Q=t(366),$=(t(316),function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(){return Object(c.a)(this,t),a.apply(this,arguments)}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"DashboardCharts"},r.a.createElement(X.a,{gutter:16},r.a.createElement(Q.a,{className:"gutter-row",span:6},r.a.createElement("div",{className:"chart-box"},r.a.createElement("p",{className:"placeholder"},"<Result Data>"))),r.a.createElement(Q.a,{className:"gutter-row",span:6},r.a.createElement("div",{className:"chart-box"},r.a.createElement("p",{className:"placeholder"},"<Result Data>"))),r.a.createElement(Q.a,{className:"gutter-row",span:6},r.a.createElement("div",{className:"chart-box"},r.a.createElement("p",{className:"placeholder"},"<Result Data>"))),r.a.createElement(Q.a,{className:"gutter-row",span:6},r.a.createElement("div",{className:"chart-box"},r.a.createElement("p",{className:"placeholder"},"<Result Data>")))))}}]),t}(r.a.Component)),ee=t(369),ae=t(130),te=t(198),ne=t(368),re=t(374),le=t(384),oe=t(385),ie=t(386),ce=(t(317),t(67)),se=t.n(ce),ue=t(106),me=t(378),de=t(131),pe=t(371),he=t(383),ge=(t(318),{labelCol:{span:6},wrapperCol:{span:14}}),Ee=z.a.TextArea,fe=ue.a.Option,be=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state=void 0,n.setAccident=function(e){n.setState({isAccident:e})},n.onSubmit=function(){n.setState({uploadInProgress:!0})},n.loadFile=function(e){return n.setState({fileData:e.file}),Array.isArray(e)?e:e&&e.fileList},n.state={isAccident:!1,uploadInProgress:!1,fileData:null},n}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Upload"},r.a.createElement("div",{className:"upload-form"},r.a.createElement(P.a,Object.assign({name:"validate_other"},ge,{onFinish:this.onSubmit}),r.a.createElement(P.a.Item,{label:"Upload Name",name:"name"},r.a.createElement(z.a,{placeholder:"Custom name for this dataset (Optional)"})),r.a.createElement(P.a.Item,{label:"Upload Remarks",name:"note"},r.a.createElement(Ee,{rows:3,placeholder:"Description and remarks of this dataset (Optional)"})),r.a.createElement(P.a.Item,{label:"Upload ID Tag",name:"idtag"},r.a.createElement(ue.a,{mode:"tags",style:{width:"100%"},placeholder:"Upload Tag (Optional)"},r.a.createElement(fe,{key:"ev1",value:"EV1"},"EV1"),r.a.createElement(fe,{key:"ess1",value:"ESS1"},"ESS1"),r.a.createElement(fe,{key:"cb1",value:"Cell Batch 1"},"Cell Batch 1"))),r.a.createElement(P.a.Item,{label:"Accident Data",name:"isAccident",valuePropName:"checked"},r.a.createElement(me.a,{checkedChildren:"Yes",unCheckedChildren:"No",onChange:this.setAccident})),r.a.createElement(P.a.Item,{label:"Accident Date",name:"accidentDate"},r.a.createElement(ee.a,{disabled:!this.state.isAccident,disabledDate:function(e){return e.isAfter(se()())}})),r.a.createElement(P.a.Item,{label:"Accident Description",name:"accidentNote"},r.a.createElement(Ee,{rows:3,style:{width:"100%"},disabled:!this.state.isAccident,placeholder:"Relevant infomations about this accident. (Optional)"})),r.a.createElement(P.a.Item,{label:"Data Format",name:"format"},r.a.createElement(de.a.Group,null,r.a.createElement(de.a.Button,{value:"ev"},"csv"),r.a.createElement(de.a.Button,{value:"ess"},"mat"))),r.a.createElement(P.a.Item,{label:"Upload File",rules:[{required:!0,message:"Please upload dataset to continue. "}]},r.a.createElement(P.a.Item,{name:"dragger",valuePropName:"fileList",getValueFromEvent:this.loadFile,noStyle:!0},r.a.createElement(pe.a.Dragger,{name:"files",beforeUpload:function(e,a){return!1}},r.a.createElement("p",{className:"ant-upload-drag-icon"},r.a.createElement(he.a,null)),r.a.createElement("p",{className:"ant-upload-text"},"Click or drag file to this area to upload")))),r.a.createElement(P.a.Item,{wrapperCol:{span:12,offset:6}},r.a.createElement(U.a,{type:"primary",htmlType:"submit",disabled:null===this.state.fileData,loading:!!this.state.uploadInProgress},this.state.uploadInProgress?"Upload In Progress":"Start Upload")))))}}]),t}(r.a.Component),ve=z.a.Search,ye=ee.a.RangePicker,ke=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state=void 0,n.openDrawer=function(){n.setState({drawerVisible:!0})},n.onDrawerClose=function(){n.setState({drawerVisible:!1})},n.mockFormColumns=[{title:"File Name",dataIndex:"name",key:"name"},{title:"File ID",dataIndex:"fileID",key:"fileID"},{title:"Upload Time",dataIndex:"uploadTime",key:"uploadTime"},{title:"Status",dataIndex:"status",key:"status",render:function(e){return 0===e.length?"":r.a.createElement(H.a,{color:"green"},e)}},{title:"Action",dataIndex:"action",key:"x",render:function(){return r.a.createElement(ae.a,{overlay:n.bulkActionMenu},r.a.createElement("a",{href:"/",onClick:function(e){return e.preventDefault()}},"Choose Action"))}}],n.mockFormData=[{key:1,name:"data05.csv",fileID:"202008UD425690411",uploadTime:"16 July 2020, 03:21:48 PST",status:"Completed",action:r.a.createElement("a",{href:"/#"},"Select Algorithm")},{key:2,name:"data04.tar.gz",fileID:"200723UD425697810",uploadTime:"11 May 2020, 14:26:03 PST",status:"Completed"},{key:3,name:"randfilegen.py",fileID:"200808UD425693511",uploadTime:"29 Feb 2020, 20:11:23 PST",status:"Completed"},{key:4,name:"data-depricated.tar.gz",fileID:"2012723UD42569045",uploadTime:"14 Feb 2020, 21:00:23 PST",status:"Completed"},{key:5,name:"data03.csv",fileID:"2008UD42569081564",uploadTime:"25 Jan 2020, 09:15:02 PST",status:"Completed"},{key:6,name:"data01.csv",fileID:"200536UD425690763",uploadTime:"14 Jan 2020, 12:59:40 PST",status:"Completed"},{key:7,name:"data01.csv",fileID:"200458UD425690885",uploadTime:"02 Jan 2020, 20:07:23 PST",status:"Completed"},{key:8,name:"deprecated_bat.csv",fileID:"200458UD425690885",uploadTime:"15 Dec 2019, 21:51:09 PST",status:"Completed"},{key:9,name:"accident_report.csv",fileID:"200458UD425690885",uploadTime:"11 Nov 2019, 04:22:15 PST",status:"Completed"}],n.bulkActionMenu=r.a.createElement(g.a,null,r.a.createElement(g.a.Item,{key:"bulk-choose-algo"},"Choose Algorithm"),r.a.createElement(g.a.Item,{key:"bulk-view-result"},"View Result")),n.filterPopup=r.a.createElement("div",null,r.a.createElement(ye,null)),n.state={drawerVisible:!1},n}return Object(s.a)(t,[{key:"componentDidMount",value:function(){var e=this,a="";switch(this.props.tab){case"EVL Management":a="ev";break;case"ESS Management":a="ess";break;case"R&amp;D Management":a="r&d"}var t={product:a};O("/api/data/upload/list",JSON.stringify(t)).catch((function(a){console.warn(a),C(a,e.props.language)}))}},{key:"render",value:function(){return r.a.createElement("div",{className:"DashboardTable"},r.a.createElement(U.a,{className:"table-button",type:"primary",shape:"round",icon:r.a.createElement(le.a,null),onClick:this.openDrawer},"New Upload"),r.a.createElement(ae.a,{overlay:this.bulkActionMenu,trigger:["click"]},r.a.createElement(U.a,{className:"table-button",shape:"round",icon:r.a.createElement(oe.a,null)},"Bulk Action")),r.a.createElement(te.a,{placement:"bottomLeft",content:this.filterPopup,trigger:"click"},r.a.createElement(U.a,{className:"table-button",shape:"round",icon:r.a.createElement(ie.a,null)},"Filter")),r.a.createElement(ve,{onSearch:function(e){return console.log(e)},size:"small",style:{width:200,padding:"5px"}}),r.a.createElement(ne.a,{size:"middle",rowSelection:{},pagination:{pageSize:7},columns:this.mockFormColumns,dataSource:this.mockFormData}),r.a.createElement(re.a,{title:"Start New Upload Session",width:720,onClose:this.onDrawerClose,visible:this.state.drawerVisible,bodyStyle:{paddingBottom:80}},r.a.createElement(be,{tab:this.props.tab,language:this.props.language})))}}]),t}(r.a.Component),Se=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(){return Object(c.a)(this,t),a.apply(this,arguments)}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"DashboardMain"},r.a.createElement(q.a,{ghost:!1,title:this.props.tab,tags:r.a.createElement(H.a,{color:"orange"},"Admin"),subTitle:"Manage ".concat(this.props.tab.split(" ")[0]," upload items"),extra:[r.a.createElement(U.a,{key:"upload-button",type:"primary",shape:"round",icon:r.a.createElement(G.a,null)},"Export"),r.a.createElement(K.a,{dot:!0,key:"notification-badge"},r.a.createElement(U.a,{key:"notification-button",shape:"circle",icon:r.a.createElement(W.a,null)}))],style:{padding:"0px 5px 15px"}},r.a.createElement(Z.a,{size:"small",column:3,style:{paddingTop:"3px"}},r.a.createElement(Z.a.Item,{label:"Owner"},"Test User"),r.a.createElement(Z.a.Item,{label:"Association"},"421421"),r.a.createElement(Z.a.Item,{label:"Remarks"},"Admin permission"))),r.a.createElement($,null),r.a.createElement(Y.a,{orientation:"left"},"Manage Uploads"),r.a.createElement(ke,{tab:this.props.tab,language:this.props.language}))}}]),t}(r.a.Component),we=h.a.Content,Ie=h.a.Sider,De=h.a.Footer,Ne=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state=void 0,n.handleSelect=function(e){n.setState({tab:e.key})},n.state={tab:"EVL Management"},n}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"Dashboard"},r.a.createElement(we,{style:{padding:"0 50px"}},r.a.createElement(V.a,{style:{margin:"16px 0"}},r.a.createElement(V.a.Item,null,"Home"),r.a.createElement(V.a.Item,null,this.state.tab)),r.a.createElement(h.a,{className:"site-layout-background",style:{padding:"24px 0"}},r.a.createElement(Ie,{className:"site-layout-background",width:220},r.a.createElement(g.a,{mode:"inline",defaultSelectedKeys:["EVL Management"],onSelect:this.handleSelect,style:{height:"100%"}},r.a.createElement(g.a.Item,{key:"EVL Management",icon:r.a.createElement(B.a,null)},"EVL Management"),r.a.createElement(g.a.Item,{key:"ESS Management",icon:r.a.createElement(J.a,null)},"ESS Management"),r.a.createElement(g.a.Item,{key:"R&D Management",icon:r.a.createElement(_.a,null)},"R&D Management"))),r.a.createElement(we,{style:{padding:"0 24px",minHeight:280}},r.a.createElement(Se,{tab:this.state.tab,language:this.props.language})))),r.a.createElement(De,{style:{textAlign:"center"}},"Fova Energy \xa92020"))}}]),t}(r.a.Component),Oe=function(e){Object(m.a)(t,e);var a=Object(d.a)(t);function t(e){var n;return Object(c.a)(this,t),(n=a.call(this,e)).state=void 0,n.componentDidMount=function(){O("/api/account/user/info").then((function(e){"OK"===e.code&&n.setState({authorized:!0})})).catch((function(){n.setState({authorized:!1})}))},n.handleSignin=function(){n.setState({authorized:!0})},n.handleSignout=function(){n.setState({authorized:!1})},n.switchLanguage=function(e){n.setState({language:e})},n.mountSignin=function(){return n.state.authorized?r.a.createElement(p.a,{to:"/home"}):r.a.createElement(R,{handleSignin:n.handleSignin,language:n.state.language})},n.mountDashboard=function(){return n.state.authorized?r.a.createElement(Ne,{language:n.state.language}):r.a.createElement(p.a,{to:"/signin"})},n.state={authorized:!1,language:"en-us"},n.handleSignin=n.handleSignin.bind(Object(u.a)(n)),n.handleSignout=n.handleSignout.bind(Object(u.a)(n)),n.switchLanguage=n.switchLanguage.bind(Object(u.a)(n)),n}return Object(s.a)(t,[{key:"render",value:function(){return r.a.createElement("div",{className:"App"},r.a.createElement(h.a,null,r.a.createElement(A,{authorized:this.state.authorized,language:this.state.language,handleSignout:this.handleSignout,switchLanguage:this.switchLanguage}),r.a.createElement(p.d,null,r.a.createElement(p.b,{exact:!0,path:"/",render:this.mountSignin}),r.a.createElement(p.b,{path:"/signin",render:this.mountSignin}),r.a.createElement(p.b,{path:"/home",render:this.mountDashboard}),r.a.createElement(p.b,{render:this.mountSignin}))))}}]),t}(r.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(i.a,null,r.a.createElement(Oe,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[201,1,2]]]);
//# sourceMappingURL=main.0e214d6d.chunk.js.map