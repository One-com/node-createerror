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

        function Constructor(messageOrOptionsOrError) {
            var err;
            if (messageOrOptionsOrError instanceof Error) {
                // Existing instance
                err = messageOrOptionsOrError;
            } else {
                if (typeof messageOrOptionsOrError === 'string') {
                    messageOrOptionsOrError = {message: messageOrOptionsOrError};
                }
                // https://github.com/joyent/node/issues/3212#issuecomment-5493890
                err = new Error();
                err.__proto__ = Constructor.prototype;
                if (Error.captureStackTrace) {
                    Error.captureStackTrace(err, Constructor);
                }
            }
            if (SuperConstructor) {
                SuperConstructor.call(err, err);
            }

            extend(err, options);
            if (typeof messageOrOptionsOrError === 'object' && messageOrOptionsOrError) {
                extend(err, messageOrOptionsOrError);
            }
            return err;
        };
        inherits(Constructor, SuperConstructor || Error);

        // to avoid doing if (err instanceof NotFound)
        // instead you can just do if (err.NotFound)
        if (options.name) {
            Constructor.name = options.name;
            options[options.name] = true;
        }

        return Constructor;
    };
}));
