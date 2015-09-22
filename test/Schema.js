'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		expect:require('chai').expect
	},
	odin:{
		Exception:require('../lib/Exception'),
		Schema:require('../lib/Schema'),
		SchemaField:require('../lib/SchemaField')
	}
};

describe('Schema', function() {
	describe('#constructor()', function() {
		it('should throw on bad parameters', function() {
			lib.deps.expect(function() {
				new lib.odin.Schema();
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Schema(true);
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Schema({
					abstract:true
				});
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Schema({
					parent:'test',
					abstract:false,
					fields:[]
				});
			}).to.throw(lib.odin.Exception);
		});

		it('should be correctly initialized', function() {
			let base = new lib.odin.Schema({
				abstract:true,
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});

			let schema = new lib.odin.Schema({
				parent:base,
				fields:[
					{name:'address', validator:lib.deps.joi.string().required()}
				]
			});

			lib.deps.expect(base).to.have.a.property('abstract', true);
			lib.deps.expect(base).to.have.a.property('parent', null);

			lib.deps.expect(function() {
				base.abstract = true;
			}).to.throw(TypeError);

			lib.deps.expect(schema).to.have.a.property('abstract', false);
			lib.deps.expect(schema).to.have.a.property('parent').that.is.an.instanceof(lib.odin.Schema);
		});
	});

	describe('#hasField()', function() {
		let schema;
		before(function() {
			schema = new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});
		});

		it('should not detect missing fields', function() {
			lib.deps.expect(schema.hasField('test')).to.equal(false);
		});

		it('should detect provided fields', function() {
			lib.deps.expect(schema.hasField('id')).to.equal(true);
			lib.deps.expect(schema.hasField('name')).to.equal(true);
		});
	});

	describe('#getField()', function() {
		let schema;
		let child;
		before(function() {
			schema = new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});

			child = new lib.odin.Schema({
				parent:schema,
				fields:[
					{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
					{name:'address', validator:lib.deps.joi.string().required()}
				]
			});
		});

		it('should not return missing fields', function() {
			lib.deps.expect(schema.getField('test')).to.be.null;
		});

		it('should return provided fields', function() {
			let id = schema.getField('id');
			lib.deps.expect(id).to.be.an('object');
			lib.deps.expect(id).to.have.a.property('name', 'id');
			lib.deps.expect(id).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(id).to.have.a.property('readOnly', true);

			let name = schema.getField('name');
			lib.deps.expect(name).to.be.an('object');
			lib.deps.expect(name).to.have.a.property('name', 'name');
			lib.deps.expect(name).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(name).to.have.a.property('readOnly', false);
		});

		it('should return inalterable fields', function() {
			let id = schema.getField('id');

			lib.deps.expect(function() {
				id.name = 'test';
			}).to.throw(TypeError);

			lib.deps.expect(function() {
				id.validator = lib.deps.joi.boolean();
			}).to.throw(TypeError);

			lib.deps.expect(function() {
				id.readOnly = true;
			}).to.throw(TypeError);
		});

		it('should return children fields', function() {
			let address = child.getField('address');
			lib.deps.expect(address).to.be.an('object');
			lib.deps.expect(address).to.have.a.property('name', 'address');
			lib.deps.expect(address).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(address).to.have.a.property('readOnly', false);
		});

		it('should return parent fields', function() {
			let id = child.getField('id');
			lib.deps.expect(id).to.be.an('object');
			lib.deps.expect(id).to.have.a.property('name', 'id');
			lib.deps.expect(id).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(id).to.have.a.property('readOnly', true);
		});

		it('should return overriden fields', function() {
			let name = child.getField('name');
			lib.deps.expect(name).to.be.an('object');
			lib.deps.expect(name).to.have.a.property('name', 'name');
			lib.deps.expect(name).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(name).to.have.a.property('readOnly', true);
		});
	});

	describe('#collectFields()', function() {
		let schema;
		let child;
		before(function() {
			schema = new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});

			child = new lib.odin.Schema({
				parent:schema,
				fields:[
					{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
					{name:'address', validator:lib.deps.joi.string().required()}
				]
			});
		});

		it('should return all the provided fields with inheritance support', function() {
			let fields = child.collectFields();

			lib.deps.expect(fields).to.be.an.instanceof(Map);
			lib.deps.expect(fields).to.have.a.property('size', 3);

			let id = fields.get('id');
			lib.deps.expect(id).to.be.an('object');
			lib.deps.expect(id).to.have.a.property('name', 'id');
			lib.deps.expect(id).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(id).to.have.a.property('readOnly', true);

			let name = fields.get('name');
			lib.deps.expect(name).to.be.an('object');
			lib.deps.expect(name).to.have.a.property('name', 'name');
			lib.deps.expect(name).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(name).to.have.a.property('readOnly', true);

			let address = fields.get('address');
			lib.deps.expect(address).to.be.an('object');
			lib.deps.expect(address).to.have.a.property('name', 'address');
			lib.deps.expect(address).to.have.a.property('validator').that.is.an('object');
			lib.deps.expect(address).to.have.a.property('readOnly', false);
		});
	});

	describe('#populate()', function() {
		let schema;
		let child;
		before(function() {
			schema = new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'stub', validator:lib.deps.joi.string().required()},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});

			child = new lib.odin.Schema({
				parent:schema,
				fields:[
					{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
					{name:'address', validator:lib.deps.joi.string().required()}
				]
			});
		});

		it('should populate the provided object', function() {
			let instance = {};
			child.populate(instance, {
				id:2,
				name:'John Doe',
				address:'1, Potato Plazza, Roma',
				extra:'foo'
			});

			lib.deps.expect(instance).to.have.a.property('id', 2);
			lib.deps.expect(instance).to.have.a.property('stub').that.is.undefined;
			lib.deps.expect(instance).to.have.a.property('name', 'John Doe');
			lib.deps.expect(instance).to.have.a.property('address', '1, Potato Plazza, Roma');
			lib.deps.expect(instance).to.not.have.a.property('extra');

			lib.deps.expect(function() {
				instance.id = 25;
			}).to.throw(TypeError);

			lib.deps.expect(function() {
				instance.name = 'Jane Doe';
			}).to.throw(TypeError);

			lib.deps.expect(function() {
				instance.address = '221b, Baker street, London';
			}).to.not.throw();

			lib.deps.expect(instance).to.have.a.property('address', '221b, Baker street, London');
		});
	});

	describe('#validate()', function() {
		let schema;
		let child;
		before(function() {
			schema = new lib.odin.Schema({
				fields:[
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]
			});

			child = new lib.odin.Schema({
				parent:schema,
				fields:[
					{name:'name', validator:lib.deps.joi.string().required().uppercase().min(4), readOnly:true},
					{name:'address', validator:lib.deps.joi.string().required().uppercase()},
					{name:'extra', validator:lib.deps.joi.string().optional().default('test')},
					{name:'extraReadOnly', validator:lib.deps.joi.string().optional().default('test'), readOnly:true}
				]
			});
		});

		it('should detect invalid fields', function() {
			lib.deps.expect(function() {
				schema.validate({
					id:'test'
				});
			}).to.throw(lib.odin.Exception);
		});

		it('should detect invalid parent fields', function() {
			lib.deps.expect(function() {
				child.validate({
					id:10,
					name:'John Doe',
					address:25
				});
			}).to.throw(lib.odin.Exception);
		});

		it('should detect invalid overriden fields', function() {
			lib.deps.expect(function() {
				child.validate({
					id:10,
					name:'Joe',
					address:'1, rue de Paris'
				});
			}).to.throw(lib.odin.Exception);
		});

		it('should auto-correct fields', function() {
			let instance = {
				id:10,
				name:'John Doe',
				address:'1, rue de Paris',
				extraReadOnly:'foo'
			};

			lib.deps.expect(function() {
				child.validate(instance);
			}).to.not.throw();

			lib.deps.expect(instance).to.have.a.property('name', 'John Doe');
			lib.deps.expect(instance).to.have.a.property('address', '1, RUE DE PARIS');
			lib.deps.expect(instance).to.have.a.property('extra', 'test');
			lib.deps.expect(instance).to.have.a.property('extraReadOnly', 'foo');
		});
	});
});