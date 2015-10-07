'use strict';

/**
	@module		odin/init
*/

let lib = {
	node:{
		path:require('path')
	},
	deps:{
		co:require('co'),
		coFs:require('co-fs')
	}
};

/**
	@desc							Bootstraps an application based on the provided init scripts directory.
									Each init script will be loaded in order of appearence (natural alphanumeric ordering).
									The init chain will wait for a process interruption.
									Once caught, the init chain will be reversed to call the optional cleanup handlers.
	@param {String} p_path			Init directory path.
	@param {Function} p_callback	callback function called after init chain completion.
	@returns {Promise}				A promise for the init/cleanup chain completion.
*/
module.exports.bootstrap = function(p_path, p_callback) {
	return lib.deps.co(function*() {
		let files = yield lib.deps.coFs.readdir(p_path);
		let handlers = [];
		try {
			for(let file of files) {
				if(lib.node.path.extname(file) != '.js') {
					continue;
				}

				let handler = require(lib.node.path.join(p_path, file));
				handlers.push(handler);
				yield Promise.resolve(handler.init());
			}

			p_callback();
		} catch(p_error) {
			throw p_error;
		} finally {
			for(let handler of handlers.reverse()) {
				if(!handler.cleanup) {
					continue;
				}

				yield Promise.resolve(handler.cleanup());
			}
		}
	});
};