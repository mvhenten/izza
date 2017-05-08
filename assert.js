"use strict";

const check = require("./check");

module.exports = function assertType(type, value, message) {
    const err = check(type, value);
    
    if (!err) return;
    
    if (message)
        err.message = `${message}: ${err.message}`;
        
    err.name = "AssertionError";
    
    throw err;
};

