'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		should:require('should')
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
				lib.odin.util.validate('test', lib.deps.joi.string().uppercase().required()).should.be.an.instanceof(String).which.equal('TEST');
			}).should.not.throw();
		});
	});
});