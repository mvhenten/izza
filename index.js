'use strict';

function format(tpl) {
    var values = Array.prototype.slice.call(arguments, 1);
    return tpl.replace(/(%s)/g, values.shift.bind(values));
}

function valueName(val){
    if( val instanceof Array ) return 'Array';
    if( val instanceof Function ) return 'Function';

    return typeof val;
}

function typeName(check) {
    if (!check) return check;
    if (check.name) return check.name;
    if ( check instanceof Function ) return check.toString();

    var str = check.prototype.toString();
    return str === '[object Object]' ? check.name : str;
}

function error(name) {
    return format('%s "%s"', /^[aoeu]/.test(name.toLowerCase()) ? 'an' : 'a', name);
}

function check(value, type) {
    if (type instanceof RegExp) {
        if (!type.test(value)) return format('a value matching "%s"', type);
        return;
    }

    if (/^(Boolean|Number|String|RegExp|Array|Object|Date|Function)$/.test(type.name)) {
        if (typeof value === type.name.toLowerCase()) return;
        if ((value instanceof type)) return;

        return error(type.name);
    }

    if (type.name === '') {
        if (value instanceof type) return;
        return format('an instanceof "%s"', typeName(type) );
    }

    if (!type(value))
        return error(typeName(type));
}

var Izza = {
    check: function(value, type) {
        var err = check(value, type);

        if (err) return format('"%s" is not %s, it is a "%s"', value, err, valueName(value) );
        return true;
    },

    isa: function(type, value, done) {
        var ok = Izza.check(value, type);

        if (done instanceof Function)
            return done( ok === true ? null : ok, value, type);

        if (ok !== true) throw new TypeError(ok);
        return ok;
    }
};

module.exports = Izza;