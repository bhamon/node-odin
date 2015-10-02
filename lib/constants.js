'use strict';

/**
	@module		odin/dataSource/constants
	@desc		Data source constants.
*/

/**
	@constant
	@desc			[array] association type.
	@type {Symbol}
*/
module.exports.ASSOCIATION_TYPE_ARRAY = Symbol('array');

/**
	@constant
	@desc			[map] association type.
	@type {Symbol}
*/
module.exports.ASSOCIATION_TYPE_MAP = Symbol('map');

/**
	@constant
	@desc			[set] association type.
	@type {Symbol}
*/
module.exports.ASSOCIATION_TYPE_SET = Symbol('set');

/**
	@constant
	@desc					Association types.
	@type {Set.<Symbol>}
*/
module.exports.ASSOCIATION_TYPES = new Set([
	module.exports.ASSOCIATION_TYPE_ARRAY,
	module.exports.ASSOCIATION_TYPE_MAP,
	module.exports.ASSOCIATION_TYPE_SET
]);

/**
	@constant
	@desc			[data] modification type.
	@type {Symbol}
*/
module.exports.MODIFICATION_TYPE_DATA = Symbol('data');

/**
	@constant
	@desc			[association] modification type.
	@type {Symbol}
*/
module.exports.MODIFICATION_TYPE_ASSOCIATION = Symbol('association');

/**
	@constant
	@desc					Modification types.
	@type {Set.<Symbol>}
*/
module.exports.MODIFICATION_TYPES = new Set([
	module.exports.MODIFICATION_TYPE_DATA,
	module.exports.MODIFICATION_TYPE_ASSOCIATION
]);

/**
	@constant
	@desc			[add] operation type.
	@type {Symbol}
*/
module.exports.OPERATION_TYPE_ADD = Symbol('add');

/**
	@constant
	@desc			[update] operation type.
	@type {Symbol}
*/
module.exports.OPERATION_TYPE_UPDATE = Symbol('update');

/**
	@constant
	@desc			[remove] operation type.
	@type {Symbol}
*/
module.exports.OPERATION_TYPE_REMOVE = Symbol('remove');

/**
	@constant
	@desc					Operation types.
	@type {Set.<Symbol>}
*/
module.exports.OPERATION_TYPES = new Set([
	module.exports.OPERATION_TYPE_ADD,
	module.exports.OPERATION_TYPE_UPDATE,
	module.exports.OPERATION_TYPE_REMOVE
]);