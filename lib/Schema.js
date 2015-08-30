'use strict';

var lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception'),
		util:require('./util'),
		Model:require('./Model')
	}
};

/**
	@class
	@classdesc											Schema class.
	@alias												module:odin.Schema

	@desc												Constructs a new schema.
	@param {Boolean} p_abstract							Tells whether this schema is abstract or not.
	@param {Object[]} p_fields							Fields list.
	@param {String} p_fields.name						Field name.
	@param {String} p_fields.type						Field type (one of "value", "array" or "map").
	@param {joi.Validator} p_fields.validator			Field validator.
	@param {Boolean} [p_fields.readOnly]				Field read-only state.
	@param {module:odin.Schema} [p_parent]				Parent schema.
	@throws {module:odin.Exception}						If a validation error occurs.
*/
function Schema(p_abstract, p_fields, p_associations, p_parent) {
	var args = lib.odin.util.validate({
		abstract:p_abstract,
		fields:p_fields,
		parent:p_parent
	}, {
		abstract:lib.deps.joi.boolean().required(),
		fields:lib.deps.joi.array().required(),
		parent:lib.deps.joi.object().optional().default(null).type(Schema)
	});

	/**
		@private
		@readonly
		@member {Object}	module:odin.Schema#_fields
		@desc				Fields.
	*/
	Object.defineProperty(this, '_fields', {value:{}});

	/**
		@readonly
		@member {Boolean}	module:odin.Schema#abstract
		@desc				Abstract status.
	*/
	Object.defineProperty(this, 'abstract', {enumerable:true, value:args.abstract});

	/**
		@member ({module:odin.Schema}|null)		{module:odin.Schema#parent}
		@desc									Parent schema.
	*/
	Object.defineProperty(this, 'parent', {enumerable:true, value:args.parent});

	var self = this;
	args.fields.forEach(function(p_field) {
		var field = lib.odin.util.validate(p_field, lib.deps.joi.object().required().keys({
			name:lib.deps.joi.string().required().min(1),
			type:lib.deps.joi.string().required().valid(Schema.FIELD_TYPES),
			validator:lib.deps.joi.object().required(),
			readOnly:lib.deps.joi.boolean().optional().default(false)
		}));

		Object.freeze(field);
		self._fields[field.name] = field;
	});
};

/**
	@constant
	@desc		Field type "value".
*/
Schema.FIELD_TYPE_VALUE = 'value';

/**
	@constant
	@desc		Field type "array".
*/
Schema.FIELD_TYPE_ARRAY = 'array';

/**
	@constant
	@desc		Field type "map".
*/
Schema.FIELD_TYPE_MAP = 'map';

/**
	@constant
	@desc		Field types.
*/
Schema.FIELD_TYPES = [
	Schema.FIELD_TYPE_VALUE,
	Schema.FIELD_TYPE_ARRAY,
	Schema.FIELD_TYPE_MAP
];

/**
	@desc						Returns whether this schema or its parents have the specified field or not.
	@param {String} p_name		Field name.
	@returns {Boolean}			The field presence.
*/
Schema.prototype.hasField = function(p_name) {
	return !!this.getField(p_name);
};

/**
	@desc								Returns a field from this schema or one of its parents.
										In case of override, the field in the lowest position in the inheritance graph is returned.
	@param {String} p_name				Field name.
	@returns {Object}					The field.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
Schema.prototype.getField = function(p_name) {
	var name = lib.odin.util.validate(p_name, lib.deps.joi.string().required().min(1));
	var field = this._fields[name];
	if(field) {
		return field;
	} else if(this.parent) {
		return this.parent.getField(name);
	}

	return null;
};

/**
	@desc				Collects and returns all the registered fields into the given schema and all of its parents.
						In case of override, the field in the lowest position in the inheritance graph is returned.
	@returns {Object}	The fields map.
*/
Schema.prototype.collectFields = function() {
	var fields = {};
	if(this.parent) {
		fields = this.parent.collectFields();
	}

	var self = this;
	Object.keys(this._fields).forEach(function(p_name) {
		fields[p_name] = self._fields[p_name];
	});

	return fields;
};

/**
	@desc								Populates the given instance with the provided data set.
	@param {Object} p_instance			Instance.
	@param {Object} p_data				Data set.
	@throws {module:odin.Exception}		If the schema is abstract.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
Schema.prototype.populate = function(p_instance, p_data) {
	if(this.abstract) {
		throw new lib.odin.Exception('Unable to populate an instance from an abstract schema');
	}

	var fields = this.collectFields();
	Object.keys(fields).forEach(function(p_name) {
		var field = fields[p_name];
		Object.defineProperty(p_instance, field.name, {
			enumerable:true,
			writable:!field.readOnly,
			value:p_data[field.name]
		});
	});
};

/**
	@desc							Register instance watch to handle batch modifications.
	@param {Object} p_instance		Instance.
*/
Schema.prototype.observe = function(p_instance) {
	Object.defineProperty(p_instance, '_modifications', {value:{}});

	var self = this;
	Object.observe(p_instance, function(p_events) {
		p_events.forEach(function(p_event) {
			if(p_event.type != 'update') {
				return;
			}

			var field = self.getField(p_event.name);
			if(!field) {
				return;
			}

			var association = self.getAssociation(p_event.name);
			if(!association) {
				return;
			}

			p_instance._modifications.push({
				type:'modify',
				name:p_event.name,
				oldValue:p_event.oldValue
			});
		});
	});
};

/**
	@desc								Validates the given instance against this schema.
	@param {Object} p_instance			Instance.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
Schema.prototype.validate = function(p_instance) {
	var fields = this.collectFields();
	var data = {};
	var validators = {};
	Object.keys(fields).forEach(function(p_name) {
		var field = fields[p_name];
		data[field.name] = p_instance[field.name];
		validators[field.name] = field.validator;
	});

	data = lib.odin.util.validate(data, lib.deps.joi.object().required().keys(validators));

	Object.keys(fields).forEach(function(p_name) {
		var field = fields[p_name];
		if(!field.readOnly) {
			p_instance[field.name] = data[field.name];
		}
	});
};

module.exports = Schema;