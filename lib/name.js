'use strict';

var nameType = require("type-name");

module.exports = function name(val) {
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
};
