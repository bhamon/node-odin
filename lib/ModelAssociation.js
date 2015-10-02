'use strict';

let lib = {
	node:{
		events:require('events')
	},
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('./constants'),
		util:require('./util')
	}
};

/**
	@class
	@classdesc		Stores instance associations.
	@alias			module:odin.ModelData
*/
class ModelAssociation extends lib.node.events.EventEmitter {
	/**
		@desc						Constructs a new model association.
		@param {Symbol} p_type		Association type (one of {@link module:odin/constants.ASSOCIATION_TYPES}).
	*/
	constructor(p_type) {
		super();

		lib.odin.util.validate(p_type, lib.deps.joi.object().required().valid(Array.from(lib.odin.constants.ASSOCIATION_TYPES)));

		/**
			@private
			@member {Symbol}	module:odin.ModelData#type
			@desc				Association type (one of {@link module:odin/constants.ASSOCIATION_TYPES}).
		*/
		Object.defineProperty(this, 'type', {enumerable:true, value:p_type});
	}
}

module.exports = ModelAssociation;