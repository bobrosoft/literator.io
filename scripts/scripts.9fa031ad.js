"use strict";angular.module("literatorioApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","pascalprecht.translate","angular-google-analytics","underscore","angular-speakingurl","webfont-loader","mcwebb.sound"]).filter("encodeURIComponent",["$window",function(a){return a.encodeURIComponent}]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl",controllerAs:"about"}).when("/verse/404",{templateUrl:"views/verse404.html",controller:"Verse404Ctrl",controllerAs:"verse404"}).when("/verse/:authorName/:verseName",{templateUrl:"views/verse.html",controller:"VerseCtrl",controllerAs:"verse"}).otherwise({redirectTo:"/"})}]).config(["$translateProvider",function(a){a.useStaticFilesLoader({prefix:"i18n/",suffix:".json"}),a.useSanitizeValueStrategy("escape");var b={"en-US":"en","ru-RU":"ru","*":"en"};a.registerAvailableLanguageKeys(["en","ru"],b).fallbackLanguage("en"),a.useLocalStorage()}]).config(["AnalyticsProvider",function(a){a.setAccount("UA-6315511-11"),a.trackPages(!1),a.useDisplayFeatures(!0),a.useAnalytics(!0)}]).run(["$rootScope","$injector","$window","$location","$translate","Analytics",function(a,b,c,d,e,f){a.global={},a.global.pageTitle="Literator.io",a.$on("$routeChangeSuccess",function(b,c){a.global.currentPage=c.$$route.controllerAs,f.trackPage(d.path())}),c.WebFont.load({custom:{families:["NotoSerif:n4,i4,n7"]}});try{var g=b.get("CountriesDataStore");g.loadSound({name:"bell",src:"resources/sounds/bell.mp3"})}catch(a){}b.get("CountriesDataStore")}]),angular.module("literatorioApp").controller("MainCtrl",["$rootScope","$scope","$location","$timeout","$translate","VerseDataStore","Analytics",function(a,b,c,d,e,f,g){function h(){e("COMMON_APP_NAME").then(function(b){a.global.pageTitle=b}),b.isLeaving=!1,b.onStartButtonClick=i,b.$on("$destroy",k),l.push(d(function(){a.$broadcast("HeaderCtrl.doShow"),a.$broadcast("FooterCtrl.doShow"),a.$broadcast("GitHubRibbonCtrl.doShow")},3e3)),g.trackEvent("web","main-init")}function i(){f.getRandomVerse().then(function(a){j(a.url),g.trackEvent("web","main-start-btn-click")})}function j(e){b.isLeaving=!0,d(function(){c.url(e)},1500),a.$broadcast("HeaderCtrl.doHide"),a.$broadcast("FooterCtrl.doHide"),a.$broadcast("GitHubRibbonCtrl.doHide")}function k(){l.forEach(function(a){d.cancel(a)})}var l=[];h()}]),angular.module("literatorioApp").controller("AboutCtrl",["$rootScope","$translate","Analytics",function(a,b,c){function d(){a.global.pageTitle=b.instant("COMMON_APP_NAME"),a.$broadcast("HeaderCtrl.doShow"),a.$broadcast("FooterCtrl.doShow"),a.$broadcast("GitHubRibbonCtrl.doHide"),c.trackEvent("web","about-init")}d()}]),angular.module("literatorioApp").controller("VerseCtrl",["$q","$rootScope","$scope","$location","$routeParams","$timeout","$interval","$translate","VerseDataStore","VerseBlock","SoundManager","Analytics",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(){var g=null;i.getVerseByAuthorAndName(e.authorName,e.verseName).then(function(b){if(g=b,!g)throw{type:404};return a.all({content:g.loadContent(),author:g.getAuthor()})}).then(function(a){I=g.authorName+"/"+g.name,L=g.getPieces({}),K=J("#content"),T=J(".view-verse input"),c.$on("$destroy",C),K.bind("click",z),c.verse=g,c.author=a.author,c.versePieces=[],c.currentBlock=null,c.isIOS=H,c.isFinished=!1,c.isLeaving=!1,c.isControlsHintVisible=!1,c.onInputFieldKeyup=y,c.onAnotherVerseButtonClick=A,c.onAnotherVerseOfAuthorButtonClick=B,O.push(f(function(){n(),P=new Date},2600)),b.global.pageTitle=g.title+" | "+h.instant("COMMON_APP_NAME"),b.$broadcast("HeaderCtrl.doHide"),b.$broadcast("FooterCtrl.doHide"),b.$broadcast("GitHubRibbonCtrl.doHide"),l.trackEvent("web","verse-init",I)}).catch(function(a){switch(l.trackEvent("web","verse-init-error",I),a.type){case 404:d.url("/verse/404")}})}function n(){M&&g.cancel(M),M=g(r,F)}function o(){M&&(g.cancel(M),M=null)}function p(){N&&g.cancel(N),S="",N=g(s,G)}function q(){N&&(g.cancel(N),N=null,S="")}function r(){var a=L.shift();return angular.isDefined(a)?void(a instanceof j?(o(),c.currentBlock=a,f(function(){T.focus()},100),T.val(""),p(),w(),t()):c.versePieces.push(a)):(c.isFinished=!0,c.finishedInSeconds=Math.floor((Date.now()-P.getTime())/1e3),O.push(f(function(){b.$broadcast("HeaderCtrl.doShow"),b.$broadcast("FooterCtrl.doShow")},8e3)),o(),T.blur(),l.trackEvent("web","verse-complete",I),l.trackEvent("web","verse-complete-seconds",I,c.finishedInSeconds),void l.trackEvent("web","verse-complete-hints",I,R))}function s(){var a=c.currentBlock.toString().substr(S.length,1);!a.length||S.length>=D?v():(S+=a,0===String(T.val()).indexOf(a)&&T.val(String(T.val()).substr(1)),c.versePieces.push(a),R++)}function t(){Q||(Q=!0,c.isControlsHintVisible=!0)}function u(){c.isControlsHintVisible=!1,c.$applyAsync()}function v(){var a=c.currentBlock.toString().substr(S.length);c.currentBlock=null,c.versePieces.push(a),T.val(""),k.playSound("bell"),q(),n()}function w(){var a=T.offset().top-window.innerHeight/(H?4:2);J("html, body").animate({scrollTop:a})}function x(a){c.isLeaving=!0,J("html, body").animate({scrollTop:0},1200),b.$broadcast("HeaderCtrl.doHide"),b.$broadcast("FooterCtrl.doHide"),O.push(f(function(){d.url(a)},1500))}function y(){c.currentBlock&&((c.currentBlock.match(S+T.val(),E)||c.currentBlock.match(T.val(),E))&&v(),u())}function z(a){["A","BUTTON"].indexOf(a.target.tagName)===-1&&(a.stopPropagation(),a.preventDefault()),T.focus(),u()}function A(){l.trackEvent("web","verse-another-verse-btn-click",I),i.getRandomVerse().then(function(a){return c.verse.isMatch(a)?A():void x(a.url)})}function B(){l.trackEvent("web","verse-another-verse-of-author-btn-click",I),i.getRandomVerseForAuthor(e.authorName).then(function(a){return c.verse.isMatch(a)?A():void x(a.url)})}function C(){K.unbind("click",z),q(),o(),O.forEach(function(a){f.cancel(a)}),c.isFinished||l.trackEvent("web","verse-leave-uncompleted",I)}var D=2,E=3,F=100,G=4e3,H=/iPad|iPhone|iPod/.test(navigator.userAgent),I=null,J=angular.element,K=null,L=null,M=null,N=null,O=[],P=null,Q=!1,R=0,S=null,T=null;m()}]),angular.module("literatorioApp").factory("Verse",["$injector","$http","VerseBlock",function(a,b,c){function d(a){angular.extend(this,a),this.path=[this.PATH_BASE,this.authorName,"verses",this.name].join("/"),this.url=[this.URL_BASE,this.authorName,this.name].join("/")}return d.prototype={DIFFICULTY_EASY:"easy",DIFFICULTY_NORMAL:"normal",BLOCK_SEPARATOR_START:"{",BLOCK_SEPARATOR_END:"}",URL_BASE:"/verse",PATH_BASE:"resources/verses",loadContent:function(){var a=this;return b({method:"GET",url:this.path+"/content.txt"}).then(function(b){var c=b.data.trim();return c=c.replace(/[\s](\x2d|\x2212|\x2010\x2012\x2043)/g," —").replace(/\n\r|\r\n|\r/g,"\n").replace(/[\n]{3,}/g,"\n\n").replace(/[\x20]{2,}/g," "),a.content=c,a.plainText=c.replace(new RegExp("\\"+a.BLOCK_SEPARATOR_START+"|\\"+a.BLOCK_SEPARATOR_END,"g"),""),a})},getPieces:function(a){var b=this;a=angular.extend({difficulty:"easy"},a);var d=b.normalizeStringToDifficulty(b.content,a.difficulty).split(""),e=[],f=!1,g=null;return d.forEach(function(a){switch(a){case b.BLOCK_SEPARATOR_START:f=!0,g="";break;case b.BLOCK_SEPARATOR_END:f=!1,g.length&&e.push(new c(g));break;default:f?g+=a:e.push(a)}}),e},getAuthor:function(){return a.get("VerseDataStore").getAuthorByName(this.authorName)},isMatch:function(a){return this.name===a.name&&this.authorName===a.authorName},normalizeStringToDifficulty:function(a,b){var c=this,d=b===c.DIFFICULTY_EASY?1:2,e=a.split(""),f=[],g=[];return e.forEach(function(a,b){switch(a){case c.BLOCK_SEPARATOR_START:f.push(b);break;case c.BLOCK_SEPARATOR_END:g.push(b)}if(f.length&&f.length===g.length){var h=Math.min(f.length,d),i=function(a,b){b+1!==h&&delete e[a]};f.reverse().forEach(i),g.forEach(i),f=[],g=[]}}),e.join("")}},d}]),angular.module("literatorioApp").factory("VerseDataStore",["$q","$http","_","Verse","VerseAuthor",function(a,b,c,d,e){function f(){return m.getDataStructure||(m.getDataStructure=b({method:"GET",url:"resources/verses/structure.json",responseType:"json"}).then(function(a){return a.data})),m.getDataStructure}function g(){return f().then(function(a){return a.verses})}function h(){return f().then(function(a){return a.authors})}function i(a){return h().then(function(b){var d=c.findWhere(b,{name:a});return d?new e(d):null})}function j(){return g().then(function(a){return a&&a.length?new d(c.sample(a)):null})}function k(a){return g().then(function(b){var e=c.sample(c.where(b,{authorName:a}));return e?new d(e):null})}function l(a,b){return g().then(function(e){var f=c.findWhere(e,{authorName:a,name:b});return f?new d(f):null})}var m={};return f(),{getDataStructure:f,getAuthorByName:i,getRandomVerse:j,getRandomVerseForAuthor:k,getVerseByAuthorAndName:l}}]),angular.module("literatorioApp").service("VerseBlock",["$speakingurl",function(a){function b(a){this._string=a,this._stringNormalized=this.normalizeString(a)}return b.prototype={match:function(a,b){return!(a.length<Math.min(this._string.length,b))&&0===this._stringNormalized.indexOf(this.normalizeString(a.substr(0,b)))},normalizeString:function(b){return b=(b+"").toLowerCase().replace("ё","е"),a.getSlug(b)},toString:function(){return this._string},valueOf:function(){return this.toString()}},b}]),angular.module("literatorioApp").service("VerseAuthor",function(){function a(a){angular.extend(this,a)}return a}),angular.module("literatorioApp").controller("Verse404Ctrl",["Analytics",function(a){a.trackEvent("web","verse404-init")}]),angular.module("literatorioApp").controller("FooterCtrl",["$scope",function(a){function b(){a.isVisible=!1,a.$on("FooterCtrl.doShow",d),a.$on("FooterCtrl.doHide",c)}function c(){a.isVisible=!1}function d(){a.isVisible=!0}b()}]),angular.module("literatorioApp").controller("CountryMenuCtrl",["$scope","CountriesDataStore",function(a,b){function c(){a.countries=b.getAvailableCountries(),a.currentCountry=b.getCurrentCountry(),a.onCountryChange=d}function d(c){b.setCurrentCountry(c),a.currentCountry=b.getCurrentCountry()}c()}]),angular.module("literatorioApp").service("CountriesDataStore",["$rootScope","$translate","$window","_",function(a,b,c,d){function e(){var a=g(c.localStorage.getItem(k))||j(c.navigator.languages||[c.navigator.language||c.navigator.userLanguage])||g(m);i(a)}function f(){return l}function g(a){return d.findWhere(l,{countryCode:a})}function h(){return n}function i(d){n=d,b.use(d.language);try{c.localStorage.setItem(k,d.countryCode)}catch(a){}a.global.currentLang=d.language}function j(a,b){var c=a.map(function(a){return(""+a).toLowerCase()});b||(b=f());var d=null,e=null;return b.forEach(function(a){a.languageCodes.forEach(function(b){b=b.toLowerCase();var f=c.indexOf(b);f!==-1&&(null===e||f/a.languageCodes.length<e)&&(e=f/a.languageCodes.length,d=a)})}),d}var k="CountriesDataStore.currentCountryCode",l=[{countryCode:"ru",title:"Россия",languageCodes:["ru","ru-RU"],language:"ru"},{countryCode:"us",title:"USA",languageCodes:["us","en-US","en"],language:"en"},{countryCode:"ie",title:"Ireland",languageCodes:["ie","en-IE","ga-IE","gd-IE","ga","en-GB","en"],language:"en"}],m="ru",n=null;return e(),{getAvailableCountries:f,getCountryByCode:g,getCurrentCountry:h,setCurrentCountry:i,determineCountryByLanguage:j}}]),angular.module("literatorioApp").controller("HeaderCtrl",["$scope",function(a){function b(){a.isVisible=!1,a.$on("HeaderCtrl.doShow",d),a.$on("HeaderCtrl.doHide",c)}function c(){a.isVisible=!1}function d(){a.isVisible=!0}b()}]),angular.module("literatorioApp").service("SoundManager",["$injector",function(a){function b(a){c.getSound(a).start()}var c=null;try{c=a.get("SoundService"),c.loadSound({name:"bell",src:"resources/sounds/bell.mp3"})}catch(a){}return{playSound:b}}]),angular.module("literatorioApp").controller("ShareCtrl",["$scope","Analytics",function(a,b){function c(a){b.trackEvent("web","share-click",a)}a.shareUrl=window.location.href,a.shareTitle="",a.shareDescription="",a.shareImage="",a.onClick=c}]),angular.module("literatorioApp").controller("GitHubRibbonCtrl",["$scope","Analytics",function(a,b){function c(){a.isVisible=!1,a.$on("GitHubRibbonCtrl.doShow",e),a.$on("GitHubRibbonCtrl.doHide",d),a.onClick=f}function d(){a.isVisible=!1}function e(){a.isVisible=!0}function f(){b.trackEvent("web","git-hub-ribbon-click")}c()}]),angular.module("literatorioApp").run(["$templateCache",function(a){a.put("views/about.html",'<div class="view-about"> <h3>{{ \'VIEW_ABOUT_CREATOR_TITLE\' | translate }}</h3> <p><a href="http://bobrosoft.com" target="_blank">{{ \'VIEW_ABOUT_CREATOR_NAME\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_CONTRIBUTE_TITLE\' | translate }}</h3> <p><a href="https://github.com/bobrosoft/literator.io-verses" target="_blank">{{ \'VIEW_ABOUT_CONTRIBUTE_VERSES_REPO\' | translate }}</a></p> <p><a href="https://github.com/bobrosoft/literator.io" target="_blank">{{ \'VIEW_ABOUT_CONTRIBUTE_APP_REPO\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_VERSES_TITLE\' | translate }}</h3> <p>{{ \'VIEW_ABOUT_VERSES_DISCLAIMER\' | translate }}</p> <p>{{ \'VIEW_ABOUT_VERSES_HOW_TO_ADD\' | translate }} <a href="https://github.com/bobrosoft/literator.io-verses" target="_blank">{{ \'VIEW_ABOUT_VERSES_HOW_TO_ADD_LINK\' | translate }}</a></p> <h3>{{ \'VIEW_ABOUT_CONTACTS_TITLE\' | translate }}</h3> <p><a href="mailto:bobr@bobrosoft.com" target="_blank">bobr@bobrosoft.com</a></p> </div>'),a.put("views/countrymenu.html",'<li class="view-country-menu" ng-controller="CountryMenuCtrl"> <ul> <li ng-repeat="country in ::countries track by $index"><a href="" ng-click="onCountryChange(country)">{{ ::country.title }}</a></li> </ul> <a href="" class="main-link"><img src="images/main/country_menu_icon.png"> {{ currentCountry.title }}</a> </li>'),a.put("views/footer.html",'<div id="footer" ng-controller="FooterCtrl" ng-class="{show: isVisible}"> <div class="top-border"></div> <p class="main-phrase"> <a href="#/about">{{ \'FOOTER_MAIN_PHRASE_LEFT\' | translate }} <span class="heart">&#x2661;</span> {{ \'FOOTER_MAIN_PHRASE_RIGHT\' | translate }}</a> </p> </div>'),a.put("views/githubribbon.html",'<a ng-controller="GitHubRibbonCtrl" class="view-github-ribbon" ng-class="{show: isVisible}" href="https://github.com/bobrosoft/literator.io" target="_blank" ng-click="onClick()">Fork me on GitHub</a>'),a.put("views/header.html",'<ul id="header" ng-controller="HeaderCtrl" ng-class="{show: isVisible}"> <a class="logo" href="#/" ng-class="{show: global.currentPage != \'main\'}">{{ \'COMMON_APP_NAME\' | translate }}</a> <span class="spacer"></span> <ng-include src="\'views/countrymenu.html\'"></ng-include> </ul>'),a.put("views/main.html",'<div class="view-main" ng-class="{leaving: isLeaving}"> <div class="logo" ng-show="global.currentLang" itemscope itemtype="http://schema.org/Organization"> <a itemprop="url" href="http://literator.io/"> <img itemprop="logo" ng-src="images/main/logo_{{ global.currentLang == \'ru\' ? \'ru\' : \'en\' }}.png" alt="Literator.io"> </a> </div> <div class="menu"> <a href="" class="button start" ng-click="onStartButtonClick()">{{ \'VIEW_MAIN_START_BTN\' | translate }}</a> </div> </div>'),a.put("views/share.html",'<div class="view-share"> <a target="_blank" href="https://vk.com/share.php?url={{shareUrl | encodeURIComponent}}&title={{shareTitle | encodeURIComponent}}&description={{shareDescription | encodeURIComponent}}&image={{shareImage | encodeURIComponent}}&noparse=true" ng-click="onClick(\'vk\')" ng-include="\'images/common/share/vk.svg\'">Vkontakte</a> <a target="_blank" href="https://www.ok.ru/dk?st.cmd=addShare&st.s=1&st._surl={{shareUrl | encodeURIComponent}}&st.comments={{shareTitle | encodeURIComponent}}" ng-click="onClick(\'ok\')" ng-include="\'images/common/share/ok.svg\'">Odnoklassniki</a> <a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u={{shareUrl | encodeURIComponent}}" ng-click="onClick(\'facebook\')" ng-include="\'images/common/share/facebook.svg\'">Facebook</a> <a target="_blank" href="https://twitter.com/intent/tweet?url={{shareUrl | encodeURIComponent}}&text={{shareTitle | encodeURIComponent}}" ng-click="onClick(\'twitter\')" ng-include="\'images/common/share/twitter.svg\'">Twitter</a> </div>'),a.put("views/verse.html",'<div class="view-verse" ng-class="{leaving: isLeaving}"> <div> <div class="top" ng-show="verse.title"> <h1 class="title">{{ ::verse.title }}</h1> <p class="description">{{ ::verse.description }}</p> <img class="monogram" src="images/verse/mono-top.png"> </div> <div class="content"> <div> <div class="width-spacer">{{ ::verse.plainText }}</div> <div class="pieces"> <span ng-repeat="piece in versePieces track by $index">{{::piece + \'\'}}</span><input ng-class="{visible: currentBlock, hidden: !currentBlock}" ng-keyup="onInputFieldKeyup()" autocorrect="off" autocomplete="off" autocapitalize="off"> </div> <div class="author" ng-show="isFinished"> <p class="name">{{ ::author.shortName }}</p> <p class="year">{{ ::verse.year }} {{ \'VIEW_VERSE_SHORT_YEAR\' | translate }}</p> <img class="monogram" src="images/verse/mono-bottom.png"> </div> </div> </div> <div class="controls-hint" ng-class="{show: isControlsHintVisible}" ng-show="!isFinished"> <p>{{ (isIOS ? \'VIEW_VERSE_CONTROLS_HINT_IOS\' : \'VIEW_VERSE_CONTROLS_HINT\') | translate }}</p> </div> <div class="bottom"> <div class="ending" ng-show="isFinished"> <div class="result"> {{ \'VIEW_VERSE_RESULT_MESSAGE\' | translate }} <span class="time"><span ng-if="finishedInSeconds > 60">{{ finishedInSeconds / 60 | number: 0 }} {{ \'VIEW_VERSE_RESULT_MINUTES\' | translate }}</span> {{ finishedInSeconds % 60 | number: 0 }} {{ \'VIEW_VERSE_RESULT_SECONDS\' | translate }}</span> </div> <ng-include src="\'views/share.html\'" ng-if="verse.title" ng-controller="ShareCtrl" ng-init="tmp = (&quot;VIEW_VERSE_SHARE_TITLE_PRE&quot; | translate) + &quot; \\&quot;&quot; + verse.title + &quot;\\&quot;&quot;" onload="shareTitle=tmp"></ng-include> <div class="buttons"> <div><a href="" class="button another-verse" ng-click="onAnotherVerseButtonClick()">{{ \'VIEW_VERSE_ANOTHER_VERSE_BTN\' | translate }}</a></div> <div><a href="" class="button another-verse-of-author" ng-click="onAnotherVerseOfAuthorButtonClick()">{{ \'VIEW_VERSE_ANOTHER_VERSE_OF_AUTHOR_BTN\' | translate }}</a></div> </div> </div> </div> </div> </div>'),a.put("views/verse404.html",'<div class="view-verse404"> <div> <p class="number"><span>4</span><span>0</span><span>4</span></p> <img class="monogram" src="images/verse/mono-bottom.png"> <p class="message">{{ \'VIEW_VERSE_404_MESSAGE\' | translate }}</p> </div> </div>')}]);