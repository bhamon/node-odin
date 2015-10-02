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
	@alias			module:odin/observerModifications.ObserverModificationAssociationMap
*/
class ObserverModificationAssociationMap extends lib.odin.observerModifications.ObserverModificationAssociation {
	/**
		@desc									Creates a new modification.
		@param {Symbol} p_operation				Operation type (one of {@link module:odin/constants.OPERATION_TYPES}).
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
		@param {Number} p_event.key				Key.
	*/
	constructor(p_operation, p_associationName, p_event) {
		super(lib.odin.constants.ASSOCIATION_TYPE_MAP, p_operation, p_associationName);

		let event = lib.odin.util.validate(p_event, lib.deps.joi.object().required().keys({
			key:lib.deps.joi.any()
		}).unknown());

		/**
			@private
			@member {String}		module:odin/observerModifications.ObserverModificationAssociationMap#key
			@desc					Key.
		*/
		Object.defineProperty(this, 'key', {enumerable:true, value:event.key});
	}
}

module.exports = ObserverModificationAssociationMap;