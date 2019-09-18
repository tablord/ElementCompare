// elementcompare.js
//
// This defines the global tb variable where all modules will plug
//
// (CC-BY-SA 2019)Marc Nicole  according to https://creativecommons.org/
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('./browserlike');

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

ElementCompare.prototype.replaceLocationsInMessage = function(message) {
    // replace in message the {e1} and {e2} tags with the corresponding location
    // in the stack
    let loc1 = '';
    let loc2 = '';
    for (let i = this.locations.length-1; i>= 0; i-- ){
        loc1 += '<'+this.locations[i].e1.tagName+'>';
        loc2 += '<'+this.locations[i].e2.tagName+'>';
    }
    return message.replace('{e1}',loc1).replace('{e2}',loc2);
};

ElementCompare.prototype.error = function(message) {
    // push a new error message
    this.errors.push(this.replaceLocationsInMessage(message));
};

ElementCompare.prototype.compare = function(options) {
    // compare the 2 elements and store internally the difference if any
    // return true if equal false otherwise
    var comp = this;
    function compareChild(e1,e2) {
        comp.pushLocation(e1,e2);

        if (e1.tagName !== e2.tagName) {
            comp.error('tag differs. {e1} != {e2}');
        }
        if (e1.attributes.length !== e2.attributes.length){
            comp.error("don't have the same number of attributes {e1} has "+e1.attributes.length+" and {e2} has "+e2.attributes.length);
        }
        for (i = 0; i < e1.attributes.length; i++) {
            var attributeName = e1.attributes[i].name;
            var e1Value = e1.attributes[i].value;
            var e2Value = e2.getAttribute(attributeName);
            if (e2Value === null || e2Value === '') {
                comp.error ("{e1} has attribute '"+attributeName+ "' but not {e2}");
            }
            else if (e1Value !== e2Value) {
                comp.error ("{e1} attribute '"+attributeName+"='"+e1Value+" differs from {e2} '"+e2+"'");
            }
        }
        for (i = 0; i < e2.attributes.length; i++) {
            var attributeName = e2.attributes[i].name;
            var e2Value = e2.attributes[i].value;
            var e1Value = e1.getAttribute(attributeName);
            if (e1Value === null || e1Value === '') {
                comp.error ("{e1} miss attribute '"+attributeName+ "' that {e2} has");
            }
        }
        comp.popLocation();
    }

    options = options || {};
    compareChild(this.e1,this.e2);
    return this.errors.length === 0;
};


module.exports = ElementCompare;