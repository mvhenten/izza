'use strict';

const isPlainFunction = require('isa-plain-function');
const format = require('util').format;
const name = require("./lib/name");


function typeCheck(type, value) {
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

module.exports = function check(type, value) {
        if (!((type instanceof Function) || (type instanceof RegExp)))
            return new TypeError('First argument "type" is not an instanceof Function');

        let err = typeCheck(type, value);
        
        if (err instanceof Error)
            return err;

        if (err === false)
            err = name(type);

        if (typeof err === "string")
            return new TypeError(format('"%s" is not a "%s", it is a "%s"', value, err, name(value)));
    
};
