/**
 * Javascript LibraryElements.
 * 
 * Version 1.0.
 * 
 * Please use this file as a module. If you wish to use this file as a standard javascript file, please remove the export from the end of this file.
 * 
 * Created by Miika Toivanen.
 */

class EID {
    constructor() {
        this.nextAvailableID = 0;
    }

    getRandomDigit() {
        let random_string = '';
        for(let i = 0; i < 4; i++)
            random_string += `${Math.round(Math.random()*10)}`
        return random_string;
    }

    getNextAvailableID() {
        this.nextAvailableID++;
        return `${this.getRandomDigit()}-${this.nextAvailableID}`;
    }
}

const UI = new Map();

const eid = new EID();

class LibElement {
    constructor(type) {
        this.type = type
        this.element = document.createElement(type)
        /**
         * @type { LibElement }
         */
        this.parent = null
        this.eid = eid.getNextAvailableID()
        this.rotationDegrees = 0;
        this.rotationRadians = 0;
    }

    /**
     * @param {LibElement} parent 
     */
    setParent(parent) {
        if(!parent)
            return

        else if(parent instanceof LibElement) {
            this.parent = parent
            this.parent.element.appendChild(this.element)
        }
        else if(parent instanceof HTMLElement) {

            parent.appendChild( this.element )
        }
    }

    /**
     * 
     * @param {HTMLElement} htmlelement 
     */
    mount(htmlelement) {
        this.element = htmlelement;
    }

    /**
     * @param {string} htmlcontent set innerHTML of the element
     */
    html(htmlcontent) {
        this.element.innerHTML = htmlcontent
    }
    
    /**
     * @param {string} textcontent set innerText of the element
     */
    text(textcontent) {
        this.element.innerText = textcontent
    }
    
    /**
     * remove the element and its contents
     */
    remove() {

        // remove child instences 
        this.clear()

        // remove the html instance
        this.element.remove()

        // remove the entry from the UI map...
        if(UI.has(this.eid))
            UI.delete(this.eid)

    }

    /**
     * 
     * @param {object} cssprops 
     */

    style(cssprops) {
        if( typeof cssprops === 'object' && !Array.isArray(cssprops)) {


            for(let propname in  cssprops) {
                if(cssprops[propname])
                    this.element.style[propname] = cssprops[propname]
            }
        }
    }

    getStyle(propname) {
        return this.element.style[propname];
    }

    value(value) {
        this.element.value = value;
    }

    /**
     * @param {LibElement} libelement 
     */

    getBounds() {
        return this.element.getBoundingClientRect();
    }

    getElementStylesInCSSformat() {
        return this.element.style.cssText;
    }

    /**
     * clear the contents of the html instance
     */
    clear() {
        while(this.element.hasChildNodes()) {

            if(this.element.firstChild instanceof HTMLElement && this.element.firstChild.hasAttribute('data')) {
                let dataraw = this.element.firstChild.getAttribute('data')
                let data = JSON.parse(dataraw);
    
                if(data.eid) {
                    UI.get(data.eid).clear()
                    UI.get(data.eid).remove()
                }
            }
            else {
                this.element.firstChild.remove()
            }
        }
    }

    checked(value) {
        this.element.checked = value || false;
    }

    /**
     * @param {string} idstring
     * set the id of the html element
     */
    id(idstring) {
        this.attributes({id: idstring})
    }

    /**
     * @param {string} classString
     * set the className of the html element
     */
    class(classString) {
        this.attributes({class: classString})
    }

    /**
     * 
     * @param {string} classname 
     */
    toggleClass(classname) {
        this.element.classList.toggle(classname)
    }

    /**
     * Sets many attributes
     * Like: { "attributekey": "value"}
     */
    attributes(attrbObj) {
        if(typeof attrbObj === 'object' && !Array.isArray(attrbObj)) 
            for(let key in attrbObj) 
                this.element.setAttribute(key, attrbObj[key])
    }

    removeAttribute(attributekey) {
        this.element.removeAttribute(attributekey)
    }

    event(eventname, eventfunc) {

        this.element.addEventListener(eventname, eventfunc)
    }

    removeEvent(eventname) {
        this.element.removeEvent(eventname)
    }
}

class LibCanvas2D extends LibElement {
    constructor(type) {
        super(type)
        this.context = this.element.getContext('2d')
    }

    size(width, height) {
        this.element.width = width;
        this.element.height = height;
    }

    setQuality(num) {

        let n = Math.round(num)

        if( n < 0) n = 0;
        else if(n > 2) n = 2;

        let quality = ['low', 'medium', 'high'];
        this.context.imageSmoothingQuality = quality[n]
    }

    clearCanvas() {
        this.context.clearRect(0, 0, this.element.width, this.element.height)
    }

    getSize() {
        return {
            width: this.element.width,
            height: this.element.height
        }
    }

    getTextWidth( text ) {
        return this.context.measureText(text).width
    }

    setProperties(props) {
        if(!props) return;

        if(props.width)
            this.context.lineWidth = props.width

        if(props.color) 
            this.context.strokeStyle = props.color
        
        if(props.fill)
            this.context.fillStyle = props.fill
        
        if(props.font)
            this.context.font = props.font;
    }

    box(props) {

        if(!props) return;

        this.setProperties( props );

        this.context.beginPath();

        if(props.position && props.size) {
            let {x, y} = props.position;
            let {width, height} = props.size;

            this.context.rect(x, y, width, height)
            this.context.stroke();
            
            if(props.fill)
                this.context.fill()
            
        }

    }

    circle( props ) {

        if(!props) return;

        this.context.beginPath();
        
        this.setProperties( props );
        
        if(props.position && props.radius) {
            let {x, y} = props.position;

            let startAngle = props.startAngle || 0;
            let endAngle = props.endAngle || Math.PI*2;
            
            this.context.arc(x, y, props.radius, startAngle, endAngle)
            this.context.stroke();
            
            if(props.fill)
                this.context.fill();

        }
    }

    line(props) {

        if(!props) return;

        this.context.beginPath();

        this.setProperties( props );

        if(props.from) {
            let {x, y} = props.from;
            this.context.moveTo(x, y)
        }
        
        if(props.to) {
            let {x, y} = props.to;
            this.context.lineTo(x, y)
        }

        this.context.stroke();
        

    }

    getShape(shape, size, position) {
        const shapes = ['pentagon', 'triangle']
        const points = []

        // add more shapes here

        if(shapes.indexOf(shape) === -1)
            return []

        if(shape === 'pentagon') {

            let advance = Math.PI / 3;

            for(let i = 0; i < 6; i++) {

                let x = Math.cos(i * advance + advance*.5) * size + position.x,
                    y = Math.sin(i * advance + advance*.5) * size + position.y;

                points.push({x, y});
            }
            points.push(points[0]);
        }
        else if(shape === 'triangle') {

            let advance = (Math.PI * 2) / 3;

            for(let i = 0; i < 3; i++) {

                let x = Math.cos(i * advance + advance*.25) * size + position.x,
                    y = Math.sin(i * advance + advance*.25) * size + position.y;

                points.push({x, y});
            }
            
            points.push(points[0]);
        }

        return points;
    }

    shape(props) {

        if(!props) return;
        
        this.context.beginPath();
        
        this.setProperties( props );

        if(props.shape && props.size && props.position)
            props.points = this.getShape(props.shape, props.size, props.position)

        if(props.points && Array.isArray(props.points)) {
            
            let {x, y} = props.points[0];
            this.context.moveTo(x, y);

            for(let p = 1; p < props.points.length; p++) {
                let {x, y} = props.points[p];
                this.context.lineTo(x, y);
            }
            
            if(props.fill)
                this.context.fill();
            
            this.context.stroke();
        }
    }

    text(props) {
        if(!props) return;
        
        this.context.beginPath();

        this.setProperties( props );

        if(props.position && props.text) {

            let {x, y} = props.position;
            if(props.fill)
                this.context.fillText(props.text, x, y);
            this.context.strokeText(props.text, x, y);


        }
    }

    image(props) {
        if(!props) return;

        if(props.img || props.src && props.position) {

            let img = null;

            if(props.img) {
                img = props.img

            } else if(props.src) {
                img = new Image();
                img.src = props.src;
            }

            if(img && props.position) {
                let {x, y} = props.position;
                ctx.drawImage(img, x, y);
            }
        }
    }

    loop(loopfunction) {

        function start() {
            if(loopfunction) {
                if( typeof loopfunction === 'function')
                    loopfunction()
            }
            window.requestAnimationFrame( start )
        }
        start()
    }
}



/**
 * @return {LibElement | null}
 */
function createLibElement() {

    if (!arguments[0] || typeof arguments[0] !== 'string')
        return null

    let libelement = arguments[0] === 'canvas' ? new LibCanvas2D(arguments[0]) : new LibElement(arguments[0])

    libelement.attributes({data: `{"eid":"${libelement.eid}"}`}) 

    for(let a = 1; a < arguments.length; a++) {

        if(arguments[a] instanceof LibElement) 
            libelement.setParent(arguments[a])

        else if( arguments[a] instanceof HTMLElement)
            libelement.mount(arguments[a])

        else if(typeof arguments[a] === 'string')  {

            if(arguments[a] === 'event') {
                if(typeof arguments[a+1] === 'object') {

                    let eventname = Object.keys(arguments[a+1])[0],
                        eventcallback = Object.values(arguments[a+1])[0];

                    if(eventname && typeof eventcallback === 'function') {
                        libelement.event(eventname, eventcallback);
                        a+=1;
                    }
                }
                
            }
            else
                libelement.text(arguments[a])
        }

        else {
            if(Array.isArray(arguments[a])) {

                for(let child of arguments[a]) {
                    if(child instanceof LibElement)
                        child.setParent(libelement)
                }

            }
            else if(typeof arguments[a] === 'object') {
                libelement.attributes(arguments[a])
            }
        }
    }
    
    UI.set(libelement.eid, libelement)
    
    return libelement;
}

function getLibElement( eid ) {
    return UI.get(eid)
}

function getLibElemByData(htmlelem) {

    if(!htmlelem) return null;

    let data = JSON.parse( htmlelem.getAttribute('data') );

    if(!data) return null;

    return getLibElement(data.eid);
}

function div() {
    return createLibElement('div', ...arguments);
}

function p() {
    return createLibElement('p', ...arguments);
}

function ul() {
    return createLibElement('ul', ...arguments);
}

function li() {
    return createLibElement('li', ...arguments);
}

function a() {
    return createLibElement('a', ...arguments);
}

function table() {
    return createLibElement('table', ...arguments);
}

function thead() {
    return createLibElement('thead', ...arguments);
}

function tbody() {
    return createLibElement('tbody', ...arguments);
}

function tfoot() {
    return createLibElement('tfoot', ...arguments);
}

function tr() {
    return createLibElement('tr', ...arguments);
}

function th() {
    return createLibElement('th', ...arguments);
}

function td() {
    return createLibElement('tdr', ...arguments);
}

function h1() {
    return createLibElement('h1', ...arguments);
}

function h2() {
    return createLibElement('h2', ...arguments);
}

function h3() {
    return createLibElement('h3', ...arguments);
}

function h4() {
    return createLibElement('h4', ...arguments);
}

function h5() {
    return createLibElement('h5', ...arguments);
}

function h6() {
    return createLibElement('h6', ...arguments);
}

function span() {
    return createLibElement('span', ...arguments);
}

function form() {
    return createLibElement('form', ...arguments);
}

function button() {
    return createLibElement('button', ...arguments);
}

function section() {
    return createLibElement('section', ...arguments);
}

function header() {
    return createLibElement('header', ...arguments);
}

function footer() {
    return createLibElement('footer', ...arguments);
}

function input() {
    return createLibElement('input', ...arguments);
}

function label() {
    return createLibElement('label', ...arguments);
}

function b() {
    return createLibElement('b', ...arguments);
}

export { 
    createLibElement, 
    getLibElement, 
    getLibElemByData,
    div, 
    p,
    ul,
    li,
    a,
    b,
    table,
    thead,
    tbody,
    tfoot,
    tr,
    th,
    td,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    span,
    form,
    button,
    section,
    header,
    footer,
    input,
    label,
 }