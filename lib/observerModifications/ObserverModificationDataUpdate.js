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
	@classdesc		Modification of a field.
	@alias			module:odin/observerModifications.ObserverModificationDataUpdate
*/
class ObserverModificationDataUpdate extends lib.odin.ObserverModification {
	/**
		@desc								Creates a new modification.
		@param {Object} p_event				Event.
		@param {String} p_event.field		Field name.
		@param p_event.previous				Field previous value.
	*/
	constructor(p_event) {
		super(lib.odin.constants.MODIFICATION_TYPE_DATA, lib.odin.constants.OPERATION_TYPE_UPDATE);

		let event = lib.odin.util.validate(p_event, lib.deps.joi.object().required().keys({
			field:lib.deps.joi.string().required().min(1),
			previous:lib.deps.joi.any()
		}));

		/**
			@private
			@member {String}		module:odin/observerModifications.ObserverModificationDataUpdate#field
			@desc					Field name.
		*/
		Object.defineProperty(this, 'field', {enumerable:true, value:event.field});

		/**
			@member 	module:odin/observerModifications.ObserverModificationDataUpdate#previous
			@desc		Field previous value.
		*/
		Object.defineProperty(this, 'previous', {enumerable:true, value:event.previous});
	}

	undo(p_data) {
		p_data.set(this.field, this.previous);
	}
}

module.exports = ObserverModificationDataUpdate;