'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		expect:require('chai').expect
	},
	odin:{
		constants:require('../lib/constants'),
		Exception:require('../lib/Exception'),
		util:require('../lib/util'),
		Model:require('../lib/Model')
	}
};

describe('Model', function() {
	describe('#constructor()', function() {
		class Person extends lib.odin.Model {
			constructor(p_data) {
				super(p_data);
			}

			[lib.odin.Model.SYMBOL_METHOD_POPULATE](p_data) {
				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('id', lib.odin.util.validate(p_data.id, lib.deps.joi.number().optional().integer().min(0)));
				this.firstName = p_data.firstName;
				this.lastName = p_data.lastName;

				this[lib.odin.Model.SYMBOL_METHOD_CREATE_ASSOCIATION]('addresses', lib.odin.constants.ASSOCIATION_TYPE_ARRAY);
			}

			get id() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('id');
			}

			get firstName() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('firstName');
			}

			set firstName(p_value) {
				let value = lib.odin.util.validate(p_value, lib.deps.joi.string().required().min(1));
				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('firstName', value);
			}

			get lastName() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('lastName');
			}

			set lastName(p_value) {
				let value = lib.odin.util.validate(p_value, lib.deps.joi.string().required().min(1));
				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('lastName', value);
			}

			get addresses() {
				return this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('addresses').values();
			}

			addAddress(p_address) {
				this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('addresses').push(p_address);
			}
		}

		class User extends Person {
			constructor(p_data) {
				super(p_data);
			}

			[lib.odin.Model.SYMBOL_METHOD_POPULATE](p_data) {
				super[lib.odin.Model.SYMBOL_METHOD_POPULATE](p_data);

				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('active', true);
				this.login = p_data.login;
				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('password', lib.odin.util.validate(p_data.password, lib.deps.joi.string().required().regex(/^[a-f0-9]{8}$/)));
			}

			get active() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('active');
			}

			get login() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('login');
			}

			set login(p_value) {
				let value = lib.odin.util.validate(p_value, lib.deps.joi.string().required().regex(/^[a-zA-Z0-9-]{4,12}$/));
				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('login', value);
			}

			get password() {
				return this[lib.odin.Model.SYMBOL_MEMBER_DATA].get('password');
			}

			set password(p_value) {
				let value = lib.odin.util.validate(p_value, lib.deps.joi.string().required().min(8));

				// Pseudo hash, real hash is required here.
				value = value.replace(/[^a-f0-9]/, '0');

				this[lib.odin.Model.SYMBOL_MEMBER_DATA].set('password', value);
			}
		}

		it('should throw on bad parameter', function() {
			lib.deps.expect(function() {
				new User(21);
			}).to.throw(lib.odin.Exception);
		});

		it('should be correctly initialized and populated', function() {
			let instance;
			lib.deps.expect(function() {
				instance = new User({
					id:2,
					firstName:'Jane',
					lastName:'Doe',
					login:'janeDoe',
					password:'2590b56d'
				});
			}).to.not.throw();

			lib.deps.expect(instance).to.have.a.property('id', 2);
			lib.deps.expect(instance).to.have.a.property('firstName', 'Jane');
			lib.deps.expect(instance).to.have.a.property('lastName', 'Doe');
			lib.deps.expect(instance).to.have.a.property('active', true);
			lib.deps.expect(instance).to.have.a.property('login', 'janeDoe');
			lib.deps.expect(instance).to.have.a.property('password', '2590b56d');
		});
	});
});