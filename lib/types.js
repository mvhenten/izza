"use strict";

var sliced = require('sliced');
var check = require('../index').check;
var format = require('./util').format;
var typeName = require('./util').typeName;

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

function Enum(options, strict) {
    return function Enum(value) {
        for (var i = 0; i < options.length; i++) {
            if (strict) {
                console.log(value === options[i], value, options[i]);
                if (value === options[i]) return true;
            }
            else {
                if (value == options[i]) return true;
            }
        }

        return new TypeError(format('Invalid value in Enum: %s is not one of %s', value, options));
    };
}

module.exports.Enum = Enum;
