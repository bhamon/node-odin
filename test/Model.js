'use strict';

var lib = {
	node:{
		events:require('events')
	},
	deps:{
		joi:require('joi'),
		should:require('should')
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
			(function() {
				new lib.odin.Model();
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Model(
					new lib.odin.Schema(false, [
						{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
						{name:'name', validator:lib.deps.joi.string().required()}
					])
				);
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Model({}, {});
			}).should.throw(lib.odin.Exception);
		});

		it('should prevent abstract construction', function() {
			(function() {
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
			}).should.throw(lib.odin.Exception);
		});

		it('should be correctly initialized and populated', function() {
			(function() {
				var instance = new lib.odin.Model(
					new lib.odin.Schema(false, [
						{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
						{name:'name', validator:lib.deps.joi.string().required()}
					]),
					{
						id:21,
						name:'Jane Doe'
					}
				);

				instance.should.be.instanceof(lib.node.events.EventEmitter);
				instance.should.have.a.property('schema').instanceof(lib.odin.Schema);
				instance.should.have.an.enumerable('id');
				instance.should.have.an.enumerable('name');
			}).should.not.throw();

		});
	});

	describe('#validate()', function() {
		var instance = new lib.odin.Model(
			new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'name', validator:lib.deps.joi.string().required()}
			]),
			{
				id:21,
				name:'Jane Doe'
			}
		);

		it('should validate the model instance', function() {
			(function() {
				instance.validate();
			}).should.not.throw();
		});
	});

	describe('.create()', function() {
		it('should create a new model', function() {
			var model = lib.odin.Model.create({
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