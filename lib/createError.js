(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.createError = factory();
    }
}(this, function () {
    // From https://github.com/Raynos/xtend
    function extend(target) { // ...
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

    return function createError(options, SuperConstructor) {
        options = options || {};
        SuperConstructor = SuperConstructor || Error;

        function Constructor(message) {
            var err;
            if (message instanceof Error) {
                err = new Constructor();
                err.stack = message.stack;
                extend(err, message);
                return err;
            } else {
                if (this instanceof Constructor) {
                    err = this;
                } else {
                    // Can't use `return new Constructor(message)` here as that would introduce an annoying extra frame in err.stack.
                    err = new Constructor(message);
                }
                SuperConstructor.call(err);
                Error.captureStackTrace(err, Constructor);
            }

            if (typeof message === 'string') {
                err.message = message;
            } else if (typeof message === 'object' && message) {
                extend(err, message);
            }
            return err;
        };
        inherits(Constructor, SuperConstructor);

        // to avoid doing if (err instanceof NotFound)
        // instead you can just do if (err.NotFound)
        options[options.name] = true;

        extend(Constructor.prototype, options);

        Constructor.prototype.toString = function () {
            return this.name +
                (this.statusCode ? ' [' + this.statusCode + ']' : '') +
                (this.message ? ': ' + this.message : '');
        };

        return Constructor;
    };
}));
