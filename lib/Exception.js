'use strict';

let lib = {
	node:{
		os:require('os')
	}
};

/**
	@class
	@classdesc		Base exception.
	@extends		Error
	@alias			module:odin.Exception
*/
class Exception extends Error {
	/**
		@desc								Constructs a new Exception.
		@param {String} [p_message='']		Exception message.
		@param {Object} [p_details={}]		Exception details.
		@param {Error} [p_cause]			Exception cause.
	*/
	constructor(p_message, p_details, p_cause) {
		super(p_message || '');

		Object.defineProperty(this, 'name', {enumerable:true, value:this.constructor.name});

		/**
			@member {Object}	module:odin.Exception#details
			@desc				Exception details.
		*/
		Object.defineProperty(this, 'details', {enumerable:true, writable:true, value:p_details || {}});

		/**
			@member {Error}		module:odin.Exception#cause
			@desc				Exception cause.
		*/
		Object.defineProperty(this, 'cause', {enumerable:true, writable:true, value:p_cause || null});
	}

	/**
		@member {String}	module:odin.Exception#fullStack
		@desc				Exception full stack constructed at runtime.
	*/
	get fullStack() {
		let stack = this.stack;
		if(this.cause && this.cause instanceof Exception) {
			stack += lib.node.os.EOL;
			stack += 'Caused by: ' + this.cause.fullStack;
		}

		return stack;
	}
}

module.exports = Exception;