'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		expect:require('chai').expect
	},
	odin:{
		Exception:require('../lib/Exception'),
		SchemaField:require('../lib/SchemaField')
	}
};

describe('SchemaField', function() {
	describe('#constructor()', function() {
		it('should throw on bad parameters', function() {
			lib.deps.expect(function() {
				new lib.odin.SchemaField();
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.SchemaField({});
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.SchemaField({foo:'bar'});
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.SchemaField({
					name:null,
					validator:lib.deps.joi.string().required()
				});
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.SchemaField({
					name:'field',
					validator:null
				});
			}).to.throw(lib.odin.Exception);
		});

		it('should be correctly initialized', function() {
			let id = new lib.odin.SchemaField({
				name:'id',
				validator:lib.deps.joi.number().required(),
				readOnly:true
			});

			let address = new lib.odin.SchemaField({
				name:'address',
				validator:lib.deps.joi.string().required()
			});

			lib.deps.expect(id).to.have.a.property('name', 'id');
			lib.deps.expect(id).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(id).to.have.a.property('readOnly', true);

			lib.deps.expect(address).to.have.a.property('name', 'address');
			lib.deps.expect(address).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(address).to.have.a.property('readOnly', false);
		});
	});
});