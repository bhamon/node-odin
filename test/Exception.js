'use strict';

let lib = {
	deps:{
		expect:require('chai').expect
	},
	odin:{
		Exception:require('../lib/Exception')
	}
};

describe('Exception', function() {
	describe('#constructor()', function() {
		it('should be correctly default initialized', function() {
			var ex = new lib.odin.Exception();

			lib.deps.expect(ex).to.have.a.property('name', 'Exception');
			lib.deps.expect(ex).to.have.a.property('stack').that.is.a('string').and.is.not.empty;
			lib.deps.expect(ex).to.have.a.property('message', '');
			lib.deps.expect(ex).to.have.a.property('details').that.is.an('object');
			lib.deps.expect(ex).to.have.a.property('cause').that.is.null;
		});

		it('should be correctly initialized', function() {
			var ex = new lib.odin.Exception('message', {foo:'bar'}, new Error());

			lib.deps.expect(ex).to.have.a.property('name', 'Exception');
			lib.deps.expect(ex).to.have.a.property('stack').that.is.a('string').and.is.not.empty;
			lib.deps.expect(ex).to.have.a.property('message', 'message');
			lib.deps.expect(ex).to.have.a.property('details').that.deep.equal({foo:'bar'});
			lib.deps.expect(ex).to.have.a.property('cause').that.is.an.instanceof(Error);
		});
	});
});