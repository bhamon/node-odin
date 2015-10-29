'use strict';

let lib = {
	odin:{
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
}

module.exports = Enum;