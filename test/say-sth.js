'use strict';

require('should');



var saySth = require('../source/say-sth');


describe('hello',  function () {


    it('No parameter',  function () {

        var result = saySth.hello();

        result.should.be.deepEqual( "<div>Hello, World !</div>" );
    });


    it('One parameter',  function () {

        var result = saySth.hello('JSDoc');

        result.should.be.deepEqual( "<div>Hello, JSDoc !</div>" );
    });

});