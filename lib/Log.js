'use strict';

var lib = {
	deps:{
		joi:require('joi'),
		bunyan:require('bunyan')
	},
	odin:{
		util:require('./util')
	}
};

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

					if(p_error.details) {
						error.details = p_error.details;
					}

					if(p_error.statusCode) {
						error.statusCode = p_error.statusCode;
					}

					if(p_error.type) {
						error.type = p_error.type;
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
			@member {bunyan}	module:odin.Log#_log
			@desc				Bunyan instance.
		*/
		Object.defineProperty(this, '_log', {value:log});
	}

	/**
		@alias								module:odin.Log#trace
		@desc								Log at [trace] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	trace() {
		this._log.trace.apply(this._log, arguments);
	}

	/**
		@alias								module:odin.Log#debug
		@desc								Log at [debug] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	debug() {
		this._log.debug.apply(this._log, arguments);
	}

	/**
		@alias								module:odin.Log#info
		@desc								Log at [info] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	info() {
		this._log.info.apply(this._log, arguments);
	}

	/**
		@alias								module:odin.Log#warning
		@desc								Log at [warning] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	warning() {
		this._log.warn.apply(this._log, arguments);
	}

	/**
		@alias								module:odin.Log#error
		@desc								Log at [error] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	error() {
		this._log.error.apply(this._log, arguments);
	}

	/**
		@alias								module:odin.Log#fatal
		@desc								Log at [fatal] level.
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	fatal() {
		this._log.fatal.apply(this._log, arguments);
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
		return this._log.child(p_object);
	}
}

module.exports = Log;