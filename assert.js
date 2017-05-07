"use strict";

const check = require("./check");

module.exports = function assertType(type, value) {
    var err = check(type, value);
    
    if (err) throw err;
};

