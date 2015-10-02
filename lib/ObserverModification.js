'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('./constants'),
		Exception:require('./Exception'),
		util:require('./util')
	}
};

/**
	@class
	@classdesc		Model instance modification constructed by an observer.
	@alias			module:odin.ObserverModification
*/
class ObserverModification {
	/**
		@desc							Constructs a new observer modification.
		@param {Symbol} p_type			Modification type (one of {@link module:odin/constants.MODIFICATION_TYPES}).
		@param {Symbol} p_operation		Operation type (one of {@link module:odin/constants.OPERATION_TYPES}).
	*/
	constructor(p_type, p_operation) {
		let args = lib.odin.util.validate({
			type:p_type,
			operation:p_operation
		}, {
			type:lib.deps.joi.object().required().valid(Array.from(lib.odin.constants.MODIFICATION_TYPES)),
			operation:lib.deps.joi.object().required().valid(Array.from(lib.odin.constants.OPERATION_TYPES))
		});

		/**
			@private
			@member {module:odin.Model}		module:odin.ObserverModification#type
			@desc							Modification type.
		*/
		Object.defineProperty(this, 'type', {enumerable:true, value:args.type});

		/**
			@private
			@member {module:odin.Model}		module:odin.ObserverModification#type
			@desc							Operation type.
		*/
		Object.defineProperty(this, 'operation', {enumerable:true, value:args.operation});
	}

	/**
		@abstract
		@desc		Undo the modification hold by this object in the provided data set.
	*/
	undo(p_data) {
		throw new lib.odin.Exception('Abstract method not implemented', {method:'undo'});
	}
}

module.exports = ObserverModification;