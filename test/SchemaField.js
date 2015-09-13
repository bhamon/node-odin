'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		should:require('should')
	},
	odin:{
		Exception:require('../lib/Exception'),
		SchemaField:require('../lib/SchemaField')
	}
};

describe('SchemaField', function() {
	describe('#constructor()', function() {
		it('should throw on bad parameters', function() {
			(function() {
				new lib.odin.SchemaField();
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.SchemaField({});
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.SchemaField({foo:'bar'});
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.SchemaField({
					name:null,
					validator:lib.deps.joi.string().required()
				});
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.SchemaField({
					name:'field',
					validator:null
				});
			}).should.throw(lib.odin.Exception);
		});

		it('should be correctly initialized', function() {
			let id;
			let address;
			(function() {
				id = new lib.odin.SchemaField({
					name:'id',
					validator:lib.deps.joi.number().required(),
					readOnly:true
				});

				address = new lib.odin.SchemaField({
					name:'address',
					validator:lib.deps.joi.string().required()
				});
			}).should.not.throw();

			id.should.have.an.enumerable('name').which.is.equal('id');
			id.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			id.should.have.an.enumerable('readOnly').which.is.equal(true);

			address.should.have.an.enumerable('name').which.is.equal('address');
			address.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			address.should.have.an.enumerable('readOnly').which.is.equal(false);
		});
	});
});