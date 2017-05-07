"use strict";

const sliced = require('sliced');
const check = require('./check');
const format = require('util').format;

function Tuple(args) {
    var types = sliced(arguments);

    return function Tuple(value) {
        var err = check(value, Array);

        if (err !== true)
            return new TypeError("Invalid Tuple: value should be an array");

        if (value.length !== types.length)
            return new TypeError(format('Invalid Tuple: expected %s items, got %s', types.length, value.length));

        for (var i = 0; i < types.length; i++) {
            err = check(value[i], types[i]);
            if (err !== true)
                return new TypeError(format('Invalid Tuple: item %s: %s', i, err));
        }
        return true;
    };
}

module.exports.Tuple = Tuple;

function Maybe(type) {
    return function Maybe(value) {
        if (value === null || value === undefined)
            return true;

        var err = check(value, type);

        if (err === true)
            return err;

        return new TypeError(err.message ? err.message : err);
    };
}

module.exports.Maybe = Maybe;

function Enum(options, loose) {
    return function Enum(value) {
        if (options.includes(value))
            return true;
            
        if (loose)
            return options.some(option => option == value);

        return new TypeError(format('Invalid value in Enum: %s is not one of %s', value, options));
    };
}

module.exports.Enum = Enum;
