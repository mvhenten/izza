"use strict";

const check = require("./check");

module.exports = function assertType(type, value) {
    const err = check(type, value);
    
    if (err) throw err;
};

