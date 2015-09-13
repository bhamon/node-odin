'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		util:require('./util')
	}
};

/**
	@class
	@classdesc		Schema field.
	@alias			module:odin.SchemaField
*/
class SchemaField {
	/**
		@desc											Constructs a new schema field.
		@param {Object} p_config						Configuration set.
		@param {String} p_config.name					Field name.
		@param {joi.Validator} p_config.validator		Field validator.
		@param {Boolean} p_config.readOnly				Field read-only state.
	*/
	constructor(p_config) {
		var config = lib.odin.util.validate(p_config, lib.deps.joi.object().required().keys({
			name:lib.deps.joi.string().required().min(1),
			validator:lib.deps.joi.object().required(),
			readOnly:lib.deps.joi.boolean().optional().default(false)
		}));

		/**
			@readonly
			@member {String}	module:odin.SchemaField#name
			@desc				Field name.
		*/
		Object.defineProperty(this, 'name', {enumerable:true, value:config.name});

		/**
			@readonly
			@member {String}	module:odin.SchemaField#validator
			@desc				Field validator.
		*/
		Object.defineProperty(this, 'validator', {enumerable:true, value:config.validator});

		/**
			@readonly
			@member {String}	module:odin.SchemaField#readOnly
			@desc				Field read-only state.
		*/
		Object.defineProperty(this, 'readOnly', {enumerable:true, value:config.readOnly});
	}
}

module.exports = SchemaField;