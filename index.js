'use strict';

var isPlainFunction = require('isa-plain-function');

function format(tpl) {
    var values = Array.prototype.slice.call(arguments, 1);
    return tpl.replace(/(%s)/g, values.shift.bind(values));
}

function valueName(val){
    if( val === undefined || val === null ) return val;
    if( typeof val === 'function' && val.name ) return val.name;
    if( typeof val === 'object' ){
        var ctr = val.constructor;
        
        while( ctr ){
            if( ctr.name ) return ctr.name;
            ctr = ctr.constructor;
        }
    }
    
    var type = typeof val;
    return type.charAt(0).toUpperCase() + type.slice(1);
}


function typeName(check) {
    if (!check) return check;
    if (check.name) return check.name;

    // it's a function without a name
    if ( check instanceof Function )
        return '[anonymous Function]';
        
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

    if( isPlainFunction( type ) && type.name ){
        if( ! type(value ) )
            return error(typeName(type));
        return;
    }
    
    if (value instanceof type) return;
    
    return format('an instanceof "%s"', typeName(type) );
}

var Izza = {
    check: function(value, type) {
        if( ! ((type instanceof Function) || (type instanceof RegExp)) )
            return format( 'Input Error: type is not an instanceof Function' );

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