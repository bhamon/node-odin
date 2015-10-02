'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('../constants'),
		util:require('../util'),
		ObserverModification:require('../ObserverModification')
	}
};

/**
	@class
	@classdesc		Modification of an association.
	@alias			module:odin/observerModifications.ObserverModificationAssociation
*/
class ObserverModificationAssociation extends lib.odin.ObserverModification {
	/**
		@desc									Creates a new modification.
		@param {Symbol} p_associationType		Association type (one of {@link module:odin/constants.ASSOCIATION_TYPES}).
		@param {Symbol} p_operation				Operation type (one of {@link module:odin/constants.OPERATION_TYPES}).
		@param {String} p_associationName		Association name.
	*/
	constructor(p_associationType, p_operation, p_associationName) {
		super(lib.odin.constants.MODIFICATION_TYPE_ASSOCIATION, p_operation);

		let args = lib.odin.util.validate({
			associationType:p_associationType,
			associationName:p_associationName
		}, {
			associationType:lib.deps.joi.object().required().valid(Array.from(lib.odin.constants.ASSOCIATION_TYPES)),
			associationName:lib.deps.joi.string().required().min(1)
		});

		/**
			@private
			@member {Symbol}		module:odin/observerModifications.ObserverModificationAssociation#associationType
			@desc					Association type.
		*/
		Object.defineProperty(this, 'associationType', {enumerable:true, value:args.associationType});

		/**
			@private
			@member {String}		module:odin/observerModifications.ObserverModificationAssociation#associationName
			@desc					Association name.
		*/
		Object.defineProperty(this, 'associationName', {enumerable:true, value:args.associationName});
	}
}

module.exports = ObserverModificationAssociation;