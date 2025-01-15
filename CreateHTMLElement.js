function isEvent( eventname ) {
    return [
        'abort','afterprint','animationend','animationiteration',
        'animationstart','beforeprint','beforeunload','blur','canplay','canplaythrough','change','click',
        'contextmenu','copy','cut','dblclick','drag','dragend','dragenter','dragleave','dragover',
        'dragstart','drop','durationchange','ended','error','focus','focusin','focusout','fullscreenchange',
        'fullscreenerror','hashchange','input','invalid','keydown','keypress','keyup','load','loadeddata',
        'loadedmetadata','loadstart','message','mousedown','mouseenter','mousemove','mouseover',
        'mouseout','mouseup','mousewheel','offline','online','open','pagehide','pageshow','paste','pause',
        'play','playing','popstate','progress','ratechange','resize','reset','scroll','search','seeked','seeking',
        'select','show','stalled','storage','submit','suspend','timeupdate','toggle','touchcancel',
        'touchend','touchmove','touchstart','transitionend','unload','volumechange','waiting','wheel',
    ].indexOf(eventname) !== -1;
}

function isAttribute( attributename ) {
    return [
        "accept","accept-charset","accesskey","action","align","alt","async",
        "autocomplete","autofocus","autoplay","bgcolor","border","charset","checked",
        "cite","class","color","cols","colspan","content","contenteditable","controls",
        "coords","data","data-*","datetime","default","defer","dir","dirname","disabled",
        "download","draggable","enctype","enterkeyhint","for","form","formaction","headers",
        "height","hidden","high","href","hreflang","http-equiv","id","inert","inputmode","ismap",
        "kind","label","lang","list","loop","low","max","maxlength","media","method","min",
        "multiple","muted","name","novalidate","onabort","onafterprint","onbeforeprint",
        "onbeforeunload","onblur","oncanplay","oncanplaythrough","onchange","onclick","oncontextmenu",
        "oncopy","oncuechange","oncut","ondblclick","ondrag","ondragend","ondragenter","ondragleave",
        "ondragover","ondragstart","ondrop","ondurationchange","onemptied","onended","onerror","onfocus",
        "onhashchange","oninput","oninvalid","onkeydown","onkeypress","onkeyup","onload","onloadeddata",
        "onloadedmetadata","onloadstart","onmousedown","onmousemove","onmouseout","onmouseover","onmouseup",
        "onmousewheel","onoffline","ononline","onpagehide","onpageshow","onpaste","onpause","onplay","onplaying",
        "onpopstate","onprogress","onratechange","onreset","onresize","onscroll","onsearch","onseeked","onseeking",
        "onselect","onstalled","onstorage","onsubmit","onsuspend","ontimeupdate","ontoggle","onunload","onvolumechange",
        "onwaiting","onwheel","open","optimum","pattern","placeholder","popover","popovertarget","popovertargetaction",
        "poster","preload","readonly","rel","required","reversed","rows","rowspan","sandbox","scope","selected",
        "shape","size","sizes","span","spellcheck","src","srcdoc","srclang","srcset","start","step","style",
        "tabindex","target","title","translate","type","usemap","value","width","wrap",
    ].indexOf(attributename) !== -1;
}

/**
 * 
 * @returns {HTMLElement | null}
 */
export default function HTML() {
    if(!arguments[0] || typeof arguments[0] !== 'string') {
        console.error('You are missing the first argument. Please provide HTML Element tag name, such as "div", "p", "button", etc.')
        return null;
    }
    const ELEMENT = document.createElement(arguments[0]);

    for(let i = 1; i < arguments.length; i++) {

        if(typeof arguments[i] === 'string') {
            if(arguments[0] === 'input')
                ELEMENT.value = arguments[i];
            else
                ELEMENT.innerHTML = arguments[i];
        }
        else if(typeof arguments[i] === 'number') {
            if(arguments[0] === 'input')
                ELEMENT.value = arguments[i];
            else {
                ELEMENT.innerHTML = arguments[i].toString();
            }
        }

        else if (typeof arguments[i] === 'object') {

            if(arguments[i] instanceof HTMLElement) {
                arguments[i].appendChild(ELEMENT);
            }

            // if the object is array indeed,
            // maybe user is inserting child elements?
            else if(Array.isArray(arguments[i])) {
                for(let c = 0; c < arguments[i].length; c++) {

                    if(arguments[i][c] instanceof HTMLElement) {
                        ELEMENT.appendChild(arguments[i][c]);
                    }
                    else if(typeof arguments[i][c] === 'string') {

                        // check whether the value is one of the events
                        // AND the the next value in the array exists and is function.
                        if(isEvent(arguments[i][c]) && arguments[i][c+1] && typeof arguments[i][c+1] === 'function') {
                            ELEMENT.addEventListener(arguments[i][c], arguments[i][c+1]);
                            c++;
                        }
                        else if(isAttribute(arguments[i][c]) && arguments[i][c+1] && typeof arguments[i][c+1] === 'string') {
                            ELEMENT.setAttribute(arguments[i][c], arguments[i][c+1]);
                            c++;
                        }
                    }
                }
            }

            // is not array, but regular object
            else {
                for(let key in arguments[i]) {

                    if(isAttribute(key)) {
                        ELEMENT.setAttribute(key, arguments[i][key]);
                    }
                    else if(isEvent(key)) {
                        ELEMENT.addEventListener(key, arguments[i][key]);
                    }

                }

            }
        }

    }

    return ELEMENT;
}
