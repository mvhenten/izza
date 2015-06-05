'use strict';

var test = require('tape'),
    check = require('../index').check;

test('Classes with a name get pretty errors', function(assert) {
    function Type(value) {
        return true;
    }

    function TypeClass() {
        return true;
    }

    TypeClass.prototype = {
        foo: 'bar'
    };

    assert.ok(check(1, Type), 'check passes for named Type');
    assert.equal(check(1, TypeClass), '"1" is not an instanceof "TypeClass", it is a "Number"');
    assert.ok(new TypeClass(), TypeClass, 'TypeClass has a prototype, it is not a plain function');

    assert.end();
});

test('Anonymous classes are still typechecked', function(assert) {
    var TypeClass = function() {
        return true;
    };

    TypeClass.prototype = {
        foo: 'bar'
    };

    assert.equal(check(1, TypeClass), '"1" is not an instanceof "[anonymous Function]", it is a "Number"');
    assert.equal(check(1, new TypeClass()), 'Input Error: type is not an instanceof Function');
    assert.ok(new TypeClass(), TypeClass, 'instanceof check ok');

    assert.end();
});

test('Pretty errors: get the "name" of value', function(assert) {
    function Type() {};

    var dt = new Date();

    assert.equal(check(dt, Type), '"' + dt + '" is not a "Type", it is a "Date"');
    assert.equal(check([], Type), '"" is not a "Type", it is a "Array"');
    assert.equal(check(undefined, Type), '"undefined" is not a "Type", it is a "undefined"');
    assert.equal(check(null, Type), '"null" is not a "Type", it is a "null"');
    assert.equal(check(false, Type), '"false" is not a "Type", it is a "Boolean"');
    assert.equal(check(1, Type), '"1" is not a "Type", it is a "Number"');
    assert.equal(check(new Buffer([]), Type), '"" is not a "Type", it is a "Buffer"');
    assert.equal(check(function() {}, Type), '"function () {}" is not a "Type", it is a "Function"');
    assert.equal(check(new Type(), Type), '"[object Object]" is not a "Type", it is a "Type"');

    assert.end();


})