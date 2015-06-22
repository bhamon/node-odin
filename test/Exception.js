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

			ex.should.have.an.enumerable('name').String.which.equal('Exception');
			ex.should.have.an.enumerable('stack').String.which.is.not.empty;
			ex.should.have.an.enumerable('message').String.which.equal('');
			ex.should.have.an.enumerable('details').Object;
			ex.should.have.an.enumerable('cause');
		});

		it('should be correctly initialized', function() {
			var ex = new lib.odin.Exception('message', {foo:'bar'}, new Error());

			ex.should.have.an.enumerable('name').String.which.equal('Exception');
			ex.should.have.an.enumerable('stack').String.which.is.not.empty;
			ex.should.have.an.enumerable('message').String.which.equal('message');
			ex.should.have.an.enumerable('details').which.eql({foo:'bar'});
			ex.should.have.an.enumerable('cause').which.is.instanceof(Error);
		});
	});
});