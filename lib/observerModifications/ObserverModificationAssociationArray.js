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
	@alias			module:odin/observerModifications.ObserverModificationAssociationArray
*/
class ObserverModificationAssociationArray extends lib.odin.observerModifications.ObserverModificationAssociation {
	/**
		@desc									Creates a new modification.
		@param {Symbol} p_operation				Operation type (one of {@link module:odin/constants.OPERATION_TYPES}).
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
		@param {Number} p_event.index			Index.
	*/
	constructor(p_operation, p_associationName, p_event) {
		super(lib.odin.constants.ASSOCIATION_TYPE_ARRAY, p_operation, p_associationName);

		let event = lib.odin.util.validate(p_event, lib.deps.joi.object().required().keys({
			index:lib.deps.joi.number().required().integer().min(0)
		}).unknown());

		/**
			@private
			@member {String}		module:odin/observerModifications.ObserverModificationAssociationArray#index
			@desc					Index.
		*/
		Object.defineProperty(this, 'index', {enumerable:true, value:event.index});
	}
}

module.exports = ObserverModificationAssociationArray;