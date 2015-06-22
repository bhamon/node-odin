'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		should:require('should'),
		shouldPromised:require('should-promised')
	},
	odin:{
		util:require('../lib/util'),
		Exception:require('../lib/Exception')
	}
};

describe('util', function() {
	describe('validate', function() {
		it('should throw on bad parameters', function() {
			(function() {
				lib.odin.util.validate();
			}).should.throw();

			(function() {
				lib.odin.util.validate('test');
			}).should.throw();

			(function() {
				lib.odin.util.validate('foo', 'bar');
			}).should.throw();

			(function() {
				lib.odin.util.validate(21, {});
			}).should.throw();
		});

		it('should throw when validation fails', function() {
			(function() {
				lib.odin.util.validate('test', lib.deps.joi.object().required());
			}).should.throw(lib.odin.Exception);
		});

		it('should return the validated data set', function() {
			(function() {
				lib.odin.util.validate('test', lib.deps.joi.string().uppercase().required()).should.be.a.String.which.is.equal('TEST');
			}).should.not.throw();
		});
	});

	describe('array', function() {
		describe('.toSet()', function() {
			it('should throw on bad parameters', function() {
				(function() {
					lib.odin.util.array.toSet();
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet(null);
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet(21);
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet('test');
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet({foo:'bar'});
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet(function() {});
				}).should.throw(lib.odin.Exception);

				(function() {
					lib.odin.util.array.toSet([21, {foo:'bar'}]);
				}).should.throw(lib.odin.Exception);
			});

			it('should return an empty set for an empty array', function() {
				lib.odin.util.array.toSet([]).should.be.an.Object.which.is.empty;
			});

			it('should return a correctly filled object', function() {
				lib.odin.util.array.toSet(['test', 'foo', 'bar']).should.be.an.Object.which.eql({
					test:true,
					foo:true,
					bar:true
				});
			});
		});
	});
});