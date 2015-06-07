'use strict';

var test = require('tape'),
    check = require('../index').check;

var Types = require('../lib/types');

test('Tuple', function(assert) {

    var type = Types.Tuple(Number, Boolean);

    assert.ok(check([1, true], type), 'Typecheck passes');

    assert.deepEqual(check(1, type), new TypeError('Invalid Tuple: value should be an array'));
    assert.deepEqual(check([1, true, true], type), new TypeError('Invalid Tuple: expected 2 items, got 3'));
    assert.deepEqual(check([1, 1], type), new TypeError('Invalid Tuple: item 1: "1" is not a "Boolean", it is a "Number"'));

    assert.end();
});

test('Maybe', function(assert) {

    var type = Types.Maybe(Number);

    assert.ok(check(999, type), 'Typecheck passes for a Number');
    assert.ok(check(null, type), 'Typecheck passes for Null');
    assert.ok(check(undefined, type), 'Typecheck passes for undefined');
    assert.deepEqual(check('string', type), new TypeError('TypeError: "string" is not a "Number", it is a "String"'));

    assert.end();
});

test('Enum', function(assert) {
    var options = ['a', 'b', 'c', '1'];
    var type = Types.Enum(options);

    options.forEach(function(option) {
        assert.ok(check(option, type), 'Typecheck passes for ' + option);
    });

    assert.ok(check(1, type), 'non-strict typeCheck performs coercion');
    assert.deepEqual(check('x', type), new TypeError('Invalid value in Enum: x is not one of a,b,c,1'));

    var strictOptions = ['1', '2', '3'];
    var strictType = Types.Enum(strictOptions, true);

    strictOptions.forEach(function(option) {
        assert.equal(check(option, strictType), true, 'strict Typecheck passes for ' + option);
    });

    assert.deepEqual(check(1, strictType), new TypeError('TypeError: Invalid value in Enum: 1 is not one of 1,2,3'));

    assert.end();
});