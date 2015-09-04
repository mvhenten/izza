'use strict';

var isPlainFunction = require('isa-plain-function');
var format = require('util').format;
var partal = require('partal');
var nameType = require("type-name");

function name(val) {
    if (nameType(val) === "function" && val.name)
        return val.name;

    if (typeof val === 'object' && val) {
        // its an instance of something
        var ctr = val.constructor;

        while (ctr) {
            if (typeof ctr === "function" && ctr.name)
                return "[instanceof " + name(ctr) + "]";
            ctr = ctr.constructor;
        }
    }

    return nameType(val);
}


function check(value, type) {
    if (type instanceof RegExp)
        return type.test(value) ? format('a value matching "%s"', type) : undefined;

    if (/^(Boolean|Number|String|RegExp|Array|Object|Date|Function)$/.test(type.name)) {
        if (typeof value === type.name.toLowerCase()) return;
        if ((value instanceof type)) return;

        return name(type);
    }

    if (isPlainFunction(type))
        return type(value);

    if (!(value instanceof type))
        return name(type);
}


var Izza = {
    check: function(type, value) {
        if (!((type instanceof Function) || (type instanceof RegExp)))
            return new TypeError('First argument "type" is not an instanceof Function');

        var err = check(value, type);

        if (err instanceof Error)
            return err;

        if (err === false)
            err = name(type);

        if (typeof err === "string")
            return new TypeError(format('"%s" is not a "%s", it is a "%s"', value, err, name(value)));
    },

    isa: function(type, value, done) {
        if (arguments.length == 1)
            return partal(Izza.isa, type);

        if (arguments.length == 2)
            return !(Izza.check(type, value) instanceof Error);

        return process.nextTick(partal(done, Izza.check(type, value)));
    },

    assert: function(type, value) {
        var err = Izza.check(type, value);
        if (err) throw err;
    }
};

module.exports = Izza;