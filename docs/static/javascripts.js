/***
 * main.js für stumpp labor
 * 
 *
 */
 
 
/* das sind die beiden Buttons oben links im Header */
const buttonLogin = document.getElementById('layoutLogin');
let statusLogin = 0;

/*** initialization on document ready ***/

document.addEventListener("DOMContentLoaded", function(event) {

	if (buttonLogin) {
		setLucideStroke(buttonLogin, 'transparent', 1);
		buttonLogin.addEventListener('click', loginUser);
		setLucideStroke(buttonLogin, '#888', 1);

	}

	displayMain();
  // intervalTimer(true);  --> wird nur in "tim.njk" gestartet
});
 
function loginUser() {
	const stateColor = [ '#888', 'yellow', '#6F9'];
	const stateStroke = [1,1,2];
	if (++statusLogin > 2) statusLogin = 0;
	setLucideStroke(buttonLogin, stateColor[statusLogin], stateStroke[statusLogin]);
}


/***
 * Diese Funktion wird vom Button im Footer unten links aufgerufen,
 * um die Sichtbarkeit der Footerzeile umzuschalten.
 */
function footerToggleVisibility() {
  var domX = document.getElementById("layoutCopyright");
  if (domX.style.display === "none") {
    domX.style.display = "block";
  } else {
    domX.style.display = "none";
  }
}

/**
 * Decryption for <ms-crypted> Tag
 * 
 * parameters
 * 	  password	- password to decrypt content
 *    errorMsg  - message displayed if decryption fails
 * 				  empty string hides crypted block on error.
 *    errorClasses - CSS class string for errorMsg
 **/

function contentDecryption(password, errorMsg = "", errorClasses = "") {
	//~ console.log("content Decryption", password, errorMsg, errorClasses);
	const cryptedElements = document.getElementsByTagName("ms-crypted");
	for (let i = 0; i < cryptedElements.length; i++) {
		const e = cryptedElements[i];
		const c = e.getAttribute("data-content"); 
		e.style.display = "block";	
		try {
			e.innerHTML = sjcl.decrypt(password, c); 
			e.removeAttribute("data-content");	// remove only if successfully decrypted
		} catch(err) { 
			if (! errorMsg)
				 e.style.display = "none";
			else e.innerHTML = `<p class="${errorClasses}">${errorMsg}</p>`; 
		}
	}
}

/**
 * Encrytion is placed in "eleventy.config.js"
 * Make sure, "eleventy.config.js" contains …
 * 
 *		const sjcl = require("sjcl");
 * 
 *   	eleventyConfig.addPairedShortcode("crypt", function(content, password = "", classList="") { 
 * 		return `<ms-crypted style='display:none' class='${classList}' `
 * 			 + "data-content='" + sjcl.encrypt(password, content) + "'>"
 * 			 + "Content is encrypted.<br>Inhalt ist verschlüsselt.<br>El contenido está encriptado."
 * 			 + "</ms-crypted>";
 * 		});
 * 
 * This code ensures, that all content inside the shortcode will be 
 * stored crypted in the HTML output. Optional classlist is separated
 * by "," in Nunjucks and by " " in Liquid.
 * 
 * Usage:
 * 			<ms-crypted style='display:none' class='' data-content='{"iv":"hycTBLp0n9YfNlqTIChXUw==","v":1,"iter":10000,"ks":128,"ts":64,"mode":"ccm","adata":"","cipher":"aes","salt":"7hgWriqvNiY=","ct":"bALrNmAWOnRj+3VtYJRiXb5WJ38VgMkaD0hL7Gr4Fq8PpL1JCkOE"}'>Content is encrypted.<br>Inhalt ist verschlüsselt.<br>El contenido está encriptado.</ms-crypted>
 * 
 * Additionally call "contentDecryption" on DOMContentLoaded event to decrypt:
 * 
 * 			document.addEventListener("DOMContentLoaded", function(event) {	contentDecryption(password); });	
 * 
 **/


/***
 *	utility.js - Javascript Helpers
 * 
 *	Copyright 2024 Michael Stumpp (michael@stumpp.name)
 *
 * 07.01.2024 completly new - bundling JS
 * 04.03.2025 displayTag()
 * 05.03.2025 displayClass()
 * 06.03.2025 get random int
 *
 * *********************************************************************
 *	setLucideStroke	Setzen von Farbe und Strichstärke von Lucide Icons
 *	displayMain		Anzeigen | Verbergen der <main> Sektionen 
 *	displayTag		Anzeigen | Verbergen getaggter Sektionen 
 *	displayClass	Anzeigen | Verbergen geclasster Sektionen 
 *	openModal		Modal-Fenster anzeigen
 *	closeModal		Modal-Fenster schließen
 *	sendMail		Senden von Mails über Mail Client
 *	copyToClipboard	Text ins Clipboard schreiben
 *	getRandomInt	zufällige Integer-Zahl
 */



/**
 * 	Diese Funktion setzt Farbe und Breite eines Lucide Icons, wenn man das 'parent' Element übergibt.
 *	Das sollte auch mit jedem anderen SVG Childnode funktionieren.
 *
 **/
	
function setLucideStroke (parentElement, strokeColor = '#FFF', strokeWidth = 2) {
	if (! parentElement) return;
	const svgList = parentElement.getElementsByTagName("svg");
	for (let i = 0; i < svgList.length; i++) {
		svgList[i].getAttributeNode("stroke").value = strokeColor;
		svgList[i].getAttributeNode("stroke-width").value = strokeWidth;
	}
}
	

/**	********************************************************************
 *	-hwn- Funktionen für die GUI
 **	********************************************************************
 *
 *	displayMain		Anzeigen | Verbergen der <main> Sektionen 
 *	displayTag		Anzeigen | Verbergen getaggter Sektionen 
 *	displayClass	Anzeigen | Verbergen geclasster Sektionen 
 *	openModal		Modal-Fenster anzeigen
 *	closeModal		Modal-Fenster schließen
 */


function displayMain(state=true) {
	const nodes = document.getElementsByTagName('main');
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].style.display = (state) ? "block" : "none";
	}
}
function displayTag(tagName='main', state=true) {
	const nodes = document.getElementsByTagName(tagName);
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].style.display = (state) ? "block" : "none";
	}
}

function displayClass(className='none', state=true) {
	const nodes = document.getElementsByClassName(className);
	for (let i = 0; i < nodes.length; i++) {
		nodes[i].style.display = (state) ? "block" : "none";
	}
}

function openModal(modalName) {
	document.getElementById(modalName).style.display='block';
}

function closeModal(modalName) {
	document.getElementById(modalName).style.display='none';
}

/** sendMail
 *
 *	origin: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
 *
 */

function sendMail(receiver, subject, body, closewindow=false) {
	const link = 'mailto:' + receiver
			   + '?subject=' + encodeURIComponent(subject)
			   + '&body=' + encodeURIComponent(body.replace('&', '&amp;'));
	const win = window.open(link);
	if (closewindow) win.close();
}

/** copyToClipboard
 *
 *	origin: https://stackoverflow.com/questions/51805395/navigator-clipboard-is-undefined
 *
 */

async function copyToClipboard(textToCopy) {
    // Navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
    } else {
        // Use the 'out of viewport hidden text area' trick
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;

        // Move textarea out of the viewport so it's not visible
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";

        document.body.prepend(textArea);
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
	}
}

/** getRandomInt
 *
 *	liefert eine Integer zwischen min und max-1
 *  würfeön mit getRandomInt(1,7);
 *
 */

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}


"use strict";var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(t){this.toString=function(){return"CORRUPT: "+this.message},this.message=t},invalid:function(t){this.toString=function(){return"INVALID: "+this.message},this.message=t},bug:function(t){this.toString=function(){return"BUG: "+this.message},this.message=t},notReady:function(t){this.toString=function(){return"NOT READY: "+this.message},this.message=t}}};function t(t,e,i){if(4!==e.length)throw new sjcl.exception.invalid("invalid aes block size");var c=t.b[i],s=e[0]^c[0],n=e[i?3:1]^c[1],r=e[2]^c[2];e=e[i?1:3]^c[3];var o,a,l,h,d=c.length/4-2,u=4,f=[0,0,0,0];t=(o=t.s[i])[0];var p=o[1],m=o[2],j=o[3],y=o[4];for(h=0;h<d;h++)o=t[s>>>24]^p[n>>16&255]^m[r>>8&255]^j[255&e]^c[u],a=t[n>>>24]^p[r>>16&255]^m[e>>8&255]^j[255&s]^c[u+1],l=t[r>>>24]^p[e>>16&255]^m[s>>8&255]^j[255&n]^c[u+2],e=t[e>>>24]^p[s>>16&255]^m[n>>8&255]^j[255&r]^c[u+3],u+=4,s=o,n=a,r=l;for(h=0;h<4;h++)f[i?3&-h:h]=y[s>>>24]<<24^y[n>>16&255]<<16^y[r>>8&255]<<8^y[255&e]^c[u++],o=s,s=n,n=r,r=e,e=o;return f}function u(t,e){var i,c,s,n=t.F,r=t.b,o=n[0],a=n[1],l=n[2],h=n[3],d=n[4],u=n[5],f=n[6],p=n[7];for(i=0;i<64;i++)c=(c=i<16?e[i]:(c=e[i+1&15],s=e[i+14&15],e[15&i]=(c>>>7^c>>>18^c>>>3^c<<25^c<<14)+(s>>>17^s>>>19^s>>>10^s<<15^s<<13)+e[15&i]+e[i+9&15]|0))+p+(d>>>6^d>>>11^d>>>25^d<<26^d<<21^d<<7)+(f^d&(u^f))+r[i],p=f,f=u,u=d,d=h+c|0,h=l,l=a,o=c+((a=o)&l^h&(a^l))+(a>>>2^a>>>13^a>>>22^a<<30^a<<19^a<<10)|0;n[0]=n[0]+o|0,n[1]=n[1]+a|0,n[2]=n[2]+l|0,n[3]=n[3]+h|0,n[4]=n[4]+d|0,n[5]=n[5]+u|0,n[6]=n[6]+f|0,n[7]=n[7]+p|0}function A(t,e){var i,c=sjcl.random.K[t],s=[];for(i in c)c.hasOwnProperty(i)&&s.push(c[i]);for(i=0;i<s.length;i++)s[i](e)}function C(t,e){"undefined"!=typeof window&&window.performance&&"function"==typeof window.performance.now?t.addEntropy(window.performance.now(),e,"loadtime"):t.addEntropy((new Date).valueOf(),e,"loadtime")}function y(t){t.b=z(t).concat(z(t)),t.L=new sjcl.cipher.aes(t.b)}function z(t){for(var e=0;e<4&&(t.h[e]=t.h[e]+1|0,!t.h[e]);e++);return t.L.encrypt(t.h)}function B(t,e){return function(){e.apply(t,arguments)}}sjcl.cipher.aes=function(t){this.s[0][0][0]||this.O();var e,i,c,s,n=this.s[0][4],r=this.s[1],o=1;if(4!==(e=t.length)&&6!==e&&8!==e)throw new sjcl.exception.invalid("invalid aes key size");for(this.b=[c=t.slice(0),s=[]],t=e;t<4*e+28;t++)i=c[t-1],(0==t%e||8===e&&4==t%e)&&(i=n[i>>>24]<<24^n[i>>16&255]<<16^n[i>>8&255]<<8^n[255&i],0==t%e&&(i=i<<8^i>>>24^o<<24,o=o<<1^283*(o>>7))),c[t]=c[t-e]^i;for(e=0;t;e++,t--)i=c[3&e?t:t-4],s[e]=t<=4||e<4?i:r[0][n[i>>>24]]^r[1][n[i>>16&255]]^r[2][n[i>>8&255]]^r[3][n[255&i]]},sjcl.cipher.aes.prototype={encrypt:function(e){return t(this,e,0)},decrypt:function(e){return t(this,e,1)},s:[[[],[],[],[],[]],[[],[],[],[],[]]],O:function(){var t,e,i,c,s,n,r,o=this.s[0],a=this.s[1],l=o[4],h=a[4],d=[],u=[];for(t=0;t<256;t++)u[(d[t]=t<<1^283*(t>>7))^t]=t;for(e=i=0;!l[e];e^=c||1,i=u[i]||1)for(n=(n=i^i<<1^i<<2^i<<3^i<<4)>>8^255&n^99,r=16843009*(s=d[t=d[c=d[h[l[e]=n]=e]]])^65537*t^257*c^16843008*e,s=257*d[n]^16843008*n,t=0;t<4;t++)o[t][e]=s=s<<24^s>>>8,a[t][n]=r=r<<24^r>>>8;for(t=0;t<5;t++)o[t]=o[t].slice(0),a[t]=a[t].slice(0)}},sjcl.bitArray={bitSlice:function(t,e,i){return t=sjcl.bitArray.$(t.slice(e/32),32-(31&e)).slice(1),void 0===i?t:sjcl.bitArray.clamp(t,i-e)},extract:function(t,e,i){var c=Math.floor(-e-i&31);return(-32&(e+i-1^e)?t[e/32|0]<<32-c^t[e/32+1|0]>>>c:t[e/32|0]>>>c)&(1<<i)-1},concat:function(t,e){if(0===t.length||0===e.length)return t.concat(e);var i=t[t.length-1],c=sjcl.bitArray.getPartial(i);return 32===c?t.concat(e):sjcl.bitArray.$(e,c,0|i,t.slice(0,t.length-1))},bitLength:function(t){var e=t.length;return 0===e?0:32*(e-1)+sjcl.bitArray.getPartial(t[e-1])},clamp:function(t,e){if(32*t.length<e)return t;var i=(t=t.slice(0,Math.ceil(e/32))).length;return e&=31,0<i&&e&&(t[i-1]=sjcl.bitArray.partial(e,t[i-1]&2147483648>>e-1,1)),t},partial:function(t,e,i){return 32===t?e:(i?0|e:e<<32-t)+1099511627776*t},getPartial:function(t){return Math.round(t/1099511627776)||32},equal:function(t,e){if(sjcl.bitArray.bitLength(t)!==sjcl.bitArray.bitLength(e))return!1;var i,c=0;for(i=0;i<t.length;i++)c|=t[i]^e[i];return 0===c},$:function(t,e,i,c){var s;for(void(s=0)===c&&(c=[]);32<=e;e-=32)c.push(i),i=0;if(0===e)return c.concat(t);for(s=0;s<t.length;s++)c.push(i|t[s]>>>e),i=t[s]<<32-e;return s=t.length?t[t.length-1]:0,t=sjcl.bitArray.getPartial(s),c.push(sjcl.bitArray.partial(e+t&31,32<e+t?i:c.pop(),1)),c},i:function(t,e){return[t[0]^e[0],t[1]^e[1],t[2]^e[2],t[3]^e[3]]},byteswapM:function(t){var e,i;for(e=0;e<t.length;++e)i=t[e],t[e]=i>>>24|i>>>8&65280|(65280&i)<<8|i<<24;return t}},sjcl.codec.utf8String={fromBits:function(t){var e,i,c="",s=sjcl.bitArray.bitLength(t);for(e=0;e<s/8;e++)0==(3&e)&&(i=t[e/4]),c+=String.fromCharCode(i>>>8>>>8>>>8),i<<=8;return decodeURIComponent(escape(c))},toBits:function(t){t=unescape(encodeURIComponent(t));var e,i=[],c=0;for(e=0;e<t.length;e++)c=c<<8|t.charCodeAt(e),3==(3&e)&&(i.push(c),c=0);return 3&e&&i.push(sjcl.bitArray.partial(8*(3&e),c)),i}},sjcl.codec.hex={fromBits:function(t){var e,i="";for(e=0;e<t.length;e++)i+=(0xf00000000000+(0|t[e])).toString(16).substr(4);return i.substr(0,sjcl.bitArray.bitLength(t)/4)},toBits:function(t){var e,i,c=[];for(i=(t=t.replace(/\s|0x/g,"")).length,t+="00000000",e=0;e<t.length;e+=8)c.push(0^parseInt(t.substr(e,8),16));return sjcl.bitArray.clamp(c,4*i)}},sjcl.codec.base32={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",X:"0123456789ABCDEFGHIJKLMNOPQRSTUV",BITS:32,BASE:5,REMAINING:27,fromBits:function(t,e,i){var c=sjcl.codec.base32.BASE,s=sjcl.codec.base32.REMAINING,n="",r=0,o=sjcl.codec.base32.B,a=0,l=sjcl.bitArray.bitLength(t);for(i&&(o=sjcl.codec.base32.X),i=0;n.length*c<l;)n+=o.charAt((a^t[i]>>>r)>>>s),r<c?(a=t[i]<<c-r,r+=s,i++):(a<<=c,r-=c);for(;7&n.length&&!e;)n+="=";return n},toBits:function(t,e){t=t.replace(/\s|=/g,"").toUpperCase();var i,c,s=sjcl.codec.base32.BITS,n=sjcl.codec.base32.BASE,r=sjcl.codec.base32.REMAINING,o=[],a=0,l=sjcl.codec.base32.B,h=0,d="base32";for(e&&(l=sjcl.codec.base32.X,d="base32hex"),i=0;i<t.length;i++){if((c=l.indexOf(t.charAt(i)))<0){if(!e)try{return sjcl.codec.base32hex.toBits(t)}catch(t){}throw new sjcl.exception.invalid("this isn't "+d+"!")}r<a?(a-=r,o.push(h^c>>>a),h=c<<s-a):h^=c<<s-(a+=n)}return 56&a&&o.push(sjcl.bitArray.partial(56&a,h,1)),o}},sjcl.codec.base32hex={fromBits:function(t,e){return sjcl.codec.base32.fromBits(t,e,1)},toBits:function(t){return sjcl.codec.base32.toBits(t,1)}},sjcl.codec.base64={B:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",fromBits:function(t,e,i){var c="",s=0,n=sjcl.codec.base64.B,r=0,o=sjcl.bitArray.bitLength(t);for(i&&(n=n.substr(0,62)+"-_"),i=0;6*c.length<o;)c+=n.charAt((r^t[i]>>>s)>>>26),s<6?(r=t[i]<<6-s,s+=26,i++):(r<<=6,s-=6);for(;3&c.length&&!e;)c+="=";return c},toBits:function(t,e){t=t.replace(/\s|=/g,"");var i,c,s=[],n=0,r=sjcl.codec.base64.B,o=0;for(e&&(r=r.substr(0,62)+"-_"),i=0;i<t.length;i++){if((c=r.indexOf(t.charAt(i)))<0)throw new sjcl.exception.invalid("this isn't base64!");26<n?(n-=26,s.push(o^c>>>n),o=c<<32-n):o^=c<<32-(n+=6)}return 56&n&&s.push(sjcl.bitArray.partial(56&n,o,1)),s}},sjcl.codec.base64url={fromBits:function(t){return sjcl.codec.base64.fromBits(t,1,1)},toBits:function(t){return sjcl.codec.base64.toBits(t,1)}},sjcl.hash.sha256=function(t){this.b[0]||this.O(),t?(this.F=t.F.slice(0),this.A=t.A.slice(0),this.l=t.l):this.reset()},sjcl.hash.sha256.hash=function(t){return(new sjcl.hash.sha256).update(t).finalize()},sjcl.hash.sha256.prototype={blockSize:512,reset:function(){return this.F=this.Y.slice(0),this.A=[],this.l=0,this},update:function(t){"string"==typeof t&&(t=sjcl.codec.utf8String.toBits(t));var e,i=this.A=sjcl.bitArray.concat(this.A,t);if(e=this.l,9007199254740991<(t=this.l=e+sjcl.bitArray.bitLength(t)))throw new sjcl.exception.invalid("Cannot hash more than 2^53 - 1 bits");if("undefined"!=typeof Uint32Array){var c=new Uint32Array(i),s=0;for(e=512+e-(512+e&511);e<=t;e+=512)u(this,c.subarray(16*s,16*(s+1))),s+=1;i.splice(0,16*s)}else for(e=512+e-(512+e&511);e<=t;e+=512)u(this,i.splice(0,16));return this},finalize:function(){var t,e=this.A,i=this.F;for(t=(e=sjcl.bitArray.concat(e,[sjcl.bitArray.partial(1,1)])).length+2;15&t;t++)e.push(0);for(e.push(Math.floor(this.l/4294967296)),e.push(0|this.l);e.length;)u(this,e.splice(0,16));return this.reset(),i},Y:[],b:[],O:function(){function t(t){return 4294967296*(t-Math.floor(t))|0}for(var e,i,c=0,s=2;c<64;s++){for(i=!0,e=2;e*e<=s;e++)if(0==s%e){i=!1;break}i&&(c<8&&(this.Y[c]=t(Math.pow(s,.5))),this.b[c]=t(Math.pow(s,1/3)),c++)}}},sjcl.mode.ccm={name:"ccm",G:[],listenProgress:function(t){sjcl.mode.ccm.G.push(t)},unListenProgress:function(t){-1<(t=sjcl.mode.ccm.G.indexOf(t))&&sjcl.mode.ccm.G.splice(t,1)},fa:function(t){var e,i=sjcl.mode.ccm.G.slice();for(e=0;e<i.length;e+=1)i[e](t)},encrypt:function(t,e,i,c,s){var n,r=e.slice(0),o=sjcl.bitArray,a=o.bitLength(i)/8,l=o.bitLength(r)/8;if(s=s||64,c=c||[],a<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(n=2;n<4&&l>>>8*n;n++);return n<15-a&&(n=15-a),i=o.clamp(i,8*(15-n)),e=sjcl.mode.ccm.V(t,e,i,c,s,n),r=sjcl.mode.ccm.C(t,r,i,e,s,n),o.concat(r.data,r.tag)},decrypt:function(t,e,i,c,s){s=s||64,c=c||[];var n=sjcl.bitArray,r=n.bitLength(i)/8,o=n.bitLength(e),a=n.clamp(e,o-s),l=n.bitSlice(e,o-s);o=(o-s)/8;if(r<7)throw new sjcl.exception.invalid("ccm: iv must be at least 7 bytes");for(e=2;e<4&&o>>>8*e;e++);if(e<15-r&&(e=15-r),i=n.clamp(i,8*(15-e)),a=sjcl.mode.ccm.C(t,a,i,l,s,e),t=sjcl.mode.ccm.V(t,a.data,i,c,s,e),!n.equal(a.tag,t))throw new sjcl.exception.corrupt("ccm: tag doesn't match");return a.data},na:function(t,e,i,c,s,n){var r=[],o=sjcl.bitArray,a=o.i;if(c=[o.partial(8,(e.length?64:0)|c-2<<2|n-1)],(c=o.concat(c,i))[3]|=s,c=t.encrypt(c),e.length)for((i=o.bitLength(e)/8)<=65279?r=[o.partial(16,i)]:i<=4294967295&&(r=o.concat([o.partial(16,65534)],[i])),r=o.concat(r,e),e=0;e<r.length;e+=4)c=t.encrypt(a(c,r.slice(e,e+4).concat([0,0,0])));return c},V:function(t,e,i,c,s,n){var r=sjcl.bitArray,o=r.i;if((s/=8)%2||s<4||16<s)throw new sjcl.exception.invalid("ccm: invalid tag length");if(4294967295<c.length||4294967295<e.length)throw new sjcl.exception.bug("ccm: can't deal with 4GiB or more data");for(i=sjcl.mode.ccm.na(t,c,i,s,r.bitLength(e)/8,n),c=0;c<e.length;c+=4)i=t.encrypt(o(i,e.slice(c,c+4).concat([0,0,0])));return r.clamp(i,8*s)},C:function(t,e,i,c,s,n){var r,o=sjcl.bitArray;r=o.i;var a=e.length,l=o.bitLength(e),h=a/50,d=h;if(i=o.concat([o.partial(8,n-1)],i).concat([0,0,0]).slice(0,4),c=o.bitSlice(r(c,t.encrypt(i)),0,s),!a)return{tag:c,data:[]};for(r=0;r<a;r+=4)h<r&&(sjcl.mode.ccm.fa(r/a),h+=d),i[3]++,s=t.encrypt(i),e[r]^=s[0],e[r+1]^=s[1],e[r+2]^=s[2],e[r+3]^=s[3];return{tag:c,data:o.clamp(e,l)}}},sjcl.mode.ocb2={name:"ocb2",encrypt:function(t,e,i,c,s,n){if(128!==sjcl.bitArray.bitLength(i))throw new sjcl.exception.invalid("ocb iv must be 128 bits");var r,o=sjcl.mode.ocb2.S,a=sjcl.bitArray,l=a.i,h=[0,0,0,0];i=o(t.encrypt(i));var d,u=[];for(c=c||[],s=s||64,r=0;r+4<e.length;r+=4)h=l(h,d=e.slice(r,r+4)),u=u.concat(l(i,t.encrypt(l(i,d)))),i=o(i);return d=e.slice(r),e=a.bitLength(d),r=t.encrypt(l(i,[0,0,0,e])),h=l(h,l((d=a.clamp(l(d.concat([0,0,0]),r),e)).concat([0,0,0]),r)),h=t.encrypt(l(h,l(i,o(i)))),c.length&&(h=l(h,n?c:sjcl.mode.ocb2.pmac(t,c))),u.concat(a.concat(d,a.clamp(h,s)))},decrypt:function(t,e,i,c,s,n){if(128!==sjcl.bitArray.bitLength(i))throw new sjcl.exception.invalid("ocb iv must be 128 bits");s=s||64;var r,o,a=sjcl.mode.ocb2.S,l=sjcl.bitArray,h=l.i,d=[0,0,0,0],u=a(t.encrypt(i)),f=sjcl.bitArray.bitLength(e)-s,p=[];for(c=c||[],i=0;i+4<f/32;i+=4)d=h(d,r=h(u,t.decrypt(h(u,e.slice(i,i+4))))),p=p.concat(r),u=a(u);if(o=f-32*i,d=h(d,r=h(r=t.encrypt(h(u,[0,0,0,o])),l.clamp(e.slice(i),o).concat([0,0,0]))),d=t.encrypt(h(d,h(u,a(u)))),c.length&&(d=h(d,n?c:sjcl.mode.ocb2.pmac(t,c))),!l.equal(l.clamp(d,s),l.bitSlice(e,f)))throw new sjcl.exception.corrupt("ocb: tag doesn't match");return p.concat(l.clamp(r,o))},pmac:function(t,e){var i,c=sjcl.mode.ocb2.S,s=sjcl.bitArray,n=s.i,r=[0,0,0,0],o=n(o=t.encrypt([0,0,0,0]),c(c(o)));for(i=0;i+4<e.length;i+=4)o=c(o),r=n(r,t.encrypt(n(o,e.slice(i,i+4))));return i=e.slice(i),s.bitLength(i)<128&&(o=n(o,c(o)),i=s.concat(i,[-2147483648,0,0,0])),r=n(r,i),t.encrypt(n(c(n(o,c(o))),r))},S:function(t){return[t[0]<<1^t[1]>>>31,t[1]<<1^t[2]>>>31,t[2]<<1^t[3]>>>31,t[3]<<1^135*(t[0]>>>31)]}},sjcl.mode.gcm={name:"gcm",encrypt:function(t,e,i,c,s){var n=e.slice(0);return e=sjcl.bitArray,c=c||[],t=sjcl.mode.gcm.C(!0,t,n,c,i,s||128),e.concat(t.data,t.tag)},decrypt:function(t,e,i,c,s){var n=e.slice(0),r=sjcl.bitArray,o=r.bitLength(n);if(c=c||[],n=(s=s||128)<=o?(e=r.bitSlice(n,o-s),r.bitSlice(n,0,o-s)):(e=n,[]),t=sjcl.mode.gcm.C(!1,t,n,c,i,s),!r.equal(t.tag,e))throw new sjcl.exception.corrupt("gcm: tag doesn't match");return t.data},ka:function(t,e){var i,c,s,n,r,o=sjcl.bitArray.i;for(s=[0,0,0,0],n=e.slice(0),i=0;i<128;i++){for((c=0!=(t[Math.floor(i/32)]&1<<31-i%32))&&(s=o(s,n)),r=0!=(1&n[3]),c=3;0<c;c--)n[c]=n[c]>>>1|(1&n[c-1])<<31;n[0]>>>=1,r&&(n[0]^=-520093696)}return s},j:function(t,e,i){var c,s=i.length;for(e=e.slice(0),c=0;c<s;c+=4)e[0]^=4294967295&i[c],e[1]^=4294967295&i[c+1],e[2]^=4294967295&i[c+2],e[3]^=4294967295&i[c+3],e=sjcl.mode.gcm.ka(e,t);return e},C:function(t,e,i,c,s,n){var r,o,a,l,h,d,u,f,p=sjcl.bitArray;for(d=i.length,u=p.bitLength(i),f=p.bitLength(c),o=p.bitLength(s),r=e.encrypt([0,0,0,0]),s=96===o?(s=s.slice(0),p.concat(s,[1])):(s=sjcl.mode.gcm.j(r,[0,0,0,0],s),sjcl.mode.gcm.j(r,s,[0,0,Math.floor(o/4294967296),4294967295&o])),o=sjcl.mode.gcm.j(r,[0,0,0,0],c),h=s.slice(0),c=o.slice(0),t||(c=sjcl.mode.gcm.j(r,o,i)),l=0;l<d;l+=4)h[3]++,a=e.encrypt(h),i[l]^=a[0],i[l+1]^=a[1],i[l+2]^=a[2],i[l+3]^=a[3];return i=p.clamp(i,u),t&&(c=sjcl.mode.gcm.j(r,o,i)),t=[Math.floor(f/4294967296),4294967295&f,Math.floor(u/4294967296),4294967295&u],c=sjcl.mode.gcm.j(r,c,t),a=e.encrypt(s),c[0]^=a[0],c[1]^=a[1],c[2]^=a[2],c[3]^=a[3],{tag:p.bitSlice(c,0,n),data:i}}},sjcl.misc.hmac=function(t,e){this.W=e=e||sjcl.hash.sha256;var i,c=[[],[]],s=e.prototype.blockSize/32;for(this.w=[new e,new e],t.length>s&&(t=e.hash(t)),i=0;i<s;i++)c[0][i]=909522486^t[i],c[1][i]=1549556828^t[i];this.w[0].update(c[0]),this.w[1].update(c[1]),this.R=new e(this.w[0])},sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(t){if(this.aa)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");return this.update(t),this.digest(t)},sjcl.misc.hmac.prototype.reset=function(){this.R=new this.W(this.w[0]),this.aa=!1},sjcl.misc.hmac.prototype.update=function(t){this.aa=!0,this.R.update(t)},sjcl.misc.hmac.prototype.digest=function(){var t=this.R.finalize();t=new this.W(this.w[1]).update(t).finalize();return this.reset(),t},sjcl.misc.pbkdf2=function(t,e,i,c,s){if(i=i||1e4,c<0||i<0)throw new sjcl.exception.invalid("invalid params to pbkdf2");"string"==typeof t&&(t=sjcl.codec.utf8String.toBits(t)),"string"==typeof e&&(e=sjcl.codec.utf8String.toBits(e)),t=new(s=s||sjcl.misc.hmac)(t);var n,r,o,a,l=[],h=sjcl.bitArray;for(a=1;32*l.length<(c||1);a++){for(s=n=t.encrypt(h.concat(e,[a])),r=1;r<i;r++)for(n=t.encrypt(n),o=0;o<n.length;o++)s[o]^=n[o];l=l.concat(s)}return c&&(l=h.clamp(l,c)),l},sjcl.prng=function(t){this.c=[new sjcl.hash.sha256],this.m=[0],this.P=0,this.H={},this.N=0,this.U={},this.Z=this.f=this.o=this.ha=0,this.b=[0,0,0,0,0,0,0,0],this.h=[0,0,0,0],this.L=void 0,this.M=t,this.D=!1,this.K={progress:{},seeded:{}},this.u=this.ga=0,this.I=1,this.J=2,this.ca=65536,this.T=[0,48,64,96,128,192,256,384,512,768,1024],this.da=3e4,this.ba=80},sjcl.prng.prototype={randomWords:function(t,e){var i,c,s=[];if((i=this.isReady(e))===this.u)throw new sjcl.exception.notReady("generator isn't seeded");if(i&this.J){i=!(i&this.I),c=[];var n,r=0;for(this.Z=c[0]=(new Date).valueOf()+this.da,n=0;n<16;n++)c.push(4294967296*Math.random()|0);for(n=0;n<this.c.length&&(c=c.concat(this.c[n].finalize()),r+=this.m[n],this.m[n]=0,i||!(this.P&1<<n));n++);for(this.P>=1<<this.c.length&&(this.c.push(new sjcl.hash.sha256),this.m.push(0)),this.f-=r,r>this.o&&(this.o=r),this.P++,this.b=sjcl.hash.sha256.hash(this.b.concat(c)),this.L=new sjcl.cipher.aes(this.b),i=0;i<4&&(this.h[i]=this.h[i]+1|0,!this.h[i]);i++);}for(i=0;i<t;i+=4)0==(i+1)%this.ca&&y(this),c=z(this),s.push(c[0],c[1],c[2],c[3]);return y(this),s.slice(0,t)},setDefaultParanoia:function(t,e){if(0===t&&"Setting paranoia=0 will ruin your security; use it only for testing"!==e)throw new sjcl.exception.invalid("Setting paranoia=0 will ruin your security; use it only for testing");this.M=t},addEntropy:function(t,e,i){i=i||"user";var c,s,n=(new Date).valueOf(),r=this.H[i],o=this.isReady(),a=0;switch(void 0===(c=this.U[i])&&(c=this.U[i]=this.ha++),void 0===r&&(r=this.H[i]=0),this.H[i]=(this.H[i]+1)%this.c.length,typeof t){case"number":void 0===e&&(e=1),this.c[r].update([c,this.N++,1,e,n,1,0|t]);break;case"object":if("[object Uint32Array]"===(i=Object.prototype.toString.call(t))){for(s=[],i=0;i<t.length;i++)s.push(t[i]);t=s}else for("[object Array]"!==i&&(a=1),i=0;i<t.length&&!a;i++)"number"!=typeof t[i]&&(a=1);if(!a){if(void 0===e)for(i=e=0;i<t.length;i++)for(s=t[i];0<s;)e++,s>>>=1;this.c[r].update([c,this.N++,2,e,n,t.length].concat(t))}break;case"string":void 0===e&&(e=t.length),this.c[r].update([c,this.N++,3,e,n,t.length]),this.c[r].update(t);break;default:a=1}if(a)throw new sjcl.exception.bug("random: addEntropy only supports number, array of numbers or string");this.m[r]+=e,this.f+=e,o===this.u&&(this.isReady()!==this.u&&A("seeded",Math.max(this.o,this.f)),A("progress",this.getProgress()))},isReady:function(t){return t=this.T[void 0!==t?t:this.M],this.o&&this.o>=t?this.m[0]>this.ba&&(new Date).valueOf()>this.Z?this.J|this.I:this.I:this.f>=t?this.J|this.u:this.u},getProgress:function(t){return t=this.T[t||this.M],this.o>=t?1:this.f>t?1:this.f/t},startCollectors:function(){if(!this.D){if(this.a={loadTimeCollector:B(this,this.ma),mouseCollector:B(this,this.oa),keyboardCollector:B(this,this.la),accelerometerCollector:B(this,this.ea),touchCollector:B(this,this.qa)},window.addEventListener)window.addEventListener("load",this.a.loadTimeCollector,!1),window.addEventListener("mousemove",this.a.mouseCollector,!1),window.addEventListener("keypress",this.a.keyboardCollector,!1),window.addEventListener("devicemotion",this.a.accelerometerCollector,!1),window.addEventListener("touchmove",this.a.touchCollector,!1);else{if(!document.attachEvent)throw new sjcl.exception.bug("can't attach event");document.attachEvent("onload",this.a.loadTimeCollector),document.attachEvent("onmousemove",this.a.mouseCollector),document.attachEvent("keypress",this.a.keyboardCollector)}this.D=!0}},stopCollectors:function(){this.D&&(window.removeEventListener?(window.removeEventListener("load",this.a.loadTimeCollector,!1),window.removeEventListener("mousemove",this.a.mouseCollector,!1),window.removeEventListener("keypress",this.a.keyboardCollector,!1),window.removeEventListener("devicemotion",this.a.accelerometerCollector,!1),window.removeEventListener("touchmove",this.a.touchCollector,!1)):document.detachEvent&&(document.detachEvent("onload",this.a.loadTimeCollector),document.detachEvent("onmousemove",this.a.mouseCollector),document.detachEvent("keypress",this.a.keyboardCollector)),this.D=!1)},addEventListener:function(t,e){this.K[t][this.ga++]=e},removeEventListener:function(t,e){var i,c,s=this.K[t],n=[];for(c in s)s.hasOwnProperty(c)&&s[c]===e&&n.push(c);for(i=0;i<n.length;i++)delete s[c=n[i]]},la:function(){C(this,1)},oa:function(t){var e,i;try{e=t.x||t.clientX||t.offsetX||0,i=t.y||t.clientY||t.offsetY||0}catch(t){i=e=0}0!=e&&0!=i&&this.addEntropy([e,i],2,"mouse"),C(this,0)},qa:function(t){t=t.touches[0]||t.changedTouches[0],this.addEntropy([t.pageX||t.clientX,t.pageY||t.clientY],1,"touch"),C(this,0)},ma:function(){C(this,2)},ea:function(t){if(t=t.accelerationIncludingGravity.x||t.accelerationIncludingGravity.y||t.accelerationIncludingGravity.z,window.orientation){var e=window.orientation;"number"==typeof e&&this.addEntropy(e,1,"accelerometer")}t&&this.addEntropy(t,2,"accelerometer"),C(this,0)}},sjcl.random=new sjcl.prng(6);t:try{var D,E,F,G;if(G="undefined"!=typeof module&&module.exports){var H;try{H=require("crypto")}catch(t){H=null}G=E=H}if(G&&E.randomBytes)D=E.randomBytes(128),D=new Uint32Array(new Uint8Array(D).buffer),sjcl.random.addEntropy(D,1024,"crypto['randomBytes']");else if("undefined"!=typeof window&&"undefined"!=typeof Uint32Array){if(F=new Uint32Array(32),window.crypto&&window.crypto.getRandomValues)window.crypto.getRandomValues(F);else{if(!window.msCrypto||!window.msCrypto.getRandomValues)break t;window.msCrypto.getRandomValues(F)}sjcl.random.addEntropy(F,1024,"crypto['getRandomValues']")}}catch(t){"undefined"!=typeof window&&window.console&&(console.log("There was an error collecting entropy from the browser:"),console.log(t))}sjcl.json={defaults:{v:1,iter:1e4,ks:128,ts:64,mode:"ccm",adata:"",cipher:"aes"},ja:function(t,e,i,c){i=i||{},c=c||{};var s,n=sjcl.json,r=n.g({iv:sjcl.random.randomWords(4,0)},n.defaults);if(n.g(r,i),i=r.adata,"string"==typeof r.salt&&(r.salt=sjcl.codec.base64.toBits(r.salt)),"string"==typeof r.iv&&(r.iv=sjcl.codec.base64.toBits(r.iv)),!sjcl.mode[r.mode]||!sjcl.cipher[r.cipher]||"string"==typeof t&&r.iter<=100||64!==r.ts&&96!==r.ts&&128!==r.ts||128!==r.ks&&192!==r.ks&&256!==r.ks||r.iv.length<2||4<r.iv.length)throw new sjcl.exception.invalid("json encrypt: invalid parameters");return"string"==typeof t?(t=(s=sjcl.misc.cachedPbkdf2(t,r)).key.slice(0,r.ks/32),r.salt=s.salt):sjcl.ecc&&t instanceof sjcl.ecc.elGamal.publicKey&&(s=t.kem(),r.kemtag=s.tag,t=s.key.slice(0,r.ks/32)),"string"==typeof e&&(e=sjcl.codec.utf8String.toBits(e)),"string"==typeof i&&(r.adata=i=sjcl.codec.utf8String.toBits(i)),s=new sjcl.cipher[r.cipher](t),n.g(c,r),c.key=t,r.ct="ccm"===r.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&e instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.encrypt(s,e,r.iv,i,r.ts):sjcl.mode[r.mode].encrypt(s,e,r.iv,i,r.ts),r},encrypt:function(t,e,i,c){var s=sjcl.json,n=s.ja.apply(s,arguments);return s.encode(n)},ia:function(t,e,i,c){i=i||{},c=c||{};var s,n,r=sjcl.json;if(s=(e=r.g(r.g(r.g({},r.defaults),e),i,!0)).adata,"string"==typeof e.salt&&(e.salt=sjcl.codec.base64.toBits(e.salt)),"string"==typeof e.iv&&(e.iv=sjcl.codec.base64.toBits(e.iv)),!sjcl.mode[e.mode]||!sjcl.cipher[e.cipher]||"string"==typeof t&&e.iter<=100||64!==e.ts&&96!==e.ts&&128!==e.ts||128!==e.ks&&192!==e.ks&&256!==e.ks||!e.iv||e.iv.length<2||4<e.iv.length)throw new sjcl.exception.invalid("json decrypt: invalid parameters");return"string"==typeof t?(t=(n=sjcl.misc.cachedPbkdf2(t,e)).key.slice(0,e.ks/32),e.salt=n.salt):sjcl.ecc&&t instanceof sjcl.ecc.elGamal.secretKey&&(t=t.unkem(sjcl.codec.base64.toBits(e.kemtag)).slice(0,e.ks/32)),"string"==typeof s&&(s=sjcl.codec.utf8String.toBits(s)),n=new sjcl.cipher[e.cipher](t),s="ccm"===e.mode&&sjcl.arrayBuffer&&sjcl.arrayBuffer.ccm&&e.ct instanceof ArrayBuffer?sjcl.arrayBuffer.ccm.decrypt(n,e.ct,e.iv,e.tag,s,e.ts):sjcl.mode[e.mode].decrypt(n,e.ct,e.iv,s,e.ts),r.g(c,e),c.key=t,1===i.raw?s:sjcl.codec.utf8String.fromBits(s)},decrypt:function(t,e,i,c){var s=sjcl.json;return s.ia(t,s.decode(e),i,c)},encode:function(t){var e,i="{",c="";for(e in t)if(t.hasOwnProperty(e)){if(!e.match(/^[a-z0-9]+$/i))throw new sjcl.exception.invalid("json encode: invalid property name");switch(i+=c+'"'+e+'":',c=",",typeof t[e]){case"number":case"boolean":i+=t[e];break;case"string":i+='"'+escape(t[e])+'"';break;case"object":i+='"'+sjcl.codec.base64.fromBits(t[e],0)+'"';break;default:throw new sjcl.exception.bug("json encode: unsupported type")}}return i+"}"},decode:function(t){if(!(t=t.replace(/\s/g,"")).match(/^\{.*\}$/))throw new sjcl.exception.invalid("json decode: this isn't json!");t=t.replace(/^\{|\}$/g,"").split(/,/);var e,i,c={};for(e=0;e<t.length;e++){if(!(i=t[e].match(/^\s*(?:(["']?)([a-z][a-z0-9]*)\1)\s*:\s*(?:(-?\d+)|"([a-z0-9+\/%*_.@=\-]*)"|(true|false))$/i)))throw new sjcl.exception.invalid("json decode: this isn't json!");null!=i[3]?c[i[2]]=parseInt(i[3],10):null!=i[4]?c[i[2]]=i[2].match(/^(ct|adata|salt|iv)$/)?sjcl.codec.base64.toBits(i[4]):unescape(i[4]):null!=i[5]&&(c[i[2]]="true"===i[5])}return c},g:function(t,e,i){if(void 0===t&&(t={}),void 0===e)return t;for(var c in e)if(e.hasOwnProperty(c)){if(i&&void 0!==t[c]&&t[c]!==e[c])throw new sjcl.exception.invalid("required parameter overridden");t[c]=e[c]}return t},sa:function(t,e){var i,c={};for(i in t)t.hasOwnProperty(i)&&t[i]!==e[i]&&(c[i]=t[i]);return c},ra:function(t,e){var i,c={};for(i=0;i<e.length;i++)void 0!==t[e[i]]&&(c[e[i]]=t[e[i]]);return c}},sjcl.encrypt=sjcl.json.encrypt,sjcl.decrypt=sjcl.json.decrypt,sjcl.misc.pa={},sjcl.misc.cachedPbkdf2=function(t,e){var i,c=sjcl.misc.pa;return i=(e=e||{}).iter||1e3,(i=(c=c[t]=c[t]||{})[i]=c[i]||{firstSalt:e.salt&&e.salt.length?e.salt.slice(0):sjcl.random.randomWords(2,0)})[c=void 0===e.salt?i.firstSalt:e.salt]=i[c]||sjcl.misc.pbkdf2(t,c,e.iter),{key:i[c].slice(0),salt:c.slice(0)}},"undefined"!=typeof module&&module.exports&&(module.exports=sjcl),"function"==typeof define&&define([],function(){return sjcl});	<!-- standard lib:  SHA Verschlüsselung -->
/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-2 as well as the corresponding HMAC implementation
 as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2015
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict';(function(T){function y(c,a,d){var b=0,f=[],k=0,g,e,n,h,m,u,r,p=!1,q=!1,t=[],v=[],x,w=!1;d=d||{};g=d.encoding||"UTF8";x=d.numRounds||1;n=J(a,g);if(x!==parseInt(x,10)||1>x)throw Error("numRounds must a integer >= 1");if("SHA-1"===c)m=512,u=K,r=U,h=160;else if(u=function(a,d){return L(a,d,c)},r=function(a,d,b,f){var k,e;if("SHA-224"===c||"SHA-256"===c)k=(d+65>>>9<<4)+15,e=16;else if("SHA-384"===c||"SHA-512"===c)k=(d+129>>>10<<5)+31,e=32;else throw Error("Unexpected error in SHA-2 implementation");
for(;a.length<=k;)a.push(0);a[d>>>5]|=128<<24-d%32;a[k]=d+b;b=a.length;for(d=0;d<b;d+=e)f=L(a.slice(d,d+e),f,c);if("SHA-224"===c)a=[f[0],f[1],f[2],f[3],f[4],f[5],f[6]];else if("SHA-256"===c)a=f;else if("SHA-384"===c)a=[f[0].a,f[0].b,f[1].a,f[1].b,f[2].a,f[2].b,f[3].a,f[3].b,f[4].a,f[4].b,f[5].a,f[5].b];else if("SHA-512"===c)a=[f[0].a,f[0].b,f[1].a,f[1].b,f[2].a,f[2].b,f[3].a,f[3].b,f[4].a,f[4].b,f[5].a,f[5].b,f[6].a,f[6].b,f[7].a,f[7].b];else throw Error("Unexpected error in SHA-2 implementation");
return a},"SHA-224"===c)m=512,h=224;else if("SHA-256"===c)m=512,h=256;else if("SHA-384"===c)m=1024,h=384;else if("SHA-512"===c)m=1024,h=512;else throw Error("Chosen SHA variant is not supported");e=z(c);this.setHMACKey=function(a,d,f){var k;if(!0===q)throw Error("HMAC key already set");if(!0===p)throw Error("Cannot set HMAC key after finalizing hash");if(!0===w)throw Error("Cannot set HMAC key after calling update");g=(f||{}).encoding||"UTF8";d=J(d,g)(a);a=d.binLen;d=d.value;k=m>>>3;f=k/4-1;if(k<
a/8){for(d=r(d,a,0,z(c));d.length<=f;)d.push(0);d[f]&=4294967040}else if(k>a/8){for(;d.length<=f;)d.push(0);d[f]&=4294967040}for(a=0;a<=f;a+=1)t[a]=d[a]^909522486,v[a]=d[a]^1549556828;e=u(t,e);b=m;q=!0};this.update=function(a){var c,d,g,h=0,p=m>>>5;c=n(a,f,k);a=c.binLen;d=c.value;c=a>>>5;for(g=0;g<c;g+=p)h+m<=a&&(e=u(d.slice(g,g+p),e),h+=m);b+=h;f=d.slice(h>>>5);k=a%m;w=!0};this.getHash=function(a,d){var g,m,n;if(!0===q)throw Error("Cannot call getHash after setting HMAC key");n=M(d);switch(a){case "HEX":g=
function(a){return N(a,n)};break;case "B64":g=function(a){return O(a,n)};break;case "BYTES":g=P;break;default:throw Error("format must be HEX, B64, or BYTES");}if(!1===p)for(e=r(f,k,b,e),m=1;m<x;m+=1)e=r(e,h,0,z(c));p=!0;return g(e)};this.getHMAC=function(a,d){var g,n,t;if(!1===q)throw Error("Cannot call getHMAC without first setting HMAC key");t=M(d);switch(a){case "HEX":g=function(a){return N(a,t)};break;case "B64":g=function(a){return O(a,t)};break;case "BYTES":g=P;break;default:throw Error("outputFormat must be HEX, B64, or BYTES");
}!1===p&&(n=r(f,k,b,e),e=u(v,z(c)),e=r(n,h,m,e));p=!0;return g(e)}}function b(c,a){this.a=c;this.b=a}function V(c,a,d){var b=c.length,f,k,e,l,n;a=a||[0];d=d||0;n=d>>>3;if(0!==b%2)throw Error("String of HEX type must be in byte increments");for(f=0;f<b;f+=2){k=parseInt(c.substr(f,2),16);if(isNaN(k))throw Error("String of HEX type contains invalid characters");l=(f>>>1)+n;for(e=l>>>2;a.length<=e;)a.push(0);a[e]|=k<<8*(3-l%4)}return{value:a,binLen:4*b+d}}function W(c,a,d){var b=[],f,k,e,l,b=a||[0];d=
d||0;k=d>>>3;for(f=0;f<c.length;f+=1)a=c.charCodeAt(f),l=f+k,e=l>>>2,b.length<=e&&b.push(0),b[e]|=a<<8*(3-l%4);return{value:b,binLen:8*c.length+d}}function X(c,a,d){var b=[],f=0,e,g,l,n,h,m,b=a||[0];d=d||0;a=d>>>3;if(-1===c.search(/^[a-zA-Z0-9=+\/]+$/))throw Error("Invalid character in base-64 string");g=c.indexOf("=");c=c.replace(/\=/g,"");if(-1!==g&&g<c.length)throw Error("Invalid '=' found in base-64 string");for(g=0;g<c.length;g+=4){h=c.substr(g,4);for(l=n=0;l<h.length;l+=1)e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(h[l]),
n|=e<<18-6*l;for(l=0;l<h.length-1;l+=1){m=f+a;for(e=m>>>2;b.length<=e;)b.push(0);b[e]|=(n>>>16-8*l&255)<<8*(3-m%4);f+=1}}return{value:b,binLen:8*f+d}}function N(c,a){var d="",b=4*c.length,f,e;for(f=0;f<b;f+=1)e=c[f>>>2]>>>8*(3-f%4),d+="0123456789abcdef".charAt(e>>>4&15)+"0123456789abcdef".charAt(e&15);return a.outputUpper?d.toUpperCase():d}function O(c,a){var d="",b=4*c.length,f,e,g;for(f=0;f<b;f+=3)for(g=f+1>>>2,e=c.length<=g?0:c[g],g=f+2>>>2,g=c.length<=g?0:c[g],g=(c[f>>>2]>>>8*(3-f%4)&255)<<16|
(e>>>8*(3-(f+1)%4)&255)<<8|g>>>8*(3-(f+2)%4)&255,e=0;4>e;e+=1)8*f+6*e<=32*c.length?d+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g>>>6*(3-e)&63):d+=a.b64Pad;return d}function P(c){var a="",d=4*c.length,b,f;for(b=0;b<d;b+=1)f=c[b>>>2]>>>8*(3-b%4)&255,a+=String.fromCharCode(f);return a}function M(c){var a={outputUpper:!1,b64Pad:"="};c=c||{};a.outputUpper=c.outputUpper||!1;!0===c.hasOwnProperty("b64Pad")&&(a.b64Pad=c.b64Pad);if("boolean"!==typeof a.outputUpper)throw Error("Invalid outputUpper formatting option");
if("string"!==typeof a.b64Pad)throw Error("Invalid b64Pad formatting option");return a}function J(c,a){var d;switch(a){case "UTF8":case "UTF16BE":case "UTF16LE":break;default:throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");}switch(c){case "HEX":d=V;break;case "TEXT":d=function(c,d,b){var e=[],l=[],n=0,h,m,u,r,p,e=d||[0];d=b||0;u=d>>>3;if("UTF8"===a)for(h=0;h<c.length;h+=1)for(b=c.charCodeAt(h),l=[],128>b?l.push(b):2048>b?(l.push(192|b>>>6),l.push(128|b&63)):55296>b||57344<=b?l.push(224|
b>>>12,128|b>>>6&63,128|b&63):(h+=1,b=65536+((b&1023)<<10|c.charCodeAt(h)&1023),l.push(240|b>>>18,128|b>>>12&63,128|b>>>6&63,128|b&63)),m=0;m<l.length;m+=1){p=n+u;for(r=p>>>2;e.length<=r;)e.push(0);e[r]|=l[m]<<8*(3-p%4);n+=1}else if("UTF16BE"===a||"UTF16LE"===a)for(h=0;h<c.length;h+=1){b=c.charCodeAt(h);"UTF16LE"===a&&(m=b&255,b=m<<8|b>>>8);p=n+u;for(r=p>>>2;e.length<=r;)e.push(0);e[r]|=b<<8*(2-p%4);n+=2}return{value:e,binLen:8*n+d}};break;case "B64":d=X;break;case "BYTES":d=W;break;default:throw Error("format must be HEX, TEXT, B64, or BYTES");
}return d}function w(c,a){return c<<a|c>>>32-a}function q(c,a){return c>>>a|c<<32-a}function v(c,a){var d=null,d=new b(c.a,c.b);return d=32>=a?new b(d.a>>>a|d.b<<32-a&4294967295,d.b>>>a|d.a<<32-a&4294967295):new b(d.b>>>a-32|d.a<<64-a&4294967295,d.a>>>a-32|d.b<<64-a&4294967295)}function Q(c,a){var d=null;return d=32>=a?new b(c.a>>>a,c.b>>>a|c.a<<32-a&4294967295):new b(0,c.a>>>a-32)}function Y(c,a,d){return c&a^~c&d}function Z(c,a,d){return new b(c.a&a.a^~c.a&d.a,c.b&a.b^~c.b&d.b)}function R(c,a,d){return c&
a^c&d^a&d}function aa(c,a,d){return new b(c.a&a.a^c.a&d.a^a.a&d.a,c.b&a.b^c.b&d.b^a.b&d.b)}function ba(c){return q(c,2)^q(c,13)^q(c,22)}function ca(c){var a=v(c,28),d=v(c,34);c=v(c,39);return new b(a.a^d.a^c.a,a.b^d.b^c.b)}function da(c){return q(c,6)^q(c,11)^q(c,25)}function ea(c){var a=v(c,14),d=v(c,18);c=v(c,41);return new b(a.a^d.a^c.a,a.b^d.b^c.b)}function fa(c){return q(c,7)^q(c,18)^c>>>3}function ga(c){var a=v(c,1),d=v(c,8);c=Q(c,7);return new b(a.a^d.a^c.a,a.b^d.b^c.b)}function ha(c){return q(c,
17)^q(c,19)^c>>>10}function ia(c){var a=v(c,19),d=v(c,61);c=Q(c,6);return new b(a.a^d.a^c.a,a.b^d.b^c.b)}function B(c,a){var d=(c&65535)+(a&65535);return((c>>>16)+(a>>>16)+(d>>>16)&65535)<<16|d&65535}function ja(c,a,d,b){var f=(c&65535)+(a&65535)+(d&65535)+(b&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(b>>>16)+(f>>>16)&65535)<<16|f&65535}function C(c,a,d,b,f){var e=(c&65535)+(a&65535)+(d&65535)+(b&65535)+(f&65535);return((c>>>16)+(a>>>16)+(d>>>16)+(b>>>16)+(f>>>16)+(e>>>16)&65535)<<16|e&65535}function ka(c,
a){var d,e,f;d=(c.b&65535)+(a.b&65535);e=(c.b>>>16)+(a.b>>>16)+(d>>>16);f=(e&65535)<<16|d&65535;d=(c.a&65535)+(a.a&65535)+(e>>>16);e=(c.a>>>16)+(a.a>>>16)+(d>>>16);return new b((e&65535)<<16|d&65535,f)}function la(c,a,d,e){var f,k,g;f=(c.b&65535)+(a.b&65535)+(d.b&65535)+(e.b&65535);k=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(f>>>16);g=(k&65535)<<16|f&65535;f=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(k>>>16);k=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(f>>>16);return new b((k&65535)<<16|
f&65535,g)}function ma(c,a,d,e,f){var k,g,l;k=(c.b&65535)+(a.b&65535)+(d.b&65535)+(e.b&65535)+(f.b&65535);g=(c.b>>>16)+(a.b>>>16)+(d.b>>>16)+(e.b>>>16)+(f.b>>>16)+(k>>>16);l=(g&65535)<<16|k&65535;k=(c.a&65535)+(a.a&65535)+(d.a&65535)+(e.a&65535)+(f.a&65535)+(g>>>16);g=(c.a>>>16)+(a.a>>>16)+(d.a>>>16)+(e.a>>>16)+(f.a>>>16)+(k>>>16);return new b((g&65535)<<16|k&65535,l)}function z(c){var a,d;if("SHA-1"===c)c=[1732584193,4023233417,2562383102,271733878,3285377520];else switch(a=[3238371032,914150663,
812702999,4144912697,4290775857,1750603025,1694076839,3204075428],d=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],c){case "SHA-224":c=a;break;case "SHA-256":c=d;break;case "SHA-384":c=[new b(3418070365,a[0]),new b(1654270250,a[1]),new b(2438529370,a[2]),new b(355462360,a[3]),new b(1731405415,a[4]),new b(41048885895,a[5]),new b(3675008525,a[6]),new b(1203062813,a[7])];break;case "SHA-512":c=[new b(d[0],4089235720),new b(d[1],2227873595),new b(d[2],4271175723),
new b(d[3],1595750129),new b(d[4],2917565137),new b(d[5],725511199),new b(d[6],4215389547),new b(d[7],327033209)];break;default:throw Error("Unknown SHA variant");}return c}function K(c,a){var d=[],b,e,k,g,l,n,h;b=a[0];e=a[1];k=a[2];g=a[3];l=a[4];for(h=0;80>h;h+=1)d[h]=16>h?c[h]:w(d[h-3]^d[h-8]^d[h-14]^d[h-16],1),n=20>h?C(w(b,5),e&k^~e&g,l,1518500249,d[h]):40>h?C(w(b,5),e^k^g,l,1859775393,d[h]):60>h?C(w(b,5),R(e,k,g),l,2400959708,d[h]):C(w(b,5),e^k^g,l,3395469782,d[h]),l=g,g=k,k=w(e,30),e=b,b=n;a[0]=
B(b,a[0]);a[1]=B(e,a[1]);a[2]=B(k,a[2]);a[3]=B(g,a[3]);a[4]=B(l,a[4]);return a}function U(c,a,b,e){var f;for(f=(a+65>>>9<<4)+15;c.length<=f;)c.push(0);c[a>>>5]|=128<<24-a%32;c[f]=a+b;b=c.length;for(a=0;a<b;a+=16)e=K(c.slice(a,a+16),e);return e}function L(c,a,d){var q,f,k,g,l,n,h,m,u,r,p,v,t,w,x,y,z,D,E,F,G,H,A=[],I;if("SHA-224"===d||"SHA-256"===d)r=64,v=1,H=Number,t=B,w=ja,x=C,y=fa,z=ha,D=ba,E=da,G=R,F=Y,I=e;else if("SHA-384"===d||"SHA-512"===d)r=80,v=2,H=b,t=ka,w=la,x=ma,y=ga,z=ia,D=ca,E=ea,G=aa,
F=Z,I=S;else throw Error("Unexpected error in SHA-2 implementation");d=a[0];q=a[1];f=a[2];k=a[3];g=a[4];l=a[5];n=a[6];h=a[7];for(p=0;p<r;p+=1)16>p?(u=p*v,m=c.length<=u?0:c[u],u=c.length<=u+1?0:c[u+1],A[p]=new H(m,u)):A[p]=w(z(A[p-2]),A[p-7],y(A[p-15]),A[p-16]),m=x(h,E(g),F(g,l,n),I[p],A[p]),u=t(D(d),G(d,q,f)),h=n,n=l,l=g,g=t(k,m),k=f,f=q,q=d,d=t(m,u);a[0]=t(d,a[0]);a[1]=t(q,a[1]);a[2]=t(f,a[2]);a[3]=t(k,a[3]);a[4]=t(g,a[4]);a[5]=t(l,a[5]);a[6]=t(n,a[6]);a[7]=t(h,a[7]);return a}var e,S;e=[1116352408,
1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,
430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];S=[new b(e[0],3609767458),new b(e[1],602891725),new b(e[2],3964484399),new b(e[3],2173295548),new b(e[4],4081628472),new b(e[5],3053834265),new b(e[6],2937671579),new b(e[7],3664609560),new b(e[8],2734883394),new b(e[9],1164996542),new b(e[10],1323610764),new b(e[11],3590304994),new b(e[12],4068182383),new b(e[13],991336113),new b(e[14],
633803317),new b(e[15],3479774868),new b(e[16],2666613458),new b(e[17],944711139),new b(e[18],2341262773),new b(e[19],2007800933),new b(e[20],1495990901),new b(e[21],1856431235),new b(e[22],3175218132),new b(e[23],2198950837),new b(e[24],3999719339),new b(e[25],766784016),new b(e[26],2566594879),new b(e[27],3203337956),new b(e[28],1034457026),new b(e[29],2466948901),new b(e[30],3758326383),new b(e[31],168717936),new b(e[32],1188179964),new b(e[33],1546045734),new b(e[34],1522805485),new b(e[35],2643833823),
new b(e[36],2343527390),new b(e[37],1014477480),new b(e[38],1206759142),new b(e[39],344077627),new b(e[40],1290863460),new b(e[41],3158454273),new b(e[42],3505952657),new b(e[43],106217008),new b(e[44],3606008344),new b(e[45],1432725776),new b(e[46],1467031594),new b(e[47],851169720),new b(e[48],3100823752),new b(e[49],1363258195),new b(e[50],3750685593),new b(e[51],3785050280),new b(e[52],3318307427),new b(e[53],3812723403),new b(e[54],2003034995),new b(e[55],3602036899),new b(e[56],1575990012),
new b(e[57],1125592928),new b(e[58],2716904306),new b(e[59],442776044),new b(e[60],593698344),new b(e[61],3733110249),new b(e[62],2999351573),new b(e[63],3815920427),new b(3391569614,3928383900),new b(3515267271,566280711),new b(3940187606,3454069534),new b(4118630271,4000239992),new b(116418474,1914138554),new b(174292421,2731055270),new b(289380356,3203993006),new b(460393269,320620315),new b(685471733,587496836),new b(852142971,1086792851),new b(1017036298,365543100),new b(1126000580,2618297676),
new b(1288033470,3409855158),new b(1501505948,4234509866),new b(1607167915,987167468),new b(1816402316,1246189591)];"function"===typeof define&&define.amd?define(function(){return y}):"undefined"!==typeof exports?"undefined"!==typeof module&&module.exports?module.exports=exports=y:exports=y:T.jsSHA=y})(this);
				<!-- alternate lib: SHA Hashes -->

