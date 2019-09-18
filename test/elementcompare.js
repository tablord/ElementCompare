'use strict';

require('should');



let ElementCompare = require('../source/elementcompare');


describe('ElementCompare',  function () {
    it('check constructor can be call with Jquery and string parameters',  function () {
        var comp = new ElementCompare($('<div>hello</div>'),"<div>hello</div>");
        comp.toDebug().should.be.deepEqual( 'ElementCompare of "<div>hello</div>" and "<div>hello</div>"');
    });

    it('check simple tag difference', function(){
        var comp = new ElementCompare("<div>Hello</div>","<span>Hello</span>");
        comp.compare().should.be.false();
        comp.errors.should.be.deepEqual(['tag differs. <DIV> != <SPAN>'])
    });

    it('check attribute difference', function(){
        var comp = new ElementCompare("<div title='toto'>Hello</div>","<div href='tutu'>Hello</div>");
        comp.compare().should.be.false();
        comp.errors.should.be.deepEqual(["<DIV> has attribute 'title' but not <DIV>","<DIV> miss attribute 'href' that <DIV> has"])
    });
});