// From https://github.com/Raynos/xtend
function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i],
            keys = Object.keys(source);

        for (var j = 0; j < keys.length; j++) {
            var name = keys[j];
            target[name] = source[name];
        }
    }

    return target;
}

// From node.js 0.8.21:
function inherits(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
}

module.exports = function createError(options, SuperConstructor) {
    SuperConstructor = SuperConstructor || Error;

    function Constructor(message) {
        SuperConstructor.call(this);
        Error.captureStackTrace(this, arguments.callee);

        if (typeof message === 'string') {
            this.message = message;
        } else if (typeof message === 'object' && message) {
            extend(this, message);
        }
    };
    inherits(Constructor, SuperConstructor);

    extend(Constructor.prototype, options);

    // to avoid doing if (err instanceof NotFound)
    // instead you can just do if (err.NotFound)
    Constructor.prototype[options.name] = true;

    Constructor.prototype.toString = function () {
        return this.name +
            (this.statusCode ? ' [' + this.statusCode + ']' : '') +
            (this.message ? ': ' + this.message : '');
    };

    return Constructor;
};
