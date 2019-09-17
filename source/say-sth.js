/**
 * Hello function
 *
 * @function hello
 *
 * @param {string} [name="World"]
 *
 * @return {string}
 *
 * @example  // No parameter
 *
 *     hello()    //  "Hello, World !"
 *
 * @example  // One parameter
 *
 *     hello('JSDoc')    //  "Hello, JSDoc !"
 */

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
var window = dom.window;
console.log(window.document.querySelector("p").textContent); // "Hello world"
var $ = require('jquery')(window);

exports.hello = function (name) {

    var j$ = $('<div>')
    j$.text('Hello, ' + (name || 'World') + ' !');
    return j$[0].outerHTML;

};