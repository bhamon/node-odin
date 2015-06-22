'use strict';

/**
	@module		odin/init
*/

var lib = {
	node:{
		path:require('path')
	},
	deps:{
		q:require('q'),
		qIo:{
			fs:require('q-io/fs')
		}
	},
	odin:{
		util:require('./util')
	}
};

/**
	@desc							Bootstraps an application based on the provided init scripts directory.
									Each init script will be loaded in order of appearence (natural alphanumeric ordering).
									The init chain will wait for a process interruption.
									Once caught, the init chain will be reversed to call the optional cleanup handlers.
	@param {String} p_path			Init directory path.
	@param {Function} p_callback	callback function called after init chain completion and before process interruption watch.
	@returns {Promise}				A promise for the init/cleanup chain completion.
*/
module.exports.bootstrap = function(p_path, p_callback) {
	var defer = lib.deps.q.defer();

	// List init scripts.
	lib.deps.qIo.fs.list(p_path)
	.then(function(p_files) {
		var handlers = [];
		return p_files
		// Keep only [.js] files.
		.filter(function(p_file) { return lib.node.path.extname(p_file) == '.js'; })
		// For each script, append it to the init chain (must have a [init()] method).
		.reduce(function(p_promise, p_file) {
			return p_promise.then(function() {
				var handler = require(lib.node.path.join(p_path, p_file));
				handlers.push(handler);
				return handler.init();
			});
		}, lib.deps.q.when())
		// End of init chain, wait for SIGINT.
		.then(function() {
			p_callback();
			return lib.odin.util.waitSignal('SIGINT');
		})
		// Cleanup chain constructed by reversing the init chain scripts to call their [cleanup()] method.
		// If the init script doesn't have a [cleanup()] method, skip it.
		.finally(function() {
			return handlers
			.reverse()
			.reduce(function(p_promise, p_handler) {
				if(!p_handler.cleanup) {
					return p_promise;
				}

				return p_promise
				.then(function() {
					return p_handler.cleanup();
				});
			}, lib.deps.q.when());
		})
		.then(function() {
			return defer.resolve();
		});
	})
	// Uncaught exceptions.
	.fail(function(p_error) {
		return defer.reject(p_error);
	});

	return defer.promise;
};