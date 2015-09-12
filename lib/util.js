'use strict';

var lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception')
	}
};

/**
	@module		odin/util
	@desc		Utility functions.
*/

/**
	@desc						Waits for the specified process signal.
	@param {String} p_signal	The process signal to watch.
	@return {Promise}			A promise for the signal wait completion.
								If an uncaught exception is caught, the returned promise is rejected.
*/
module.exports.waitSignal = function(p_signal) {
	return new Promise(function(p_resolve, p_reject) {
		process.once(p_signal, p_resolve);
		process.once('uncaughtException', p_reject);
	});
};

/**
	@desc								Validates the provided data against the provided schema.
	@param p_data						Data set.
	@param {joi} p_schema				Validation schema.
	@param {Object} [p_options]			Validation options ({@link joi}).
	@returns							Validated an parsed data.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
module.exports.validate = function(p_data, p_schema, p_options) {
	let result = lib.deps.joi.validate(p_data, p_schema, p_options);
	if(result.error) {
		throw new lib.odin.Exception('Validation error', result.error.details);
	}

	return result.value;
};