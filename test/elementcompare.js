'use strict';




if (!process.browser) {
    require('should');
    let ElementCompare = require('../src/elementcompare');
}


describe('ElementCompare',  function () {
    it('check constructor can be call with Jquery and string parameters',  function () {
        let comp = new ElementCompare($('<div>hello</div>'),"<div>hello</div>");
        comp.toDebug().should.be.deepEqual( 'ElementCompare of "<div>hello</div>" and "<div>hello</div>"');
    });

    it('check simple tag difference', function(){
        let comp = new ElementCompare("<div>Hello</div>","<span>Hello</span>");
        comp.compare().should.be.false();
        comp.errorMessages().should.be.deepEqual(['tag differs. 1:<DIV> != 2:<SPAN>']);
    });

    it('check attribute difference', function(){
        let comp = new ElementCompare("<div title='toto'>Hello</div>","<div href='tutu'>Hello</div>");
        comp.compare().should.be.false();
        comp.errorMessages().should.be.deepEqual(["1:<DIV> has attribute 'title' but not 2:<DIV>","1:<DIV> miss attribute 'href' that 2:<DIV> has"]);
    });

    it('check text difference', function(){
        let comp = new ElementCompare("<div>Hello</div>","<div>Bonjour</div>");
        comp.compare().should.be.false();
        comp.errorMessages().should.be.deepEqual(["1:<DIV>textContent='Hello' 2:<DIV>textContent='Bonjour'"]);
    });

    it('check text difference in child', function(){
        let comp = new ElementCompare("<div><h1>Hello</h1>Good morning</div>","<div><h1>Bonjour</h1>Good morning</div>");
        comp.compare().should.be.false();
        comp.errorMessages().should.be.deepEqual(["1:<DIV><H1>textContent='Hello' 2:<DIV><H1>textContent='Bonjour'"]);
    });

    it('check that ElementCompare.classes compare classes without any order or spaces consideration', function(){
        ElementCompare.classes("toto tutu titi","titi tutu toto").should.be.true();
        ElementCompare.classes("toto           tutu titi","titi tutu toto").should.be.true();
        ElementCompare.classes("toto tyty titi","titi tutu toto").should.be.false();
        ElementCompare.classes("  toto tutu titi  ","titi tutu toto").should.be.true();
    });

    it("ckeck that normalizeStyle doesn't take into consideration multiple space and order of multiple parameters",function(){
        ElementCompare.normalizeCssAttr('font   : arial,    sans-serif 15px ;').should.be.equal('font:15px arial,sans-serif;');
    });

    it("check normalizeStyle", function(){
        ElementCompare.normalizeStyle('font   : arial,    sans-serif 15px ;    color  : blue;  ').should.be.equal('color:blue; font:15px arial,sans-serif;')
    })
});