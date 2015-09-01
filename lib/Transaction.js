'use strict';

var lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		Exception:require('./Exception'),
		util:require('./util'),
		Model:require('./Model'),
		Schema:require('./Schema')
	}
};

/**
	@class
	@classdesc											Transaction class.
	@alias												module:odin.Transaction

	@desc												Constructs a new transaction.
	@param {module:odin.Model} p_instance				A model instance.
*/
function Transaction(p_instance) {
	Object.defineProperty(this, '_modifications', {value:[]});

	var instance = lib.odin.util.validate(lib.deps.joi.object().required().type(lib.odin.Model), p_instance);
	var self = this;
	Object.observe(p_instance, function(p_events) {
		p_events.forEach(function(p_event) {
			var field = p_instance.schema.getField(p_event.name);
			if(!field) {
				continue;
			}

			switch(p_event.type) {
				case 'add':
					self._modifications.push({name:field.name, type:'add'});
				break;
				case 'update':
					self._modifications.push({
						name:field.name,
						type:'update',
						oldValue:p_event.oldValue
					});
				break;
				case 'delete':
					self._modifications.push({
						name:field.name,
						type:'delete',
						oldValue:p_event.oldValue
					});
				break;
			}
		});
	});

	var fields = p_instance.schema.collectFields();
	Object.keys(fields).forEach(function(p_name) {
		var field = fields[p_name];
		switch(field.type) {
			case lib.odin.Schema.FIELD_TYPE_ARRAY:
				Object.observe(p_instance[p_name], function(p_events) {
// TODO
				});
			break;
			case lib.odin.Schema.FIELD_TYPE_MAP:
				Object.observe(p_instance[p_name], function(p_events) {
// TODO
				});
			break;
		}
	});
};

/**
	@desc								Validates the modification set hold by this transaction against the instance schema.
	@throws {module:odin.Exception}		If a validation error occurs.
*/
Transaction.prototype.validate = function() {
};

/**
	@callback								module:odin.Model~commitCallback
	@param {Object} p_modification			An atomic modification event.
	@param {String} p_modification.type		The modification type (one of "modify", "add" or "remove").
	@param {String} p_modification.name		The field name.
*/
/**
	@desc												Commit the modifications hold by this object.
	@param {module:odin.Model~commitCallback} p_cb		Callback called for each modification on the model object.
*/
Transaction.prototype.commit = function(p_callback) {
};

/**
	@desc	Rollback the modifications hold by this object.
*/
Transaction.prototype.rollback = function() {
};

module.exports = Transaction;