"use strict";

const partal = require('partal');
const check = require("./check");

function isa(type, value, done) {
    if (arguments.length == 1)
        return partal(isa, type);

    if (arguments.length == 2)
        return !(check(type, value) instanceof Error);

    return process.nextTick(partal(done, check(type, value)));
}

module.exports = isa;
