var expect = require('unexpected'),
    createError = require('../lib/createError');

describe('createError', function () {
    // https://github.com/joyent/node/issues/3212
    it('should return "[object Error]" when Object.prototype.toString is called on it', function () {
        var Err = createError({foo: 'bar'});
        expect(Object.prototype.toString.call(new Err()), 'to equal', '[object Error]');
    });

    it('should result a constructor that produces instances of itself and Error', function () {
        var Err = createError({foo: 'bar'});
        expect(new Err(), 'to be an', Err);
    });

    it('should return a constructor that prefers a message passed as to first argument to the one provided in the options object', function () {
        var Err = createError({message: 'default message'});
        expect(new Err('overridden message').message, 'to equal', 'overridden message');
    });

    it('should return a constructor that produces instances of its SuperConstructor and Error', function () {
        var SuperErr = createError({quux: 'baz'}),
            Err = createError({foo: 'bar'}, SuperErr);
        expect(new Err(), 'to be an', Error);
        expect(new Err(), 'to be a', SuperErr);
    });

    it('should return a constructor that produces instances whose toString method return the expected value', function () {
        var Err = createError({foo: 'bar', name: 'TheErrorName'});
        expect(new Err('error message').toString(), 'to equal', 'TheErrorName: error message');
        expect(new Err().toString(), 'to equal', 'TheErrorName');
    });

    it('should subclass TypeError (and thus other built-in Error subclasses) correctly', function () {
        var Err = createError({foo: 'bar', name: 'TheErrorName'}, TypeError),
            err = new Err('the error message');
        expect(Object.prototype.toString.call(err), 'to equal', '[object Error]');
        expect(err, 'to be a', TypeError);
        expect(err, 'to be an', Error);
        expect(err, 'to be an', Err);
    });

    it('should adopt arbitrary properties passed to a generated constructor', function () {
        var Err = createError({foo: 'bar'}),
            err = new Err();

        expect(err.foo, 'to equal', 'bar');

        var err2 = new Err({foo: 'quux'});
        expect(err2.foo, 'to equal', 'quux');
        // Make sure that top stack frame in err.stack points to this file rather than createError.js:
        expect(err2.stack, 'to match', /test\/createError\.js:/);
    });

    it('should preserve the original stack trace and gain the properties of the Error class and its superclass when an existing Error instance is passed to a generated constructor', function () {
        function Foo() {
            return new Error('the original error');
        }
        var SuperError = createError({isSuper: true, name: 'Super'}),
            Err = createError({name: 'SomethingMoreSpecific'}, SuperError),
            err = new Err(Foo('blabla'));
        expect(err.name, 'to equal', 'SomethingMoreSpecific');
        expect(err.isSuper, 'to equal', true);
        expect(err.SomethingMoreSpecific, 'to equal', true);
        expect(err.stack, 'to match', /the original error/);
        expect(err.stack, 'to match', /Foo/);
    });

    it('should produce a correct instance when a generated constructor is invoked without the new operator', function () {
        var Err = createError(),
            err = Err('message');

        expect(err, 'to be an', Err);
        // Make sure that top stack frame in err.stack points to this file rather than createError.js:
        expect(err.stack.split("\n")[1], 'to match', /test\/createError\.js:/);
    });
});
