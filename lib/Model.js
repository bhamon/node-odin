'use strict';

var lib = {
	deps:{
		joi:require('joi')
	},
	odin:{
		constants:require('./constants'),
		Exception:require('./Exception'),
		util:require('./util'),
		ModelData:require('./ModelData'),
		modelAssociations:{
			ModelAssociationArray:require('./modelAssociations/ModelAssociationArray'),
			ModelAssociationMap:require('./modelAssociations/ModelAssociationMap'),
			ModelAssociationSet:require('./modelAssociations/ModelAssociationSet')
		}
	}
};

let SYMBOL_MEMBER_DATA = Symbol('data');
let SYMBOL_MEMBER_ASSOCIATIONS = Symbol('associations');
let SYMBOL_METHOD_POPULATE = Symbol('populate');
let SYMBOL_METHOD_CREATE_ASSOCIATION = Symbol('createAssociation');

/**
	@class
	@classdesc		Base model class.
	@alias			module:odin.Model
*/
class Model {
	/**
		@desc						Constructs a base model by calling {@link module:odin.Model.[SYMBOL_METHOD_POPULATE]}.
		@param {Object} p_data		Data set used to initialize the model.
	*/
	constructor(p_data) {
		let data = lib.odin.util.validate(p_data, lib.deps.joi.object().optional().default({}));

		/**
			@readonly
			@protected
			@member {module:odin.ModelData}		module:odin.Model#[SYMBOL_MEMBER_DATA]
			@desc								Underlying data.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_DATA, {value:new lib.odin.ModelData()});

		/**
			@readonly
			@protected
			@member {Map}		module:odin.Model#[SYMBOL_MEMBER_ASSOCIATIONS]
			@desc				Underlying associations map.
		*/
		Object.defineProperty(this, SYMBOL_MEMBER_ASSOCIATIONS, {value:new Map()});

		this[SYMBOL_METHOD_POPULATE](data);
	}

	/**
		@protected
		@abstract
		@desc						Populates this instance with the provided data.
		@param {Object} p_data		Data set used to initialize the model.
	*/
	[SYMBOL_METHOD_POPULATE](p_data) {
		throw new lib.odin.Exception('Abstract method not implemented', {method:'populate'});
	}

	/**
		@protected
		@desc						Creates a new association.
		@param {String} p_name		Association name.
		@param {Symbol} p_type		Association type (one of {@link module:odin/constants.ASSOCIATION_TYPES});
	*/
	[SYMBOL_METHOD_CREATE_ASSOCIATION](p_name, p_type) {
		let args = lib.odin.util.validate({
			name:p_name,
			type:p_type
		}, {
			name:lib.deps.joi.string().required().min(1),
			type:lib.deps.joi.object().required().valid(Array.from(lib.odin.constants.ASSOCIATION_TYPES))
		});

		switch(args.type) {
			case lib.odin.constants.ASSOCIATION_TYPE_ARRAY:
				this[SYMBOL_MEMBER_ASSOCIATIONS].set(args.name, new lib.odin.modelAssociations.ModelAssociationArray());
			break;
			case lib.odin.constants.ASSOCIATION_TYPE_MAP:
				this[SYMBOL_MEMBER_ASSOCIATIONS].set(args.name, new lib.odin.modelAssociations.ModelAssociationMap());
			break;
			case lib.odin.constants.ASSOCIATION_TYPE_SET:
				this[SYMBOL_MEMBER_ASSOCIATIONS].set(args.name, new lib.odin.modelAssociations.ModelAssociationSet());
			break;
		}
	}
}

/**
	@member {Symbol}	module:odin.Model.SYMBOL_MEMBER_DATA
	@desc				Symbol to access the protected [data] member.
*/
Object.defineProperty(Model, 'SYMBOL_MEMBER_DATA', {value:SYMBOL_MEMBER_DATA});

/**
	@protected
	@member {Symbol}		module:odin/dataSource.DataSource.SYMBOL_MEMBER_ASSOCIATIONS
	@desc					Symbol to access the protected [associations] member.
*/
Object.defineProperty(Model, 'SYMBOL_MEMBER_ASSOCIATIONS', {value:SYMBOL_MEMBER_ASSOCIATIONS});

/**
	@member {Symbol}	module:odin.Model.SYMBOL_METHOD_POPULATE
	@desc				Symbol to access the protected [populate] method.
*/
Object.defineProperty(Model, 'SYMBOL_METHOD_POPULATE', {value:SYMBOL_METHOD_POPULATE});

/**
	@member {Symbol}	module:odin.Model.SYMBOL_METHOD_CREATE_ASSOCIATION
	@desc				Symbol to access the protected [createAssociation] method.
*/
Object.defineProperty(Model, 'SYMBOL_METHOD_CREATE_ASSOCIATION', {value:SYMBOL_METHOD_CREATE_ASSOCIATION});

module.exports = Model;