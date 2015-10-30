'use strict';

let lib = {
	odin:{
		constants:require('../constants'),
		ModelAssociation:require('../ModelAssociation')
	}
};

let SYMBOL_MEMBER_DATA = Symbol('data');

/**
	@class
	@classdesc		Stores instance associations.
	@alias			module:odin.ModelAssociationSet
*/
class ModelAssociationSet extends lib.odin.ModelAssociation {
	/**
		@desc	Constructs a new model association set.
	*/
	constructor() {
		super(lib.odin.constants.ASSOCIATION_TYPE_SET);

		/**
			@private
			@member {Set}		module:odin.ModelAssociationSet#[SYMBOL_MEMBER_DATA]
			@desc				Underlying association set.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_DATA, {value:new Set()});
	}

	/**
		@desc					Returns the entries of the underlying set.
		@returns {Iterator}		An iterator for the entries of the underlying set.
	*/
	*entries() {
		yield* this[SYMBOL_MEMBER_DATA].entries();
	}

	/**
		@desc					Returns the values of the underlying set.
		@returns {Iterator}		An iterator for the values of the underlying set.
	*/
	*values() {
		yield* this[SYMBOL_MEMBER_DATA].values();
	}

	/**
		@desc				Returns whether the provided object is in the underlying set or not.
		@param p_object		Object.
		@returns			The object presence.
	*/
	has(p_object) {
		return this[SYMBOL_MEMBER_DATA].has(p_object);
	}

	/**
		@desc				Adds the provided object to the underlying set.
							This method emits an [add] event if the object wasn't already present.
		@param p_object		Object to add.
	*/
	add(p_object) {
		if(this[SYMBOL_MEMBER_DATA].has(p_object)) {
			return;
		}

		this[SYMBOL_MEMBER_DATA].add(p_object);

		this.emit('add', {
			object:p_object
		});
	}

	/**
		@desc				Removes the provided object from the underlying set.
							This method emits a [remove] event if the object was present.
		@param p_object		Object to remove.
	*/
	remove(p_object) {
		if(!this[SYMBOL_MEMBER_DATA].has(p_object)) {
			return;
		}

		this[SYMBOL_MEMBER_DATA].delete(p_object);

		this.emit('remove', {
			object:p_object
		});
	}

	/**
		@desc		Clears the set.
					This method may emit one or more [remove] events.
	*/
	clear() {
		for(let object of Array.from(this[SYMBOL_MEMBER_DATA].values())) {
			this.remove(object);
		}
	}

	/**
		@desc					Returns the values of the underlying set.
		@returns {Iterator}		An iterator for the values in the underlying set.
	*/
	*[Symbol.iterator]() {
		yield* this.values();
	}
}

module.exports = ModelAssociationSet;