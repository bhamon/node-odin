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
	@classdesc		Remove operation on an array.
	@alias			module:odin/observerModifications.ObserverModificationAssociationArrayRemove
*/
class ObserverModificationAssociationArrayRemove extends lib.odin.observerModifications.ObserverModificationAssociationArray {
	/**
		@desc									Creates a new modification.
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
		@param {Number} p_event.index			Index.
		@param p_event.previous					Previous value.
	*/
	constructor(p_associationName, p_event) {
		super(lib.odin.constants.OPERATION_TYPE_REMOVE, p_event);

		/**
			@member {String}		module:odin/observerModifications.ObserverModificationAssociationArrayRemove#previous
			@desc					Element previous value.
		*/
		Object.defineProperty(this, 'previous', {enumerable:true, value:p_event.previous});
	}

	undo(p_data) {
		p_data.insert(this.index, this.previous);
	}
}

module.exports = ObserverModificationAssociationArrayRemove;