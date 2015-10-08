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
	@alias			module:odin.ModelAssociationArray
*/
class ModelAssociationArray extends lib.odin.ModelAssociation {
	/**
		@desc	Constructs a new model association array.
	*/
	constructor() {
		super(lib.odin.constants.ASSOCIATION_TYPE_ARRAY);

		/**
			@private
			@member {Array}		module:odin.ModelAssociationArray#[SYMBOL_MEMBER_DATA]
			@desc				Underlying association array.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_DATA, {value:[]});
	}

	/**
		@desc					Returns the values of the underlying array.
		@returns {Iterator}		An iterator for the values of the underlying array.
	*/
	*values() {
		yield* this[SYMBOL_MEMBER_DATA][Symbol.iterator]();
	}

	/**
		@desc					Returns the length of the underlying array.
		@returns {Number}		Length of the underlying array.
	*/
	get length() {
		return this[SYMBOL_MEMBER_DATA].length;
	}

	/**
		@desc						Returns the object at the specified index.
		@param {Number} p_index		Index.
		@returns					The object.
	*/
	get(p_index) {
		return this[SYMBOL_MEMBER_DATA][p_index];
	}

	/**
		@desc				Pushes a new object in this association.
							This method emits an [added] event.
		@param p_object		Object to push.
	*/
	push(p_object) {
		this.insert(this[SYMBOL_MEMBER_DATA].length, p_object);
	}

	/**
		@desc						Inserts the provided object at the specified index.
									This method emits an [add] event.
		@param {Number} p_index		Index.
		@param p_object				Object to insert.
	*/
	insert(p_index, p_object) {
		lib.odin.util.validate(p_index, lib.deps.joi.number().required().integer().min(0));
		this[SYMBOL_MEMBER_DATA].splice(p_index, 0, p_object);

		this.emit('add', {
			index:p_index
		});
	}

	/**
		@desc						Sets a new value to the provided index.
									This method emits an [update] event.
		@param {Number} p_index		Index.
		@param p_object				Value.
	*/
	set(p_index, p_object) {
		lib.odin.util.validate(p_index, lib.deps.joi.number().required().integer().min(0));
		if(p_index >= this[SYMBOL_MEMBER_DATA].length) {
			throw new lib.odin.Exception('Index out of bounds', {index:p_index});
		}

		let previous = this[SYMBOL_MEMBER_DATA][p_index];
		this[SYMBOL_MEMBER_DATA][p_index] = p_value;

		this.emit('update', {
			index:p_index,
			previous:previous
		});
	}

	/**
		@desc						Removes the value stored at the specified index.
									This method emits a [remove] event if the provided index is in bounds.
		@param {Number} p_index		Index.
	*/
	remove(p_index) {
		lib.odin.util.validate(p_index, lib.deps.joi.number().required().integer().min(0));
		if(p_index >= this[SYMBOL_MEMBER_DATA].length) {
			return;
		}

		let previous = this[SYMBOL_MEMBER_DATA][p_index];
		this[SYMBOL_MEMBER_DATA].splice(p_index, 1);

		this.emit('remove', {
			index:p_index,
			previous:previous
		});
	}

	/**
		@desc		Clears the array.
					This method may emit one or more [remove] events.
	*/
	clear() {
		for(let i = this[SYMBOL_MEMBER_DATA].length - 1 ; i >= 0 ; --i) {
			this.remove(i);
		}
	}

	/**
		@desc					Returns the values of the underlying array.
		@returns {Iterator}		An iterator for the values in the underlying array.
	*/
	*[Symbol.iterator]() {
		yield* this.values();
	}
}

module.exports = ModelAssociationArray;