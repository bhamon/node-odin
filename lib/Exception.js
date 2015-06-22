'use strict';

var lib = {
	node:{
		util:require('util')
	}
};

/**
	@class
	@classdesc							Base exception.
	@extends							Error
	@alias								module:odin.Exception

	@desc								Constructs a new Exception.
	@param {String} [p_message='']		Exception message.
	@param {Object} [p_details={}]		Exception details.
	@param {Error} [p_cause]			Exception cause.
*/
function Exception(p_message, p_details, p_cause) {
	p_message = p_message || '';

	Error.call(this, p_message);

	/**
		@member {String}	module:odin.Exception#name
		@desc				Exception name.
							Initialized with the constructor name.
	*/
	Object.defineProperty(this, 'name', {enumerable:true, writable:true, value:this.constructor.name});

	/**
		@member {String}	module:odin.Exception#message
		@desc				Exception message.
	*/
	Object.defineProperty(this, 'message', {enumerable:true, writable:true, value:p_message});

	/**
		@member {Object}	module:odin.Exception#details
		@desc				Exception details.
	*/
	Object.defineProperty(this, 'details', {enumerable:true, writable:true, value:p_details || {}});

	/**
		@member {Error}		module:odin.Exception#cause
		@desc				Exception cause.
	*/
	Object.defineProperty(this, 'cause', {enumerable:true, writable:true, value:p_cause});

	/**
		@member {String}	module:odin.Exception#stack
		@desc				Exception stack.
							Initialized with a stack trace capture.
	*/
	Error.captureStackTrace(this, this.constructor);
	Object.defineProperty(this, 'stack', {enumerable:true, writable:true, value:this.stack});
};

lib.node.util.inherits(Exception, Error);

module.exports = Exception;