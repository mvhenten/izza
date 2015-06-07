'use strict';

var isPlainFunction = require('isa-plain-function');
var format = require('./lib/util').format;
var typeName = require('./lib/util').typeName;
var valueName = require('./lib/util').valueName;

function formatError(name) {
    return format('%s "%s"', /^[aoeu]/.test(name.toLowerCase()) ? 'an' : 'a', name);
}

function check(value, type) {
    if (type instanceof RegExp) {
        if (!type.test(value)) return format('a value matching "%s"', type);
        return;
    }

    if (/^(Boolean|Number|String|RegExp|Array|Object|Date|Function)$/.test(type.name)) {
        if (typeof value === type.name.toLowerCase()) return;
        if ((value instanceof type)) return;

        return formatError(typeName(type));
    }

    if (isPlainFunction(type) && type.name) {
        var err = type(value);

        if (err === true) return;

        if (err instanceof TypeError)
            return err;

        return formatError(typeName(type));
    }

    if (value instanceof type) return;

    return format('an instanceof "%s"', typeName(type));
}

var Izza = {
    check: function(value, type) {
        if (!((type instanceof Function) || (type instanceof RegExp)))
            return format('Input Error: type is not an instanceof Function');

        var err = check(value, type);

        if (!err) return true;

        if (err instanceof TypeError)
            return err;

        return format('"%s" is not %s, it is a "%s"', value, err, valueName(value));
    },

    isa: function(type, value, done) {
        var err = Izza.check(value, type);

        if (done instanceof Function)
            return done(err === true ? null : err, value, type);

        if (err instanceof TypeError)
            throw err;

        if (err !== true) throw new TypeError(err);
        return true;
    }
};

module.exports = Izza;