'use strict';

let lib = {
	deps:{
		expect:require('chai').expect
	},
	odin:{
		EnumSymbol:require('../lib/EnumSymbol')
	}
};

describe('EnumSymbol', function() {
	describe('#constructor()', function() {
		it('should be correctly initialized', function() {
			lib.deps.expect(function() {
				let s = new lib.odin.EnumSymbol('FOO');
			}).to.not.throw();
		});
	});

	describe('#toString()', function() {
		it('should be return the symbol name', function() {
			let s = new lib.odin.EnumSymbol('FOO');
			lib.deps.expect(s.toString()).to.equal('FOO');
		});
	});
});