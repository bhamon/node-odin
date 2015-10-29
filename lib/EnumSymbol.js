'use strict';

let SYMBOL_MEMBER_NAME = Symbol('name');

/**
	@class
	@classdesc		Enumeration symbol.
	@alias			module:odin.EnumSymbol
*/
class EnumSymbol {
	/**
		@desc						Constructs a new enumeration symbol with the provided name.
		@param {String} p_name		Symbol name.
	*/
	constructor(p_name) {
		Object.defineProperty(this, SYMBOL_MEMBER_NAME, {value:p_name});
	}

	/**
		@desc					Overrides the default {@link Symbol.toString} method to return the enumeration symbol name.
		@returns {String}		The enumeration symbol name.
	*/
	toString() {
		return this[SYMBOL_MEMBER_NAME];
	}
}

module.exports = EnumSymbol;