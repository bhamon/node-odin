'use strict';

let lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception'),
		util:require('./util'),
		SchemaField:require('./SchemaField')
	}
};

/**
	@class
	@classdesc										Schema class.
	@alias											module:odin.Schema
*/
class Schema {
	/**
		@desc											Constructs a new schema.
		@param {Boolean} p_abstract						Tells whether this schema is abstract or not.
		@param {Object[]} p_fields						Fields list.
		@param {String} p_fields.name					Field name.
		@param {joi.Validator} p_fields.validator		Field validator.
		@param {Boolean} [p_fields.readOnly]			Field read-only state.
		@param {module:odin.Schema} [p_parent]			Parent schema.
	*/
	constructor(p_abstract, p_fields, p_parent) {
		let args = lib.odin.util.validate({
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
		Object.defineProperty(this, '_fields', {value:new Map()});

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

		for(let config of args.fields) {
			let field = new lib.odin.SchemaField(config);
			this._fields.set(field.name, field);
		}
	}

	/**
		@desc						Returns whether this schema or its parents have the specified field or not.
		@param {String} p_name		Field name.
		@returns {Boolean}			The field presence.
	*/
	hasField(p_name) {
		return this._fields.has(p_name);
	}

	/**
		@desc						Returns a field from this schema or one of its parents.
									In case of override, the field in the lowest position in the inheritance graph is returned.
		@param {String} p_name		Field name.
		@returns {Object}			The field.
	*/
	getField(p_name) {
		let name = lib.odin.util.validate(p_name, lib.deps.joi.string().required().min(1));
		let field = this._fields.get(name);
		if(field) {
			return field;
		} else if(this.parent) {
			return this.parent.getField(name);
		}

		return null;
	}

	/**
		@desc				Collects and returns all the registered fields into the given schema and all of its parents.
							In case of override, the field in the lowest position in the inheritance graph is returned.
		@returns {Map}		The fields map.
	*/
	collectFields() {
		let fields = new Map();
		if(this.parent) {
			fields = new Map(this.parent.collectFields());
		}

		for(let entry of this._fields) {
			fields.set(entry[0], entry[1]);
		}

		return fields;
	}

	/**
		@desc							Populates the given instance with the provided data map.
		@param {Object} p_instance		Instance.
		@param {Object} p_data			Data map.
	*/
	populate(p_instance, p_data) {
		if(this.abstract) {
			throw new lib.odin.Exception('Unable to populate an instance from an abstract schema');
		}

		let fields = this.collectFields();
		for(let entry of fields) {
			Object.defineProperty(p_instance, entry[0], {
				enumerable:true,
				writable:!entry[1].readOnly,
				value:p_data[entry[1].name]
			});
		}
	}

	/**
		@desc								Validates the given instance against this schema.
		@param {Object} p_instance			Instance.
		@throws {module:odin.Exception}		If a validation error occurs.
	*/
	validate(p_instance) {
		let fields = this.collectFields();
		let data = {};
		let validators = {};
		for(let entry of fields) {
			data[entry[0]] = p_instance[entry[0]];
			validators[entry[0]] = entry[1].validator;
		}

		data = lib.odin.util.validate(data, lib.deps.joi.object().required().keys(validators));

		for(let entry of fields) {
			if(!entry[1].readOnly) {
				p_instance[entry[0]] = data[entry[0]];
			}
		}
	}
}

module.exports = Schema;