// Opera 8.0+
const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
const isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));

// Internet Explorer 6-11
const isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
const isEdge = !isIE && !!window.StyleMedia;

// Chrome 1 - 79
const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

// Edge (based on chromium) detection
const isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);

// Blink engine detection
const isBlink = (isChrome || isOpera) && !!window.CSS;



if(isIE){
  //console.log('IE browser')
  //var text = document.getElementById("error") = 'This browser is not supported';
  window.location.href = '/404B';

}
if(isEdge){
  
  window.location.href = '/404B';
  //window.location.href = 'http://www.example.com/';
//  var text = document.getElementById("error") = 'This browser is not supported';
}
// const output = 'Detecting browsers by ducktyping:<hr>';
// output += 'isFirefox: ' + isFirefox + '<br>';
// output += 'isChrome: ' + isChrome + '<br>';
// output += 'isSafari: ' + isSafari + '<br>';
// output += 'isOpera: ' + isOpera + '<br>';
// output += 'isIE: ' + isIE + '<br>';
// output += 'isEdge: ' + isEdge + '<br>';
// output += 'isEdgeChromium: ' + isEdgeChromium + '<br>';
// output += 'isBlink: ' + isBlink + '<br>';
// document.body.innerHTML = output;
