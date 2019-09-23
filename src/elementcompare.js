// elementcompare.js
//
// This defines the global tb variable where all modules will plug
//
// (CC-BY-SA 2019)Marc Nicole  according to https://creativecommons.org/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('./browserlike');

if(!process.browser){
    let ElementCompare;  // if in Node, do not expose directly like in a browser
}

ElementCompare = function(e1,e2) {
    // HtmlCompare is a class that compare 2 Dom Element
    // e1 and e2 can either be:
    // - a jQuery (where only the first element will be taken into account
    // - a DOM Element
    // - a string representing the html of an element
    if (e1 instanceof $) this.e1 = e1[0];
    else if (typeof e1 === 'string') this.e1 = $(e1)[0];
    else this.e1 = e1;
    if (e2 instanceof $) this.e2 = e2[0];
    else if (typeof e2 === 'string') this.e2 = $(e2)[0];
    else this.e2 = e2;

    this.errors = [];
    this.locations = [];
    this.e1.normalize();
    this.e2.normalize();
};

ElementCompare.prototype.toDebug = function(){
    // return a string describing the element compare in order to debug
    return 'ElementCompare of "'+this.e1.outerHTML+'" and "'+this.e2.outerHTML+'"';
};

ElementCompare.prototype.pushLocation = function(e1,e2){
    // push the 2 elements on the locations stack
    this.locations.push({e1:e1,e2:e2});
};

ElementCompare.prototype.popLocation = function(){
    this.locations.pop();
};

ElementCompare.prototype.errorMessages = function() {
    return this.errors.map(err => err.message);
};
ElementCompare.prototype.replaceLocationsInMessage = function(message) {
    // replace in message the {e1} and {e2} tags with the corresponding location
    // in the stack
    let loc1 = '1:';
    let loc2 = '2:';
    for (let i =0; i < this.locations.length; i++){
        loc1 += '<'+this.locations[i].e1.tagName+'>';
        loc2 += '<'+this.locations[i].e2.tagName+'>';
    }
    return message.replace('{n1}',loc1).replace('{n2}',loc2);
};

ElementCompare.prototype.error = function(message) {
    // push a new error message
    this.errors.push({message:this.replaceLocationsInMessage(message),
                      e1:this.locations[this.locations.length-1].e1,
                      e2:this.locations[this.locations.length-1].e2});
};

ElementCompare.prototype.compare = function(options) {
    // compare the 2 elements and store internally the difference if any
    // return true if equal false otherwise
    let comp = this;
    function compareChildNode(n1,n2) {
        comp.pushLocation(n1,n2);
        if (n1.tagName !== n2.tagName) {
            comp.error('tag differs. {n1} != {n2}');
        }
        if (n1.attributes === undefined){
            let a = 2;
        }
        if (n1.attributes.length !== n2.attributes.length){
            comp.error("don't have the same number of attributes {n1} has "+n1.attributes.length+" and {n2} has "+n2.attributes.length);
        }
        for (let i = 0; i < n1.attributes.length; i++) {
            let attributeName = n1.attributes[i].name;
            let e1Value = n1.attributes[i].value;
            let e2Value = n2.getAttribute(attributeName);
            if (e2Value === null || e2Value === '') {
                comp.error ("{n1} has attribute '"+attributeName+ "' but not {n2}");
            }
            else if (e1Value !== e2Value) {
                comp.error ("{n1} attribute '"+attributeName+"='"+e1Value+" differs from {n2} '"+n2+"'");
            }
        }
        for (let i = 0; i < n2.attributes.length; i++) {
            let attributeName = n2.attributes[i].name;
            let e2Value = n2.attributes[i].value;
            let e1Value = n1.getAttribute(attributeName);
            if (e1Value === null || e1Value === '') {
                comp.error ("{n1} miss attribute '"+attributeName+ "' that {n2} has");
            }
        }
        let i1 = 0;
        let i2 = 0;
        while ((i1 < n1.childNodes.length) || (i2 < n2.childNodes.length)) {
            let ch1 = n1.childNodes[i1];
            let ch2 = n2.childNodes[i2];
            if (i1 >= n1.childNodes.length) {
                comp.error("{n2} has an extra child "+ch2.tagName);
                i2++;
                continue;
            }
            if (i2 >= n2.childNodes.length) {
                comp.error("{n1} has an extra child "+ch1.tagName);
                i1++;
                continue;
            }
            if ((ch1.nodeType === 3) && (ch2.nodeType === 3)) {
                if (ch1.textContent !== ch2.textContent) {
                    comp.error("{n1}textContent='" + ch1.textContent + "' {n2}textContent='" + ch2.textContent + "'");
                }
                i1++;
                i2++;
                continue;
            }
            if ((ch1.nodeType === 1) && ( ch2.nodeType) === 1) {
                // if of same type, just compare
                //console.info('i1:',i1,'i2:',i2)
                compareChildNode(ch1,ch2);
                i1++;
                i2++;
                continue;
            }
            else {
                // 2 nodes of different type  TODO yet assuming a textNode and an ELEMENT, but generally should handle all possibilities
                if (ch1.nodeType === 3) {
                    comp.error("{n1} has an extra textNode='"+n1.childNodes[i1].textContent);
                    i1++;
                }
                else if (ch2.nodeType === 3) {
                    comp.error("{n2} has an extra textNode='"+n2.childNodes[i1].textContent);
                    i2++;
                }
            }
        }
        comp.popLocation();
    }

    options = $.extend({attributes:{id:ElementCompare.ignore,class:ElementCompare.spaceSeparatedValues}},options);
    compareChildNode(this.e1,this.e2);
    return this.errors.length === 0;
};

ElementCompare.ignore = function() {
    return true;
};

ElementCompare.normalizeClasses = function(c) {
    // rewrite classes in a normalized way (alphabetic order)
    return c.trim().replace(/\s\s*/,' ').split(' ').sort().join(' ');
};

ElementCompare.classes = function(v1,v2) {
    // compare classes or any list of space separated values
    v1 = ElementCompare.normalizeClasses(v1);
    v2 = ElementCompare.normalizeClasses(v2);
    return v1 === v2;
};

ElementCompare.normalizeCssAttr = function(css) {
    // normalize one css_attr:param1 param2...  (with or without ;)
    // the return css attr will have a trailling ;
    css = css.replace(/\s*,\s*/g,','); // suppress any space before or after , so that it will be considered as one word (like for font)
    var av = css.match(/(\w+)\s*:\s*([^;]+)/);
    return av[1]+':'+ElementCompare.normalizeClasses(av[2])+';';
};

ElementCompare.normalizeStyle = function(style) {
    // normalize the content of a style
    let cssAttrs = style.trim().replace(/\s\s*/,' ').replace(/; /,';').split(';').sort();
    if (cssAttrs[0] === '') cssAttrs.shift(); // remove the possible empty string that was created after the last ; during split
    cssAttrs = cssAttrs.map(cssAttr => ElementCompare.normalizeCssAttr(cssAttr));
    return cssAttrs.join(' ');
};

ElementCompare.styles = function(v1,v2) {
    // compare styles that are ; separated and within the style, like classes
    var styles1, styles2;
    styles1 = v1.replace(/\s\s*/,' ').replace(/; /,';').split(';').sort();
    styles1 = v2.replace(/\s\s*/,' ').replace(/; /,';').split(';').sort();

};
if (!process.browser) {
    module.exports = ElementCompare;
}
