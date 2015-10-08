'use strict';

let lib = {
	node:{
		events:require('events')
	},
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception'),
		util:require('./util')
	}
};

let SYMBOL_MEMBER_DATA = Symbol('data');

/**
	@class
	@classdesc		Stores instance fields.
	@alias			module:odin.ModelData
*/
class ModelData extends lib.node.events.EventEmitter {
	/**
		@desc	Constructs a new model data.
	*/
	constructor() {
		super();

		/**
			@private
			@member {Map}		module:odin.ModelData#[SYMBOL_MEMBER_DATA]
			@desc				Underlying data map.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_DATA, {value:new Map()});
	}

	/**
		@desc						Returns whether this model data has the provided field or not.
		@param {String} p_name		Field name.
		@returns {Boolean}			The field presence.
	*/
	has(p_name) {
		return this[SYMBOL_MEMBER_DATA].has(p_name);
	}

	/**
		@desc					Returns the keys of the underlying data map.
		@returns {Iterator}		An iterator for the keys of the underlying data map.
	*/
	*keys() {
		yield* this[SYMBOL_MEMBER_DATA].keys();
	}

	/**
		@desc					Returns the values of the underlying data map.
		@returns {Iterator}		An iterator for the values of the underlying data map.
	*/
	*values() {
		yield* this[SYMBOL_MEMBER_DATA].values();
	}

	/**
		@desc					Returns the entries of the underlying data map.
		@returns {Iterator}		An iterator for the entries of the underlying data map.
	*/
	*entries() {
		yield* this[SYMBOL_MEMBER_DATA].entries();
	}

	/**
		@desc						Returns the field value.
		@param {String} p_name		Field name.
		@returns					The field value.
	*/
	get(p_name) {
		return this[SYMBOL_MEMBER_DATA].get(p_name);
	}

	/**
		@desc						Sets a new value to the provided field.
									This method emits an [updated] event.
		@param {String} p_name		Field name.
		@param p_value				Field value.
	*/
	set(p_name, p_value) {
		let previous = this[SYMBOL_MEMBER_DATA].get(p_name);
		this[SYMBOL_MEMBER_DATA].set(p_name, p_value);

		this.emit('update', {
			field:p_name,
			previous:previous
		});
	}

	/**
		@desc					Returns the entries of the underlying data map.
		@returns {Iterator}		An iterator for the [key, value] pairs in the underlying data map.
	*/
	*[Symbol.iterator]() {
		yield* this.entries();
	}
}

module.exports = ModelData;