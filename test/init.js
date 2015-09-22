'use strict';

let lib = {
	node:{
		path:require('path')
	},
	deps:{
		chai:require('chai'),
		expect:require('chai').expect
	},
	odin:{
		init:require('../lib/init'),
		Exception:require('../lib/Exception')
	}
};

lib.deps.chai.use(require('chai-as-promised'));

describe('init', function() {
	describe('.bootstrap()', function() {
		it('should correctly load init scripts', function() {
			const INIT_DIR = 'init_ok';
			let script01 = require('./' + INIT_DIR + '/01_initScript.js');
			let script02 = require('./' + INIT_DIR + '/02_initScript.js.skip');
			let script03 = require('./' + INIT_DIR + '/03_initScript.js');

			lib.deps.expect(script01).to.have.a.property('initialized', false);
			lib.deps.expect(script01).to.have.a.property('cleanedUp', false);
			lib.deps.expect(script02).to.have.a.property('initialized', false);
			lib.deps.expect(script02).to.have.a.property('cleanedUp', false);
			lib.deps.expect(script03).to.have.a.property('initialized', false);
			lib.deps.expect(script03).to.have.a.property('cleanedUp', false);

			return lib.odin.init.bootstrap(lib.node.path.resolve(__dirname, INIT_DIR), function() {
				lib.deps.expect(script01).to.have.a.property('initialized', true);
				lib.deps.expect(script01).to.have.a.property('cleanedUp', false);
				lib.deps.expect(script02).to.have.a.property('initialized', false);
				lib.deps.expect(script02).to.have.a.property('cleanedUp', false);
				lib.deps.expect(script03).to.have.a.property('initialized', true);
				lib.deps.expect(script03).to.have.a.property('cleanedUp', false);
			})
			.then(function() {
				lib.deps.expect(script01).to.have.a.property('initialized', true);
				lib.deps.expect(script01).to.have.a.property('cleanedUp', true);
				lib.deps.expect(script02).to.have.a.property('initialized', false);
				lib.deps.expect(script02).to.have.a.property('cleanedUp', false);
				lib.deps.expect(script03).to.have.a.property('initialized', true);
				lib.deps.expect(script03).to.have.a.property('cleanedUp', true);
			});
		});

		it('should correctly handle errors', function() {
			const INIT_DIR = 'init_fail';
			let script01 = require('./' + INIT_DIR + '/01_initScript.js');
			let script02 = require('./' + INIT_DIR + '/02_initScript.js.skip');
			let script03 = require('./' + INIT_DIR + '/03_initScript.js');

			lib.deps.expect(script01).to.have.a.property('initialized', false);
			lib.deps.expect(script01).to.have.a.property('cleanedUp', false);
			lib.deps.expect(script02).to.have.a.property('initialized', false);
			lib.deps.expect(script02).to.have.a.property('cleanedUp', false);
			lib.deps.expect(script03).to.have.a.property('initialized', false);
			lib.deps.expect(script03).to.have.a.property('cleanedUp', false);

			return lib.odin.init.bootstrap(lib.node.path.resolve(__dirname, INIT_DIR), function() {
				throw new Error('Error must be forwarded');
			})
			.then(function() {
				throw new Error('Error must be forwarded');
			}, function() {
				lib.deps.expect(script01).to.have.a.property('initialized', true);
				lib.deps.expect(script01).to.have.a.property('cleanedUp', true);
				lib.deps.expect(script02).to.have.a.property('initialized', false);
				lib.deps.expect(script02).to.have.a.property('cleanedUp', false);
				lib.deps.expect(script03).to.have.a.property('initialized', false);
				lib.deps.expect(script03).to.have.a.property('cleanedUp', true);
			});
		});
	});
});