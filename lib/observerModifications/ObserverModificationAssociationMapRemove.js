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
	@classdesc		Remove operation on an map.
	@alias			module:odin/observerModifications.ObserverModificationAssociationMapRemove
*/
class ObserverModificationAssociationMapRemove extends lib.odin.observerModifications.ObserverModificationAssociationMap {
	/**
		@desc									Creates a new modification.
		@param {String} p_associationName		Association name.
		@param {Object} p_event					Event.
		@param {Number} p_event.key				Key.
		@param p_event.previous					Previous value.
	*/
	constructor(p_associationName, p_event) {
		super(lib.odin.constants.OPERATION_TYPE_REMOVE, p_event);

		/**
			@member {String}		module:odin/observerModifications.ObserverModificationAssociationMapRemove#previous
			@desc					Element previous value.
		*/
		Object.defineProperty(this, 'previous', {enumerable:true, value:p_event.previous});
	}

	undo(p_data) {
		p_data.set(this.key, this.previous);
	}
}

module.exports = ObserverModificationAssociationMapRemove;