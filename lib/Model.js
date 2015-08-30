'use strict';

var lib = {
	node:{
		util:require('util'),
		events:require('events')
	},
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception'),
		util:require('./util'),
		Schema:require('./Schema')
	}
};

/**
	@class
	@classdesc									Base model class.
	@extend										node.events.EventEmitter
	@alias										module:odin.Model

	@desc										Constructs a base model by storing its schema and calling {@link module:odin.Schema.populate}.
	@param {module:odin.Schema} p_schema		Model schema.
	@param {Object} p_data						Data set used to initialize the model.

	@todo Add associations support.
	@todo Add modification event support (wait for Object.observe() and Array.observe()).
*/
function Model(p_schema, p_data) {
	var args = lib.odin.util.validate({
		schema:p_schema,
		data:p_data
	}, {
		schema:lib.deps.joi.object().required().type(lib.odin.Schema),
		data:lib.deps.joi.object().required()
	});

	/**
		@readonly
		@member {module:odin.Schema}	module:odin.Model#schema
		@desc							Underlying schema of this model.
	*/
	Object.defineProperty(this, 'schema', {value:args.schema});

	this.schema.populate(this, args.data);
	this.schema.observe(this);
};

lib.node.util.inherits(Model, lib.node.events.EventEmitter);

/**
	@desc											Helper method to create a model from a human-written configuration set.
	@param {Object} p_config						Model configuration set.
	@param {Function} [p_config.parent]				Parent model (child class of {@link module:odin.Model}).
	@param {Function} [p_config.init]				Init function called after instance population.
	@param {Object[]} p_config.fields				Fields (see {@link module:odin.Schema}).
	@returns {Function}								A new model (child class of {@link module:odin.Model}).
*/
Model.create = function(p_config) {
	var config = lib.odin.util.validate(p_config, lib.deps.joi.object().required().keys({
		abstract:lib.deps.joi.boolean().optional().default(false),
		parent:lib.deps.joi.func().optional().default(Model),
		init:lib.deps.joi.func().optional().default(function(){}),
		fields:lib.deps.joi.array().required(),
		associations:lib.deps.joi.array().required()
	}));

	if(p_config.parent && !(config.parent.schema instanceof lib.odin.Schema)) {
		throw new lib.odin.Exception('Invalid parent model');
	}

	var schema = new lib.odin.Schema(config.abstract, config.fields, config.associations, config.parent.schema);
	var model = function(p_data) {
		Model.call(this, schema, p_data);
		config.init.apply(this);
	};

	lib.node.util.inherits(model, config.parent);

	/**
		@readonly
		@member {module:odin.Schema}	module:odin.Model.schema
		@desc							Model schema.
	*/
	Object.defineProperty(model, 'schema', {value:schema});

	return model;
};

/**
	@desc								Validate the model against it's own schema.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
Model.prototype.validate = function() {
	this.schema.validate(this);
};

module.exports = Model;