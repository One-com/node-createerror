var assert = require('assert'),
    createError = require('./lib/createError');

test('arbitrary property passed to createError', function() {
    var Err = createError({foo: 'bar'}),
        err = new Err();

    assert.equal(err.foo, 'bar');

    var err2 = new Err({foo: 'quux'});
    assert.equal(err2.foo, 'quux');
});

test('Error constructor invoked without new', function() {
    var Err = createError({}),
        err = Err('message');

    assert.ok(err instanceof Err);
});
