'use strict';

let lib = {
	deps:{
		expect:require('chai').expect
	},
	odin:{
		Exception:require('../lib/Exception'),
		Enum:require('../lib/Enum'),
		EnumSymbol:require('../lib/EnumSymbol')
	}
};

describe('Enum', function() {
	let e = new lib.odin.Enum([
		'FOO',
		'BAR',
		'TEST'
	]);

	describe('#constructor()', function() {
		it('should be correctly initialized', function() {
			lib.deps.expect(e).to.have.a.property('FOO').that.is.an.instanceof(lib.odin.EnumSymbol);
			lib.deps.expect(e).to.have.a.property('BAR').that.is.an.instanceof(lib.odin.EnumSymbol);
			lib.deps.expect(e).to.have.a.property('TEST').that.is.an.instanceof(lib.odin.EnumSymbol);
		});
	});

	describe('#keys()', function() {
		it('should contain all the defined litterals', function() {
			let keys = Array.from(e.keys());
			lib.deps.expect(keys.length).to.equal(3);
			lib.deps.expect(keys).to.contain('FOO');
			lib.deps.expect(keys).to.contain('BAR');
			lib.deps.expect(keys).to.contain('TEST');
		});
	});

	describe('#values()', function() {
		it('should contain all the wrapped litterals', function() {
			let symbols = Array.from(e.symbols());
			lib.deps.expect(symbols.length).to.equal(3);
			for(let symbol of symbols) {
				lib.deps.expect(symbol).to.be.an.instanceof(lib.odin.EnumSymbol);
			}
		});
	});

	describe('#values()', function() {
		it('should throw for unknown symbols', function() {
			lib.deps.expect(function() {
				e.forKey('ANOTHER');
			}).to.throw(lib.odin.Exception);
		});

		it('should returns correct symbols', function() {
			lib.deps.expect(e.forKey('FOO')).to.equal(e.FOO);
			lib.deps.expect(e.forKey('BAR')).to.equal(e.BAR);
			lib.deps.expect(e.forKey('TEST')).to.equal(e.TEST);
		});
	});
});