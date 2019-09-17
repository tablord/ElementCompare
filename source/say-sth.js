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

exports.hello = function (name) {

    return  'Hello, ' + (name || 'World') + ' !';
};