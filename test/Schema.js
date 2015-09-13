'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		should:require('should')
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
			let base;
			let schema;
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
			schema.should.have.an.enumerable('parent').which.is.an.instanceof(lib.odin.Schema);
		});
	});

	describe('#hasField()', function() {
		let schema;
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
		let schema;
		let child;
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
			let id = schema.getField('id');
			id.should.be.an.Object;
			id.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('id');
			id.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			id.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(true);

			let name = schema.getField('name');
			name.should.be.an.Object;
			name.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('name');
			name.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			name.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(false);
		});

		it('should return inalterable fields', function() {
			let id = schema.getField('id');

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
			let address = child.getField('address');
			address.should.be.an.Object;
			address.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('address');
			address.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			address.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(false);
		});

		it('should return parent fields', function() {
			let id = child.getField('id');
			id.should.be.an.Object;
			id.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('id');
			id.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			id.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(true);
		});

		it('should return overriden fields', function() {
			let name = child.getField('name');
			name.should.be.an.Object;
			name.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('name');
			name.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			name.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(true);
		});
	});

	describe('#collectFields()', function() {
		let schema;
		let child;
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
			let fields = child.collectFields();

			fields.should.be.an.instanceof(Map);
			fields.size.should.be.equal(3);

			let id = fields.get('id');
			id.should.be.an.instanceof(lib.odin.SchemaField);
			id.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('id');
			id.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			id.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(true);

			let name = fields.get('name');
			name.should.be.an.instanceof(lib.odin.SchemaField);
			name.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('name');
			name.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			name.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(true);

			let address = fields.get('address');
			address.should.be.an.instanceof(lib.odin.SchemaField);
			address.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('address');
			address.should.have.an.enumerable('validator').which.is.an.instanceof(Object);
			address.should.have.an.enumerable('readOnly').which.is.an.instanceof(Boolean).and.equal(false);
		});
	});

	describe('#populate()', function() {
		let schema;
		let child;
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
			let instance = {};
			child.populate(instance, {
				id:2,
				name:'John Doe',
				address:'1, Potato Plazza, Roma',
				extra:'foo'
			});

			instance.should.have.an.enumerable('id').which.is.an.instanceof(Number).and.equal(2);
			instance.should.have.an.enumerable('stub').which.is.undefined;
			instance.should.have.an.enumerable('name').which.is.an.instanceof(String).and.equal('John Doe');
			instance.should.have.an.enumerable('address').which.is.an.instanceof(String).and.equal('1, Potato Plazza, Roma');
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
		let schema;
		let child;
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
			let instance = {
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
			instance.should.have.a.property('extra').which.is.an.instanceof(String).and.is.equal('test');
			instance.should.have.a.property('extraReadOnly').which.is.an.instanceof(String).and.is.equal('foo');
		});
	});
});