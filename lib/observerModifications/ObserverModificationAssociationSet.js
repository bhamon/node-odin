'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('../constants'),
		util:require('../util'),
		observerModifications:{
			ObserverModificationAssociation:require('./ObserverModificationAssociation')
		}
	}
};

/**
	@class
	@classdesc		Modification of an association.
	@alias			module:odin/observerModifications.ObserverModificationAssociationSet
*/
class ObserverModificationAssociationSet extends lib.odin.observerModifications.ObserverModificationAssociation {
	/**
		@desc									Creates a new modification.
		@param {Symbol} p_operation				Operation type (one of {@link module:odin/constants.OPERATION_TYPES}).
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
		@param p_event.object					Object.
	*/
	constructor(p_operation, p_associationName, p_event) {
		super(lib.odin.constants.ASSOCIATION_TYPE_SET, p_operation, p_associationName);

		let event = lib.odin.util.validate(p_event, lib.deps.joi.object().required().keys({
			object:lib.deps.joi.any()
		}).unknown());

		/**
			@private
			@member {String}		module:odin/observerModifications.ObserverModificationAssociationSet#object
			@desc					Object.
		*/
		Object.defineProperty(this, 'object', {enumerable:true, value:p_event.object});
	}
}

module.exports = ObserverModificationAssociationSet;