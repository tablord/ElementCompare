//
// browserlike.js
//
// for node, make as if code is running in a browser, for test purposes only
/////////////////////////////////////////////////////////////////////////////

const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
global.$ = require('jquery')(dom.window);
