var assert = require('assert'),
    createError = require('./lib/createError');

test('arbitrary property passed to createError', function () {
    var Err = createError({foo: 'bar'}),
        err = new Err();

    assert.equal(err.foo, 'bar');

    var err2 = new Err({foo: 'quux'});
    assert.equal(err2.foo, 'quux');
    // Make sure that top stack frame in err.stack points to this file rather than createError.js:
    assert.ok(/test\.js:/.test(err.stack.split("\n")[1]));
});

test('existing Error instance passed to createError should preserve the original stack trace and gain the properties of the Error class and its superclass', function () {
    function Foo() {
        return new Error('the original error');
    }
    var SuperError = createError({isSuper: true}),
        Err = createError({name: 'SomethingMoreSpecific'}, SuperError),
        err = new Err(Foo('blabla'));
    assert.equal(err.name, 'SomethingMoreSpecific');
    assert.ok(err.isSuper);
    assert.ok(err.SomethingMoreSpecific);
    assert.ok(/the original error/.test(err.stack));
    assert.ok(/Foo/.test(err.stack));
});

test('Error constructor invoked without new', function () {
    var Err = createError(),
        err = Err('message');

    assert.ok(err instanceof Err);
    // Make sure that top stack frame in err.stack points to this file rather than createError.js:
    assert.ok(/test\.js:/.test(err.stack.split("\n")[1]));
});
