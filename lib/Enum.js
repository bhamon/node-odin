'use strict';

let lib = {
	odin:{
		Exception:require('./Exception'),
		EnumSymbol:require('./EnumSymbol')
	}
};

/**
	@class
	@classdesc		An enumeration.
	@alias			module:odin.Enum
*/
class Enum {
	/**
		@desc									Constructs a new enumeration with the provided litterals.
		@param {Array.<String>} p_litterals		Enumeration litterals.
	*/
	constructor(p_litterals) {
		for(let litteral of p_litterals) {
			Object.defineProperty(this, litteral, {enumerable:true, value:new lib.odin.EnumSymbol(litteral)});
		}
	}

	/**
		@desc							Returns the enumeration keys.
		@returns {Array.<String>}		Enumeration keys.
	*/
	keys() {
		return Object.keys(this);
	}

	/**
		@desc											Returns the enumeration symbols.
		@returns {Array.<module:odin.EnumSymbol>}		Enumeration symbols.
	*/
	symbols() {
		let self = this;
		return Object.keys(this).map(p_key => self[p_key]);
	}

	/**
		@desc									Returns the enumeration symbol for the provided key.
		@returns {module:odin.EnumSymbol}		The matching enumeration symbol.
		@throws {module:odin.Exception}			If no symbol matches the provided key.
	*/
	forKey(p_key) {
		let symbol = this[p_key];
		if(!symbol) {
			throw new lib.odin.Exception('Unknown enumeration symbol for the provied key', {key:p_key});
		}

		return symbol;
	}
}

module.exports = Enum;