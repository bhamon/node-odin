'use strict';

let lib = {
	odin:{
		Exception:require('../../lib/Exception')
	}
};

module.exports.initialized = false;
module.exports.cleanedUp = false;

module.exports.init = function() {
	throw new lib.odin.Exception('cumbaya');
};

module.exports.cleanup = function() {
	module.exports.cleanedUp = true;
};