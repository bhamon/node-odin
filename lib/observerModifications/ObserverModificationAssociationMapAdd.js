'use strict';

let lib = {
	odin:{
		constants:require('../constants'),
		observerModifications:{
			ObserverModificationAssociationMap:require('./ObserverModificationAssociationMap')
		}
	}
};

/**
	@class
	@classdesc		Add operation on a map.
	@alias			module:odin/observerModifications.ObserverModificationAssociationMapAdd
*/
class ObserverModificationAssociationMapAdd extends lib.odin.observerModifications.ObserverModificationAssociationMap {
	/**
		@desc									Creates a new modification.
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
	*/
	constructor(p_associationName, p_event) {
		super(lib.odin.constants.OPERATION_TYPE_ADD, p_associationName, p_event);
	}

	undo(p_data) {
		p_data.remove(this.key);
	}
}

module.exports = ObserverModificationAssociationMapAdd;