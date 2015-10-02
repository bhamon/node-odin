'use strict';

let lib = {
	odin:{
		constants:require('../constants'),
		observerModifications:{
			ObserverModificationAssociationSet:require('./ObserverModificationAssociationSet')
		}
	}
};

/**
	@class
	@classdesc		Remove operation on an set.
	@alias			module:odin/observerModifications.ObserverModificationAssociationSetRemove
*/
class ObserverModificationAssociationSetRemove extends lib.odin.observerModifications.ObserverModificationAssociationSet {
	/**
		@desc									Creates a new modification.
		@param {String} p_associationName		Association name.
		@param p_event							Event.
	*/
	constructor(p_associationName, p_event) {
		super(lib.odin.constants.OPERATION_TYPE_REMOVE, p_associationName, p_event);
	}

	undo(p_data) {
		p_data.add(this.object);
	}
}

module.exports = ObserverModificationAssociationSetRemove;