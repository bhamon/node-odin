'use strict';

var lib = {
	deps:{
		should:require('should')
	},
	odin:{
		Exception:require('../lib/Exception')
	}
};

describe('Exception', function() {
	describe('#constructor()', function() {
		it('should be correctly default initialized', function() {
			var ex = new lib.odin.Exception();
			ex.should.have.a.property('name').which.is.an.instanceof(String).and.equal('Exception');
			ex.should.have.a.property('stack').which.is.an.instanceof(String).and.is.not.empty;
			ex.should.have.a.property('message').which.is.an.instanceof(String).and.equal('');
			ex.should.have.a.property('details').which.is.an.instanceof(Object);
			ex.should.have.a.property('cause');
		});

		it('should be correctly initialized', function() {
			var ex = new lib.odin.Exception('message', {foo:'bar'}, new Error());

			ex.should.have.a.property('name').which.is.an.instanceof(String).and.equal('Exception');
			ex.should.have.a.property('stack').which.is.an.instanceof(String).and.is.not.empty;
			ex.should.have.a.property('message').which.is.an.instanceof(String).and.equal('message');
			ex.should.have.a.property('details').which.is.an.instanceof(Object).and.deepEqual({foo:'bar'});
			ex.should.have.a.property('cause').which.is.an.instanceof(Error);
		});
	});
});