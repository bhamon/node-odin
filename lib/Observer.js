'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('./constants'),
		Exception:require('./Exception'),
		util:require('./util'),
		Model:require('./Model'),
		observerModifications:{
			ObserverModificationDataUpdate:require('./observerModifications/ObserverModificationDataUpdate'),
			ObserverModificationAssociationArrayAdd:require('./observerModifications/ObserverModificationAssociationArrayAdd'),
			ObserverModificationAssociationArrayUpdate:require('./observerModifications/ObserverModificationAssociationArrayUpdate'),
			ObserverModificationAssociationArrayRemove:require('./observerModifications/ObserverModificationAssociationArrayRemove'),
			ObserverModificationAssociationMapAdd:require('./observerModifications/ObserverModificationAssociationMapAdd'),
			ObserverModificationAssociationMapUpdate:require('./observerModifications/ObserverModificationAssociationMapUpdate'),
			ObserverModificationAssociationMapRemove:require('./observerModifications/ObserverModificationAssociationMapRemove'),
			ObserverModificationAssociationSetAdd:require('./observerModifications/ObserverModificationAssociationSetAdd'),
			ObserverModificationAssociationSetRemove:require('./observerModifications/ObserverModificationAssociationSetRemove')
		}
	}
};

let SYMBOL_MEMBER_INSTANCE = Symbol('instance');
let SYMBOL_MEMBER_MODIFICATIONS = Symbol('modifications');
let SYMBOL_MEMBER_LISTENERS = Symbol('listeners');
let SYMBOL_METHOD_WATCH_DATA = Symbol('watchData');
let SYMBOL_METHOD_WATCH_ASSOCIATION = Symbol('watchAssociation');

let MAPPING_MODIFICATION_ASSOCIATION = new Map([
	[lib.odin.constants.ASSOCIATION_TYPE_ARRAY, new Map([
		[lib.odin.constants.OPERATION_TYPE_ADD, lib.odin.observerModifications.ObserverModificationAssociationArrayAdd],
		[lib.odin.constants.OPERATION_TYPE_UPDATE, lib.odin.observerModifications.ObserverModificationAssociationArrayUpdate],
		[lib.odin.constants.OPERATION_TYPE_REMOVE, lib.odin.observerModifications.ObserverModificationAssociationArrayRemove]
	])],
	[lib.odin.constants.ASSOCIATION_TYPE_MAP, new Map([
		[lib.odin.constants.OPERATION_TYPE_ADD, lib.odin.observerModifications.ObserverModificationAssociationMapAdd],
		[lib.odin.constants.OPERATION_TYPE_UPDATE, lib.odin.observerModifications.ObserverModificationAssociationMapUpdate],
		[lib.odin.constants.OPERATION_TYPE_REMOVE, lib.odin.observerModifications.ObserverModificationAssociationMapRemove]
	])],
	[lib.odin.constants.ASSOCIATION_TYPE_SET, new Map([
		[lib.odin.constants.OPERATION_TYPE_ADD, lib.odin.observerModifications.ObserverModificationAssociationSetAdd],
		[lib.odin.constants.OPERATION_TYPE_REMOVE, lib.odin.observerModifications.ObserverModificationAssociationSetRemove]
	])]
]);

/**
	@class
	@classdesc		Observes a model instance to provide delta modification support.
	@alias			module:odin.Observer
*/
class Observer {
	/**
		@desc										Constructs a new observer for the provided instance.
													Immediately listen for object events after the observer creation.
		@param {module:odin.Model} p_instance		module:odin.Observer#[SYMBOL_MEMBER_INSTANCE]
	*/
	constructor(p_instance) {
		lib.odin.util.validate(p_instance, lib.deps.joi.object().required().type(lib.odin.Model));

		/**
			@private
			@member {module:odin.Model}		module:odin.Observer#[SYMBOL_MEMBER_INSTANCE]
			@desc							Model instance.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_INSTANCE, {value:p_instance});

		/**
			@private
			@member {Array.<ObserverModification>}		module:odin.Observer#[SYMBOL_MEMBER_MODIFICATIONS]
			@desc										Modifications stack.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_MODIFICATIONS, {value:[]});

		/**
			@private
			@member {Object}		module:odin.Observer#[SYMBOL_MEMBER_LISTENERS]
			@desc					Instance listeners.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_LISTENERS, {value:{data:null, associations:{}}});

		this[SYMBOL_MEMBER_LISTENERS].data = this[SYMBOL_METHOD_WATCH_DATA].bind(this, lib.odin.constants.OPERATION_TYPE_UPDATE);
		this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_DATA].on('update', this[SYMBOL_MEMBER_LISTENERS].data);

		for(let entry of this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS]) {
			let association = this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get(entry[0]);
			let listeners = this[SYMBOL_MEMBER_LISTENERS].associations[entry[0]] = {
				add:this[SYMBOL_METHOD_WATCH_ASSOCIATION].bind(this, entry[0], entry[1], lib.odin.constants.OPERATION_TYPE_ADD),
				update:this[SYMBOL_METHOD_WATCH_ASSOCIATION].bind(this, entry[0], entry[1], lib.odin.constants.OPERATION_TYPE_UPDATE),
				remove:this[SYMBOL_METHOD_WATCH_ASSOCIATION].bind(this, entry[0], entry[1], lib.odin.constants.OPERATION_TYPE_REMOVE)
			};

			association.on('add', listeners.add);
			association.on('update', listeners.update);
			association.on('remove', listeners.remove);
		}
	}

	/**
		@desc							Instance data watch function.
		@param {Symbol} p_operation		Operation type.
		@param {Object} p_event			Event.
	*/
	[SYMBOL_METHOD_WATCH_DATA](p_operation, p_event) {
		this[SYMBOL_MEMBER_MODIFICATIONS].push(new lib.odin.observerModifications.ObserverModificationDataUpdate(p_event));
	}

	/**
		@desc														Instance association watch function.
		@param {String} p_associationName							Association name.
		@param {module:odin.ModelAssociation} p_association			Association.
		@param {Symbol} p_operation									Operation type.
		@param {Object} p_event										Event.
	*/
	[SYMBOL_METHOD_WATCH_ASSOCIATION](p_associationName, p_association, p_operation, p_event) {
		let node = MAPPING_MODIFICATION_ASSOCIATION.get(p_association.type);
		if(!node) {
			throw new lib.odin.Exception('No mapping node for the provided association type', {type:p_association.type});
		}

		let modification = node.get(p_operation);
		if(!modification) {
			return;
		}

		this[SYMBOL_MEMBER_MODIFICATIONS].push(new modification(p_associationName, p_event));
	}

	/**
		@desc													Returns the pending modifications.
		@returns {Array.<module:odin.ObserverModification>}		The pending modifications.
	*/
	get modifications() {
		return this[SYMBOL_MEMBER_MODIFICATIONS].slice(0);
	}

	/**
		@desc					Returns whether this observer has pending modifications or not.
		@returns {Boolean}		The pending modifications presence.
	*/
	hasModifications() {
		return !!this[SYMBOL_MEMBER_MODIFICATIONS].length;
	}

	/**
		@desc													Unobserves the model instance, returns all the pending modifications and clears the modifications list.
		@returns {Array.<module:odin.ObserverModification>}		Modifications array.
	*/
	commit() {
		this.unobserve();
		return this[SYMBOL_MEMBER_MODIFICATIONS].splice(0);
	}

	/**
		@desc		Unobserves the model instance and rolls back all the modifications.
	*/
	rollback() {
		this.unobserve();
		while(this.hasModifications()) {
			let modification = this[SYMBOL_MEMBER_MODIFICATIONS].pop();
			switch(modification.type) {
				case lib.odin.constants.MODIFICATION_TYPE_DATA:
					modification.undo(this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_DATA]);
				break;
				case lib.odin.constants.MODIFICATION_TYPE_ASSOCIATION:
					modification.undo(this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get(modification.associationName));
				break;
			}
		}
	}

	/**
		@desc		Stops listening for instance modifications.
	*/
	unobserve() {
		this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_DATA].removeListener('update', this[SYMBOL_MEMBER_LISTENERS].data);

		for(let associationName in this[SYMBOL_MEMBER_LISTENERS].associations) {
			let association = this[SYMBOL_MEMBER_INSTANCE][lib.odin.Model.SYMBOL_MEMBER_ASSOCIATIONS].get(associationName);
			let listeners = this[SYMBOL_MEMBER_LISTENERS].associations[associationName];
			association.removeListener('add', listeners.add);
			association.removeListener('update', listeners.update);
			association.removeListener('remove', listeners.remove);
		}
	}
}

module.exports = Observer;