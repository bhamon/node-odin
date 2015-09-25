'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		expect:require('chai').expect
	},
	odin:{
		Exception:require('../lib/Exception'),
		Schema:require('../lib/Schema'),
		Model:require('../lib/Model')
	}
};

describe('Model', function() {
	describe('#constructor()', function() {
		it('should throw on bad parameter', function() {
			lib.deps.expect(function() {
				new lib.odin.Model();
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Model(
					new lib.odin.Schema(false, [
						{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
						{name:'name', validator:lib.deps.joi.string().required()}
					])
				);
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Model({}, {});
			}).to.throw(lib.odin.Exception);
		});

		it('should prevent abstract construction', function() {
			lib.deps.expect(function() {
				new lib.odin.Model(
					new lib.odin.Schema(true, [
						{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
						{name:'name', validator:lib.deps.joi.string().required()}
					]),
					{
						id:21,
						name:'Jane Doe'
					}
				);
			}).to.throw(lib.odin.Exception);
		});

		it('should be correctly initialized and populated', function() {
			let instance = new lib.odin.Model(
				new lib.odin.Schema({
					fields:[
						{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
						{name:'name', validator:lib.deps.joi.string().required()}
					]
				}),
				{
					id:21,
					name:'Jane Doe'
				}
			);

			lib.deps.expect(instance).to.be.an.instanceof(lib.odin.Model);
			lib.deps.expect(instance).to.have.a.property('schema').that.is.an.instanceof(lib.odin.Schema);
			lib.deps.expect(instance).to.have.a.property('id');
			lib.deps.expect(instance).to.have.a.property('name');
		});
	});

	describe('#validate()', function() {
		let instance = new lib.odin.Model(
			new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			}),
			{
				id:21,
				name:'Jane Doe'
			}
		);

		it('should validate the model instance', function() {
			lib.deps.expect(function() {
				instance.validate();
			}).to.not.throw();
		});
	});

	describe('.create()', function() {
		it('should create a new model', function() {
			let model = lib.odin.Model.create({
				abstract:true,
				init:function() {
					this.extra = true;
				},
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});
		});
	});
});