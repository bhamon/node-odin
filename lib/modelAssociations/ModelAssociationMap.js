'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('../constants'),
		Exception:require('../Exception'),
		util:require('../util'),
		ModelAssociation:require('../ModelAssociation')
	}
};

let SYMBOL_MEMBER_DATA = Symbol('data');

/**
	@class
	@classdesc		Stores instance associations.
	@alias			module:odin.ModelAssociationMap
*/
class ModelAssociationMap extends lib.odin.ModelAssociation {
	/**
		@desc	Constructs a new model association map.
	*/
	constructor() {
		super(lib.odin.constants.ASSOCIATION_TYPE_MAP);

		/**
			@private
			@member {Map}		module:odin.ModelAssociationMap#[SYMBOL_MEMBER_DATA]
			@desc				Underlying association map.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_DATA, {value:new Map()});
	}

	/**
		@desc					Returns the keys of the underlying map.
		@returns {Iterator}		An iterator for the keys of the underlying map.
	*/
	*keys() {
		yield* this[SYMBOL_MEMBER_DATA].keys();
	}

	/**
		@desc					Returns the values of the underlying array.
		@returns {Iterator}		An iterator for the values of the underlying array.
	*/
	*values() {
		yield* this[SYMBOL_MEMBER_DATA].values();
	}

	/**
		@desc					Returns the [key, value] entries of the underlying array.
		@returns {Iterator}		An iterator for the entries of the underlying array.
	*/
	*entries() {
		yield* this[SYMBOL_MEMBER_DATA].entries();
	}

	/**
		@desc				Returns whether the provided key is in the underlying map or not.
		@param p_key		Key.
		@returns			The key presence.
	*/
	has(p_key) {
		return this[SYMBOL_MEMBER_DATA].has(p_key);
	}

	/**
		@desc				Returns the value for the specified key.
		@param p_key		Key.
		@returns			The value.
	*/
	get(p_key) {
		return this[SYMBOL_MEMBER_DATA].get(p_key);
	}

	/**
		@desc				Sets a new value for the provided key.
							This method emits an [add] event in case there wasn't any value registered in the underlying map for the provided key.
							This method emits an [update] event in case an value was already registered in the underlying map for the provided key.
		@param p_key		Key.
		@param p_value		Value.
	*/
	set(p_key, p_value) {
		let presence = this[SYMBOL_MEMBER_DATA].has(p_key);
		let previous = this[SYMBOL_MEMBER_DATA].get(p_key);

		this[SYMBOL_MEMBER_DATA].set(p_key, p_value);

		if(presence) {
			this.emit('update', {
				key:p_key,
				previous:previous
			});
		} else {
			this.emit('add', {
				key:p_key
			});
		}
	}

	/**
		@desc				Removes the value stored for the provided key.
							This method emits a [remove] event if the provided key exists.
		@param p_key		Key.
	*/
	remove(p_key) {
		if(!this[SYMBOL_MEMBER_DATA].has(p_key)) {
			return;
		}

		let previous = this[SYMBOL_MEMBER_DATA].get(p_key);
		this[SYMBOL_MEMBER_DATA].remove(p_key);

		this.emit('remove', {
			key:p_key,
			previous:previous
		});
	}

	/**
		@desc		Clears the map.
					This method may emit one or more [remove] events.
	*/
	clear() {
		for(let key of Array.from(this[SYMBOL_MEMBER_DATA].keys())) {
			this.remove(key);
		}
	}

	/**
		@desc					Returns the [key, value] entries of the underlying map.
		@returns {Iterator}		An iterator for the entries in the underlying map.
	*/
	*[Symbol.iterator]() {
		yield* this.entries();
	}
}

module.exports = ModelAssociationMap;