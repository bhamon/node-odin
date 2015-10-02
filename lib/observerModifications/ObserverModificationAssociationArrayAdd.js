'use strict';

let lib = {
	odin:{
		constants:require('../constants'),
		observerModifications:{
			ObserverModificationAssociationArray:require('./ObserverModificationAssociationArray')
		}
	}
};

/**
	@class
	@classdesc		Add operation on an array.
	@alias			module:odin/observerModifications.ObserverModificationAssociationArrayAdd
*/
class ObserverModificationAssociationArrayAdd extends lib.odin.observerModifications.ObserverModificationAssociationArray {
	/**
		@desc									Creates a new modification.
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
	*/
	constructor(p_associationName, p_event) {
		super(lib.odin.constants.OPERATION_TYPE_ADD, p_associationName, p_event);
	}

	undo(p_data) {
		p_data.remove(this.index);
	}
}

module.exports = ObserverModificationAssociationArrayAdd;