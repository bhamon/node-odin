'use strict';

let lib = {
	deps:{
		joi:require('joi'),
		chai:require('chai'),
		expect:require('chai').expect
	},
	odin:{
		util:require('../lib/util'),
		Exception:require('../lib/Exception')
	}
};

lib.deps.chai.use(require('chai-as-promised'));

describe('util', function() {
	describe('.validate()', function() {
		it('should throw on bad parameters', function() {
			lib.deps.expect(function() {
				lib.odin.util.validate();
			}).to.throw();

			lib.deps.expect(function() {
				lib.odin.util.validate('test');
			}).to.throw();

			lib.deps.expect(function() {
				lib.odin.util.validate('foo', 'bar');
			}).to.throw();

			lib.deps.expect(function() {
				lib.odin.util.validate(21, {});
			}).to.throw();
		});

		it('should throw when validation fails', function() {
			lib.deps.expect(function() {
				lib.odin.util.validate('test', lib.deps.joi.object().required());
			}).to.throw(lib.odin.Exception);
		});

		it('should return the validated data set', function() {
			lib.deps.expect(function() {
				let parsed = lib.odin.util.validate('test', lib.deps.joi.string().uppercase().required());
				lib.deps.expect(parsed).to.be.a('string').and.equal('TEST');
			}).to.not.throw();
		});
	});

	describe('promise', function() {
		let fn = function() { return 'hellow'; };
		let nFn = function(p_cb) { p_cb(null, 'hellow'); };
		let nFnEmpty = function(p_cb) { p_cb(null); };
		let nFnMultiple = function(p_cb) { p_cb(null, 'hellow', 'banana'); };
		let fnParam = function(p_a, p_b) { return 'hellow ' + p_a + ', do you want a ' + p_b + '?'; };
		let nFnParam = function(p_a, p_b, p_cb) { p_cb(null, 'hellow ' + p_a + ', do you want a ' + p_b + '?'); };
		let fnError = function() { throw new lib.odin.Exception('cumbaya'); }
		let nFnError = function(p_cb) { p_cb(new lib.odin.Exception('cumbaya')); }
		let clazz = class {
			constructor(p_str) {
				this._str = p_str;
			}

			toUpper() {
				return this._str.toUpperCase();
			}

			nToUpper(p_cb) {
				p_cb(null, this._str.toUpperCase());
			}

			nEmpty(p_cb) {
				p_cb(null);
			}

			nMultiple(p_cb) {
				let parts = this._str.split('-');
				if(parts.length != 2) {
					return p_cb(new lib.odin.Exception('Invalid parts number'));
				}

				return p_cb(null, parts[0], parts[1]);
			}

			substr(p_start, p_length) {
				return this._str.substr(p_start, p_length);
			}

			nSubstr(p_start, p_length, p_cb) {
				p_cb(null, this._str.substr(p_start, p_length));
			}

			error() {
				throw new lib.odin.Exception('patitobata');
			}

			nError(p_cb) {
				p_cb(new lib.odin.Exception('patitobata'));
			}
		};

		describe('.fapply()', function() {
			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.fapply(fn)).to.eventually.equal('hellow');
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.fapply(fnParam, ['bob', 'banana'])).to.eventually.equal('hellow bob, do you want a banana?');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.fapply(fnError)).to.be.rejectedWith(lib.odin.Exception, {message:'cumbaya'});
			});
		});

		describe('.fcall()', function() {
			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.fcall(fn)).to.eventually.equal('hellow');
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.fcall(fnParam, 'stuart', 'lollipop')).to.eventually.equal('hellow stuart, do you want a lollipop?');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.fcall(fnError)).to.be.rejectedWith(lib.odin.Exception, {message:'test'});
			});
		});

		describe('.post()', function() {
			let obj = new clazz('foo-bar');

			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.post(obj, 'toUpper')).to.eventually.equal('FOO-BAR');
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.post(obj, 'substr', [2, 4])).to.eventually.equal('o-ba');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.post(obj, 'error')).to.be.rejectedWith(lib.odin.Exception, {message:'patitobata'});
			});
		});

		describe('.invoke()', function() {
			let obj = new clazz('dark-grizzly');

			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.invoke(obj, 'toUpper')).to.eventually.equal('DARK-GRIZZLY');
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.invoke(obj, 'substr', 3, 5)).to.eventually.equal('k-gri');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.invoke(obj, 'error')).to.be.rejectedWith(Error, {message:'pati4tobata'});
			});
		});

		describe('.nfapply()', function() {
			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.nfapply(nFn)).to.eventually.equal('hellow');
			});

			it('should handle empty result', function() {
				return lib.deps.expect(lib.odin.util.promise.nfapply(nFnEmpty)).to.be.fulfilled;
			});

			it('should handle multiple results', function() {
				return lib.deps.expect(lib.odin.util.promise.nfapply(nFnMultiple)).to.eventually.deep.equal(['hellow', 'banana']);
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.nfapply(nFnParam, ['bob', 'banana'])).to.eventually.equal('hellow bob, do you want a banana?');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.nfapply(nFnError)).to.be.rejectedWith(lib.odin.Exception, {message:'cumbaya'});
			});
		});

		describe('.nfcall()', function() {
			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.nfcall(nFn)).to.eventually.equal('hellow');
			});

			it('should handle empty result', function() {
				return lib.deps.expect(lib.odin.util.promise.nfcall(nFnEmpty)).to.be.fulfilled;
			});

			it('should handle multiple results', function() {
				return lib.deps.expect(lib.odin.util.promise.nfcall(nFnMultiple)).to.eventually.deep.equal(['hellow', 'banana']);
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.nfcall(nFnParam, 'stuart', 'lollipop')).to.eventually.equal('hellow stuart, do you want a lollipop?');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.nfcall(nFnError)).to.be.rejectedWith(lib.odin.Exception, {message:'test'});
			});
		});

		describe('.npost()', function() {
			let obj = new clazz('foo-bar');

			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.npost(obj, 'nToUpper')).to.eventually.equal('FOO-BAR');
			});

			it('should handle empty result', function() {
				return lib.deps.expect(lib.odin.util.promise.npost(obj, 'nEmpty')).to.be.fulfilled;
			});

			it('should handle multiple results', function() {
				return lib.deps.expect(lib.odin.util.promise.npost(obj, 'nMultiple')).to.eventually.deep.equal(['foo', 'bar']);
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.npost(obj, 'nSubstr', [2, 4])).to.eventually.equal('o-ba');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.npost(obj, 'nError')).to.be.rejectedWith(lib.odin.Exception, {message:'patitobata'});
			});
		});

		describe('.ninvoke()', function() {
			let obj = new clazz('dark-grizzly');

			it('should return a correct promise', function() {
				return lib.deps.expect(lib.odin.util.promise.ninvoke(obj, 'nToUpper')).to.eventually.equal('DARK-GRIZZLY');
			});

			it('should handle empty result', function() {
				return lib.deps.expect(lib.odin.util.promise.ninvoke(obj, 'nEmpty')).to.be.fulfilled;
			});

			it('should handle multiple results', function() {
				return lib.deps.expect(lib.odin.util.promise.ninvoke(obj, 'nMultiple')).to.eventually.deep.equal(['dark', 'grizzly']);
			});

			it('should forward arguments', function() {
				return lib.deps.expect(lib.odin.util.promise.ninvoke(obj, 'nSubstr', 3, 5)).to.eventually.equal('k-gri');
			});

			it('should forward exceptions', function() {
				return lib.deps.expect(lib.odin.util.promise.ninvoke(obj, 'nError')).to.be.rejectedWith(Error, {message:'pati4tobata'});
			});
		});

		describe('.denodeify()', function() {
			it('should return a correct promise', function() {
				let dnFn = lib.odin.util.promise.denodeify(nFn);
				return lib.deps.expect(dnFn()).to.eventually.equal('hellow');
			});

			it('should handle empty result', function() {
				let dnFnEmpty = lib.odin.util.promise.denodeify(nFnEmpty);
				return lib.deps.expect(dnFnEmpty()).to.be.fulfilled;
			});

			it('should handle multiple results', function() {
				let dnFnMultiple = lib.odin.util.promise.denodeify(nFnMultiple);
				return lib.deps.expect(dnFnMultiple()).to.eventually.deep.equal(['hellow', 'banana']);
			});

			it('should forward arguments', function() {
				let dnFnParam = lib.odin.util.promise.denodeify(nFnParam);
				return lib.deps.expect(dnFnParam('stuart', 'lollipop')).to.eventually.equal('hellow stuart, do you want a lollipop?');
			});

			it('should forward exceptions', function() {
				let dnFnError = lib.odin.util.promise.denodeify(nFnError);
				return lib.deps.expect(dnFnError()).to.be.rejectedWith(lib.odin.Exception, {message:'test'});
			});
		});

		describe('.nodeify()', function() {
			let pFn = function() { return Promise.resolve('patata'); };
			let pFnError = function() { return Promise.reject(new Error('patitobata')); };

			it('should call the provided callback', function(p_done) {
				let npFn = lib.odin.util.promise.nodeify(pFn);

				npFn(function(p_error, p_value) {
					try {
						lib.deps.expect(p_error).to.be.null;
						lib.deps.expect(p_value).to.be.equal('patata');

						p_done();
					} catch(p_error) {
						p_done(p_error);
					}
				});
			});

			it('should forward exceptions', function(p_done) {
				let npFnError = lib.odin.util.promise.nodeify(pFnError);
				npFnError(function(p_error) {
					try {
						lib.deps.expect(p_error).to.be.an('Error');
						p_done();
					} catch(p_error) {
						p_done(p_error);
					}
				});
			});
		});
	});
});