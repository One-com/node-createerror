var assert = require('assert'),
    createError = require('./lib/createError');

test('arbitrary property passed to createError', function() {
    var Err = createError({foo: 'bar'}),
        err = new Err();

    assert.equal(err.foo, 'bar');

    var err2 = new Err({foo: 'quux'});
    assert.equal(err2.foo, 'quux');
});
