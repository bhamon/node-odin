'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		bunyan:require('bunyan')
	},
	odin:{
		util:require('./util')
	}
};

let SYMBOL_MEMBER_LOG = Symbol('log');

/**
	@class
	@classdesc		Basic log system with a bunyan backend.
					There are three embedded serializers on it:
						- err: Handles native and odin error messages.
						- req: Handles HTTP requests.
						- res: Handles HTTP responses.
	@alias			module:odin.Log
*/
class Log {
	/**
		@desc									Creates a new log.
		@param {Object} p_config				Configuration set.
		@param {String} p_config.name			Name.
		@param {Object[]} p_config.streams		Output streams.
	*/
	constructor(p_config) {
		let config = lib.odin.util.validate(p_config, lib.deps.joi.object().required().keys({
			name:lib.deps.joi.string().required().min(1),
			streams:lib.deps.joi.array().required().min(1).items(
				lib.deps.joi.object()
			)
		}));

		let log = lib.deps.bunyan.createLogger({
			name:config.name,
			streams:config.streams,
			serializers:{
				req:lib.deps.bunyan.stdSerializers.req,
				res:lib.deps.bunyan.stdSerializers.res,
				err:function(p_error) {
					let error = {
						message:p_error.message,
						name:p_error.name,
						stack:p_error.fullStack || p_error.stack
					};

					for(let key in p_error) {
						error[key] = p_error[key];
					}

					return error;
				}
			}
		});

		log.on('error', function(p_error, p_stream) {
			console.error('[ERROR] Unable to write to log stream');
			console.error(p_error.stack);
		});

		/**
			@private
			@readonly
			@member {bunyan}	module:odin.Log#[SYMBOL_MEMBER_LOG]
			@desc				Bunyan instance.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_LOG, {value:log});
	}

	/**
		@alias								module:odin.Log#trace
		@desc								Log at [trace] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	trace() {
		this[SYMBOL_MEMBER_LOG].trace.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@alias								module:odin.Log#debug
		@desc								Log at [debug] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	debug() {
		this[SYMBOL_MEMBER_LOG].debug.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@alias								module:odin.Log#info
		@desc								Log at [info] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	info() {
		this[SYMBOL_MEMBER_LOG].info.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@alias								module:odin.Log#warning
		@desc								Log at [warning] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	warning() {
		this[SYMBOL_MEMBER_LOG].warn.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@alias								module:odin.Log#error
		@desc								Log at [error] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	error() {
		this[SYMBOL_MEMBER_LOG].error.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@alias								module:odin.Log#fatal
		@desc								Log at [fatal] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	fatal() {
		this[SYMBOL_MEMBER_LOG].fatal.apply(this[SYMBOL_MEMBER_LOG], arguments);
	}

	/**
		@desc							Creates a specialized child log with the provided object.
		@param {Object} [p_object]		Object used to specialize the child log.
		@returns {module:odin.Log}		The newly created child log.
		@example
			let log = new Log({name:'myLog'});
			let child = log.child({component:'sub-component'});
			child.log('test');
			// produces: {..., component:'sub-component', message:'test'}
	*/
	child(p_object) {
		return this[SYMBOL_MEMBER_LOG].child(p_object);
	}
}

module.exports = Log;