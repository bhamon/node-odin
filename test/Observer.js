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
		Model:require('../lib/Model'),
		Observer:require('../lib/Observer'),
		ObserverModification:require('../lib/ObserverModification')
	}
};

describe('Observer', function() {
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
			return this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('addresses').entries();
		}

		addAddress(p_address) {
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('addresses').push(
				lib.odin.util.validate(p_address, lib.deps.joi.object().required().keys({
					number:lib.deps.joi.string().required().min(1),
					street:lib.deps.joi.string().required().min(1),
					city:lib.deps.joi.string().required().min(1),
					country:lib.deps.joi.string().required().min(1)
				}))
			);
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

			this[lib.odin.Model.SYMBOL_METHOD_CREATE_ASSOCIATION]('rights', lib.odin.constants.ASSOCIATION_TYPE_SET);
			this[lib.odin.Model.SYMBOL_METHOD_CREATE_ASSOCIATION]('notifications', lib.odin.constants.ASSOCIATION_TYPE_MAP);
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').set('system', true);
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').set('topics', false);
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').set('polls', false);
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

		get rights() {
			return this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('rights').entries();
		}

		hasRight(p_right) {
			return this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('rights').has(p_right);
		}

		addRight(p_right) {
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('rights').add(
				lib.odin.util.validate(p_right, lib.deps.joi.string().required().min(1))
			);
		}

		removeRight(p_right) {
			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('rights').remove(
				lib.odin.util.validate(p_right, lib.deps.joi.string().required().min(1))
			);
		}

		get notifications() {
			return this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').entries();
		}

		setNotification(p_notification, p_value) {
			if(!this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').has(p_notification)) {
				throw new lib.odin.Exception('Unknown notification', {notification:p_notification});
			}

			this[lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get('notifications').set(
				p_notification,
				lib.odin.util.validate(p_value, lib.deps.joi.boolean().required())
			);
		}
	}

	describe('#constructor()', function() {
		it('should throw on bad parameter', function() {
			lib.deps.expect(function() {
				new lib.odin.Observer();
			}).to.throw(lib.odin.Exception);

			lib.deps.expect(function() {
				new lib.odin.Observer(42);
			}).to.throw(lib.odin.Exception);
		});

		it('should be correctly initialized', function() {
			let user = new User({
				id:2,
				firstName:'Jane',
				lastName:'Doe',
				login:'janeDoe',
				password:'2590b56d'
			});

			let observer = new lib.odin.Observer(user);
		});
	});

	describe('#modifications', function() {
		it('should reflect modifications', function() {
			let user = new User({
				id:2,
				firstName:'Jane',
				lastName:'Doe',
				login:'janeDoe',
				password:'2590b56d'
			});

			let observer = new lib.odin.Observer(user);
			lib.deps.expect(observer.hasModifications()).to.equal(false);

			user.firstName = 'Joan';
			lib.deps.expect(observer.modifications.length, 1);
		});
	});

	describe('#hasModifications()', function() {
		it('should reflect modifications', function() {
			let user = new User({
				id:2,
				firstName:'Jane',
				lastName:'Doe',
				login:'janeDoe',
				password:'2590b56d'
			});

			let observer = new lib.odin.Observer(user);
			lib.deps.expect(observer.hasModifications()).to.equal(false);

			user.firstName = 'Joan';
			lib.deps.expect(observer.hasModifications()).to.equal(true);
		});
	});

	describe('#commit()', function() {
		it('should return modifications', function() {
			let user = new User({
				id:2,
				firstName:'Jane',
				lastName:'Doe',
				login:'janeDoe',
				password:'2590b56d'
			});

			let observer = new lib.odin.Observer(user);
			user.firstName = 'John';
			user.lastName = 'Stark';
			user.addAddress({number:'1', street:'Almstadtstrasse', city:'Berlin', country:'Germany'});
			user.addRight('admin');
			user.setNotification('system', false);

			let modifications = observer.commit();
			lib.deps.expect(modifications.length).to.equal(5);

			lib.deps.expect(modifications[0]).to.have.a.property('type', lib.odin.constants.MODIFICATION_TYPE_DATA);
			lib.deps.expect(modifications[0]).to.have.a.property('operation', lib.odin.constants.OPERATION_TYPE_UPDATE);
			lib.deps.expect(modifications[0]).to.have.a.property('field', 'firstName');
			lib.deps.expect(modifications[0]).to.have.a.property('previous', 'Jane');
			lib.deps.expect(modifications[1]).to.have.a.property('type', lib.odin.constants.MODIFICATION_TYPE_DATA);
			lib.deps.expect(modifications[1]).to.have.a.property('operation', lib.odin.constants.OPERATION_TYPE_UPDATE);
			lib.deps.expect(modifications[1]).to.have.a.property('field', 'lastName');
			lib.deps.expect(modifications[1]).to.have.a.property('previous', 'Doe');
			lib.deps.expect(modifications[2]).to.have.a.property('type', lib.odin.constants.MODIFICATION_TYPE_ASSOCIATION);
			lib.deps.expect(modifications[2]).to.have.a.property('operation', lib.odin.constants.OPERATION_TYPE_ADD);
			lib.deps.expect(modifications[2]).to.have.a.property('associationType', lib.odin.constants.ASSOCIATION_TYPE_ARRAY);
			lib.deps.expect(modifications[2]).to.have.a.property('associationName', 'addresses');
			lib.deps.expect(modifications[2]).to.have.a.property('index', 0);
			lib.deps.expect(modifications[3]).to.have.a.property('type', lib.odin.constants.MODIFICATION_TYPE_ASSOCIATION);
			lib.deps.expect(modifications[3]).to.have.a.property('operation', lib.odin.constants.OPERATION_TYPE_ADD);
			lib.deps.expect(modifications[3]).to.have.a.property('associationType', lib.odin.constants.ASSOCIATION_TYPE_SET);
			lib.deps.expect(modifications[3]).to.have.a.property('associationName', 'rights');
			lib.deps.expect(modifications[3]).to.have.a.property('object', 'admin');
			lib.deps.expect(modifications[4]).to.have.a.property('type', lib.odin.constants.MODIFICATION_TYPE_ASSOCIATION);
			lib.deps.expect(modifications[4]).to.have.a.property('operation', lib.odin.constants.OPERATION_TYPE_UPDATE);
			lib.deps.expect(modifications[4]).to.have.a.property('associationType', lib.odin.constants.ASSOCIATION_TYPE_MAP);
			lib.deps.expect(modifications[4]).to.have.a.property('associationName', 'notifications');
			lib.deps.expect(modifications[4]).to.have.a.property('key', 'system');
			lib.deps.expect(modifications[4]).to.have.a.property('previous', true);

			lib.deps.expect(observer.hasModifications()).to.equal(false);
		});
	});

	describe('#rollback()', function() {
		it('should rollback modifications', function() {
			let user = new User({
				id:2,
				firstName:'Jane',
				lastName:'Doe',
				login:'janeDoe',
				password:'2590b56d'
			});

			let observer = new lib.odin.Observer(user);
			user.firstName = 'John';
			user.lastName = 'Stark';
			user.addAddress({number:'1', street:'Almstadtstrasse', city:'Berlin', country:'Germany'});
			user.addRight('admin');
			user.setNotification('system', false);

			observer.rollback();
			lib.deps.expect(observer.hasModifications()).to.equal(false);

			lib.deps.expect(user.firstName).to.equal('Jane');
			lib.deps.expect(user.lastName).to.equal('Doe');
			lib.deps.expect(Array.from(user.addresses)).to.deep.equal([]);
		});
	});

	describe('#unobserve()', function() {
	});
});