'use strict';

let lib = {
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


/**
	@namespace		module:odin/util.promise
	@desc			Promise utility functions.
*/
module.exports.promise = {};

/**
	@desc							Wraps a function call inside a promise.
	@params {Function} p_fn			Function to call.
	@params {Object[]} p_args		Extra arguments passed to the function.
	@returns {Promise}				A promise for the function return value.
*/
module.exports.promise.fapply = function(p_fn, p_args) {
	return new Promise(function(p_resolve, p_reject) {
		p_resolve(p_fn.apply(p_fn, p_args));
	});
};

/**
	@desc							Wraps a function call inside a promise.
	@params {Function} p_fn			Function to call.
	@params {Object[]} p_args		Extra arguments passed to the function.
	@returns {Promise}				A promise for the function return value.
*/
module.exports.promise.fcall = function(p_fn) {
	let args = Array.from(arguments).slice(1);
	return module.exports.promise.fapply(p_fn, args);
};

/**
	@desc							Wraps a method call inside a promise.
	@params {Object} p_object		Object.
	@params {String} p_method		Method name.
	@params {Object[]} p_args		Extra arguments passed to the method.
	@returns {Promise}				A promise for the method return value.
*/
module.exports.promise.post = function(p_object, p_method, p_args) {
	return module.exports.promise.fapply(p_object[p_method].bind(p_object), p_args);
};

/**
	@desc							Wraps a method call inside a promise.
	@params {Object} p_object		Object.
	@params {String} p_method		Method name.
	@params {Object[]} p_args		Extra arguments passed to the method.
	@returns {Promise}				A promise for the method return value.
*/
module.exports.promise.invoke = function(p_object, p_method) {
	let args = Array.from(arguments).slice(2);
	return module.exports.promise.post(p_object, p_method, args);
};

/**
	@desc							Wraps a node-like function call inside a promise.
	@params {Function} p_fn			Function to call.
	@params {Object[]} p_args		Extra arguments passed to the function.
	@returns {Promise}				A promise for the function return value.
*/
module.exports.promise.nfapply = function(p_fn, p_args) {
	return new Promise(function(p_resolve, p_reject) {
		let args = (p_args) ? p_args.slice(0) : [];
		args.push(function(p_error) {
			if(p_error) {
				return p_reject(p_error);
			}

			let results = Array.from(arguments).slice(1);
			switch(results.length) {
				case 0:
					return p_resolve();
				case 1:
					return p_resolve(results[0]);
				default:
					return p_resolve(results);
			}
		});

		p_fn.apply(p_fn, args);
	});
};

/**
	@desc							Wraps a node-like function call inside a promise.
	@params {Function} p_fn			Function to call.
	@params {Object[]} p_args		Extra arguments passed to the function.
	@returns {Promise}				A promise for the function return value.
*/
module.exports.promise.nfcall = function(p_fn) {
	let args = Array.from(arguments).slice(1);
	return module.exports.promise.nfapply(p_fn, args);
};

/**
	@desc							Wraps a node-like method call inside a promise.
	@params {Object} p_object		Object.
	@params {String} p_method		Method name.
	@params {Object[]} p_args		Extra arguments passed to the method.
	@returns {Promise}				A promise for the method return value.
*/
module.exports.promise.npost = function(p_object, p_method, p_args) {
	return module.exports.promise.nfapply(p_object[p_method].bind(p_object), p_args);
};

/**
	@desc							Wraps a node-like method call inside a promise.
	@params {Object} p_object		Object.
	@params {String} p_method		Method name.
	@params {Object[]} p_args		Extra arguments passed to the method.
	@returns {Promise}				A promise for the method return value.
*/
module.exports.promise.ninvoke = function(p_object, p_method) {
	let args = Array.from(arguments).slice(2);
	return module.exports.promise.npost(p_object, p_method, args);
};