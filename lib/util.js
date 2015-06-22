'use strict';

var lib = {
	node:{
		path:require('path'),
		os:require('os')
	},
	deps:{
		q:require('q'),
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
	@return {Promise}			A promise for the wait completion.
								If an uncaught exception is caught, the returned promise is rejected.
*/
module.exports.waitSignal = function(p_signal) {
	var defer = lib.deps.q.defer();

	process.once('SIGINT', function() {
		defer.resolve();
	});

	process.once('uncaughtException', function(p_error) {
		defer.reject(p_error);
	});

	return defer.promise;
};

/**
	@desc				Retrieves the full stack of the provided error object.
	@param {Error}		Error object.
	@returns {String}	The full error stack.
*/
module.exports.getFullStack = function(p_error) {
	var stack = p_error.stack || p_error.toString();
	if(p_error.cause && typeof p_error.cause == 'function') {
		stack += lib.node.os.EOL;
		stack += 'Caused by: ' + getFullErrorStack(cause);
	}

	return stack;
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
	var result = lib.deps.joi.validate(p_data, p_schema, p_options);
	if(result.error) {
		throw new lib.odin.Exception('Validation error', result.error.details);
	}

	return result.value;
};

/**
	@namespace		module:odin/util.array
	@desc			Array utility functions.
*/
module.exports.array = {};

/**
	@desc								Return a hash set from a plain array of strings.
	@param {String[]} p_array			Original array.
	@returns {Object.<String,Boolean>}	Hash set.
*/
module.exports.array.toSet = function(p_array) {
	p_array = module.exports.validate(p_array, lib.deps.joi.array().required().items(
		lib.deps.joi.string()
	));

	var set = {};
	p_array.forEach(function(p_value) {
		set[p_value] = true;
	});

	return set;
};