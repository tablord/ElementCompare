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
require('./browserlike');

exports.hello = function (name) {

    var j$ = $('<div>')
    j$.text('Hello, ' + (name || 'World') + ' !');
    return j$[0].outerHTML;

};