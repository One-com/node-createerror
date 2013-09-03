var expect = require('unexpected'),
    createError = require('../lib/createError');

describe('createError', function () {
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
        var SuperError = createError({isSuper: true}),
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
