'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		should:require('should')
	},
	odin:{
		Exception:require('../lib/Exception'),
		Schema:require('../lib/Schema')
	}
};

describe('Schema', function() {
	describe('#constructor()', function() {
		it('should throw on bad parameters', function() {
			(function() {
				new lib.odin.Schema();
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Schema(true);
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Schema({}, []);
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Schema(true, [], {});
			}).should.throw(lib.odin.Exception);

			(function() {
				new lib.odin.Schema(false, [
					{foo:'bar'}
				]);
			}).should.throw(lib.odin.Exception);
		});

		it('should be correctly initialized', function() {
			var base;
			var schema;
			(function() {
				base = new lib.odin.Schema(true, [
					{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
					{name:'name', validator:lib.deps.joi.string().required()}
				]);
				schema = new lib.odin.Schema(false, [
					{name:'address', validator:lib.deps.joi.string().required()}
				], base);
			}).should.not.throw();

			base.should.have.an.enumerable('abstract').which.is.equal(true);
			base.should.have.an.enumerable('parent').which.is.null;

			(function() {
				base.abstract = true;
			}).should.throw(TypeError);

			schema.should.have.an.enumerable('abstract').which.is.equal(false);
			schema.should.have.an.enumerable('parent').Object.which.is.instanceof(lib.odin.Schema);
		});
	});

	describe('#hasField()', function() {
		var schema;
		before(function() {
			schema = new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'name', validator:lib.deps.joi.string().required()}
			]);
		});

		it('should not detect missing fields', function() {
			schema.hasField('test').should.be.equal(false);
		});

		it('should detect provided fields', function() {
			schema.hasField('id').should.be.equal(true);
			schema.hasField('name').should.be.equal(true);
		});
	});

	describe('#getField()', function() {
		var schema;
		var child;
		before(function() {
			schema = new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'name', validator:lib.deps.joi.string().required()}
			]);
			child = new lib.odin.Schema(false, [
				{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
				{name:'address', validator:lib.deps.joi.string().required()}
			], schema);
		});

		it('should not return missing fields', function() {
			lib.deps.should.equal(schema.getField('test'), null);
		});

		it('should return provided fields', function() {
			var id = schema.getField('id');
			id.should.be.an.Object;
			id.should.have.an.enumerable('name').String.which.equal('id');
			id.should.have.an.enumerable('validator').Object;
			id.should.have.an.enumerable('readOnly').Boolean.which.equal(true);

			var name = schema.getField('name');
			name.should.be.an.Object;
			name.should.have.an.enumerable('name').String.which.equal('name');
			name.should.have.an.enumerable('validator').Object;
			name.should.have.an.enumerable('readOnly').Boolean.which.equal(false);
		});

		it('should return inalterable fields', function() {
			var id = schema.getField('id');

			(function() {
				id.name = 'test';
			}).should.throw(TypeError);

			(function() {
				id.validator = lib.deps.joi.boolean();
			}).should.throw(TypeError);

			(function() {
				id.readOnly = true;
			}).should.throw(TypeError);
		});

		it('should return children fields', function() {
			var address = child.getField('address');
			address.should.be.an.Object;
			address.should.have.an.enumerable('name').String.which.equal('address');
			address.should.have.an.enumerable('validator').Object;
			address.should.have.an.enumerable('readOnly').Boolean.which.equal(false);
		});

		it('should return parent fields', function() {
			var id = child.getField('id');
			id.should.be.an.Object;
			id.should.have.an.enumerable('name').String.which.equal('id');
			id.should.have.an.enumerable('validator').Object;
			id.should.have.an.enumerable('readOnly').Boolean.which.equal(true);
		});

		it('should return overriden fields', function() {
			var name = child.getField('name');
			name.should.be.an.Object;
			name.should.have.an.enumerable('name').String.which.equal('name');
			name.should.have.an.enumerable('validator').Object;
			name.should.have.an.enumerable('readOnly').Boolean.which.equal(true);
		});
	});

	describe('#collectFields()', function() {
		var schema;
		var child;
		before(function() {
			schema = new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'name', validator:lib.deps.joi.string().required()}
			]);
			child = new lib.odin.Schema(false, [
				{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
				{name:'address', validator:lib.deps.joi.string().required()}
			], schema);
		});

		it('should return all the provided fields with inheritance support', function() {
			var fields = child.collectFields();

			fields.should.be.an.Object;
			fields.should.have.a.property('id').Object;
			fields.should.have.a.property('name').Object;
			fields.should.have.a.property('address').Object;
			Object.keys(fields).length.should.be.equal(3);

			fields.id.should.have.an.enumerable('name').String.which.equal('id');
			fields.id.should.have.an.enumerable('validator').Object;
			fields.id.should.have.an.enumerable('readOnly').Boolean.which.equal(true);

			fields.name.should.have.an.enumerable('name').String.which.equal('name');
			fields.name.should.have.an.enumerable('validator').Object;
			fields.name.should.have.an.enumerable('readOnly').Boolean.which.equal(true);

			fields.address.should.have.an.enumerable('name').String.which.equal('address');
			fields.address.should.have.an.enumerable('validator').Object;
			fields.address.should.have.an.enumerable('readOnly').Boolean.which.equal(false);
		});
	});

	describe('#populate()', function() {
		var schema;
		var child;
		before(function() {
			schema = new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'stub', validator:lib.deps.joi.string().required()},
				{name:'name', validator:lib.deps.joi.string().required()}
			]);
			child = new lib.odin.Schema(false, [
				{name:'name', validator:lib.deps.joi.string().required(), readOnly:true},
				{name:'address', validator:lib.deps.joi.string().required()}
			], schema);
		});

		it('should populate the provided object', function() {
			var instance = {};
			child.populate(instance, {
				id:2,
				name:'John Doe',
				address:'1, Potato Plazza, Roma',
				extra:'foo'
			});

			instance.should.have.an.enumerable('id').Number.which.equal(2);
			instance.should.have.an.enumerable('stub').which.is.undefined;
			instance.should.have.an.enumerable('name').String.which.equal('John Doe');
			instance.should.have.an.enumerable('address').String.which.equal('1, Potato Plazza, Roma');
			instance.should.not.have.an.enumerable('extra');

			(function() {
				instance.id = 25;
			}).should.throw(TypeError);

			(function() {
				instance.name = 'Jane Doe';
			}).should.throw(TypeError);

			(function() {
				instance.address = '221b, Baker street, London';
				instance.address.should.be.equal('221b, Baker street, London');
			}).should.not.throw();
		});
	});

	describe('#validate()', function() {
		var schema;
		var child;
		before(function() {
			schema = new lib.odin.Schema(false, [
				{name:'id', validator:lib.deps.joi.number().required(), readOnly:true},
				{name:'name', validator:lib.deps.joi.string().required()}
			]);
			child = new lib.odin.Schema(false, [
				{name:'name', validator:lib.deps.joi.string().required().uppercase().min(4), readOnly:true},
				{name:'address', validator:lib.deps.joi.string().required().uppercase()},
				{name:'extra', validator:lib.deps.joi.string().optional().default('test')},
				{name:'extraReadOnly', validator:lib.deps.joi.string().optional().default('test'), readOnly:true}
			], schema);
		});

		it('should detect invalid fields', function() {
			(function() {
				schema.validate({
					id:'test'
				});
			}).should.throw(lib.odin.Exception);
		});

		it('should detect invalid parent fields', function() {
			(function() {
				child.validate({
					id:10,
					name:'John Doe',
					address:25
				});
			}).should.throw(lib.odin.Exception);
		});

		it('should detect invalid overriden fields', function() {
			(function() {
				child.validate({
					id:10,
					name:'Joe',
					address:'1, rue de Paris'
				});
			}).should.throw(lib.odin.Exception);
		});

		it('should auto-correct fields', function() {
			var instance = {
				id:10,
				name:'John Doe',
				address:'1, rue de Paris',
				extraReadOnly:'foo'
			};

			(function() {
				child.validate(instance);
			}).should.not.throw();

			instance.name.should.be.equal('John Doe');
			instance.address.should.be.equal('1, RUE DE PARIS');
			instance.should.have.a.property('extra').String.which.equal('test');
			instance.should.have.a.property('extraReadOnly').String.which.equal('foo');
		});
	});
});