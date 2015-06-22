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

var LOG_LEVELS = {
	trace:'trace',
	debug:'debug',
	info:'info',
	warning:'warn',
	error:'error',
	fatal:'fatal'
};

/**
	@class
	@classdesc								Basic log system with a bunyan backend.
											There are three embedded serializers on it:
												- err: Handles native and odin error messages.
												- req: Handles HTTP requests.
												- res: Handles HTTP responses.
	@alias									module:odin.Log

	@desc									Creates a new log.
	@param {Object} p_config				Configuration set.
	@param {String} p_config.name			Name.
	@param {Object[]} p_config.streams		Output streams.
*/
function Log(p_config) {
	var args = lib.odin.util.validate(p_config, lib.deps.joi.object().required().keys({
		name:lib.deps.joi.string().required().min(1),
		streams:lib.deps.joi.array().required().min(1).items(
			lib.deps.joi.object()
		)
	}));

	var log = lib.deps.bunyan.createLogger({
		name:args.name,
		streams:args.streams,
		serializers:{
			req:lib.deps.bunyan.stdSerializers.req,
			res:lib.deps.bunyan.stdSerializers.res,
			err:function(p_error) {
				var error = {
					message:p_error.message,
					name:p_error.name,
					stack:lib.odin.util.getFullStack(p_error)
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
};

Object.keys(LOG_LEVELS).forEach(function(p_level) {
	var method = LOG_LEVELS[p_level];

	/**
		@alias								module:odin.Log#LEVEL
		@desc								Provides logging functionnality based on information level.
											LEVEL is one of [trace, debug, info, warning, error, fatal].
		@param {Object} [p_object]			Object to log using registered serializers.
		@param {Sring} [p_message]			Message to log.
	*/
	Log.prototype[p_level] = function() {
		this._log[method].apply(this._log, arguments);
	};
});

module.exports = Log;