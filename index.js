var util = require('util'),
    xtend = require('xtend');

module.exports = function createError(options, SuperConstructor) {
    SuperConstructor = SuperConstructor || Error;

    function Constructor(message) {
        SuperConstructor.call(this);
        Error.captureStackTrace(this, arguments.callee);

        if (typeof message === 'string') {
            this.message = message;
        } else if (typeof message === 'object' && message) {
            xtend(this, message);
        }
    };
    util.inherits(Constructor, SuperConstructor);

    xtend(Constructor.prototype, options);

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
