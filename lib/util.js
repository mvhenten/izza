'use strict';

function format(tpl) {
    var values = Array.prototype.slice.call(arguments, 1);
    return tpl.replace(/(%s)/g, values.shift.bind(values));
}

module.exports.format = format;

function typeName(check) {
    if (!check) return check;
    if (check.name) return check.name;

    // it's a function without a name
    if (check instanceof Function)
        return '[anonymous Function]';


    var str = check.prototype.toString();
    return str === '[object Object]' ? check.name : str;
}

module.exports.typeName = typeName;

function valueName(val) {
    if (val === undefined || val === null) return val;
    if (typeof val === 'function' && val.name) return val.name;
    if (typeof val === 'object') {
        var ctr = val.constructor;

        while (ctr) {
            if (ctr.name) return ctr.name;
            ctr = ctr.constructor;
        }
    }

    var type = typeof val;
    return type.charAt(0).toUpperCase() + type.slice(1);
}

module.exports.valueName = valueName;
