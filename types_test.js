'use strict';

const test = require('tape'),
    check = require('./check');

const Types = require('./types');

test('Tuple', function(assert) {

    const type = Types.Tuple(Number, Boolean);

    assert.ok(check([1, true], type), 'Typecheck passes');

    assert.deepEqual(check(1, type), new TypeError('Invalid Tuple: value should be an array'));
    assert.deepEqual(check([1, true, true], type), new TypeError('Invalid Tuple: expected 2 items, got 3'));
    assert.deepEqual(check([1, 1], type), new TypeError('Invalid Tuple: item 1: "1" is not a "Boolean", it is a "Number"'));

    assert.end();
});

test('Maybe', function(assert) {

    const type = Types.Maybe(Number);

    assert.ok(check(999, type), 'Typecheck passes for a Number');
    assert.ok(check(null, type), 'Typecheck passes for Null');
    assert.ok(check(undefined, type), 'Typecheck passes for undefined');
    assert.deepEqual(check('string', type), new TypeError('TypeError: "string" is not a "Number", it is a "String"'));

    assert.end();
});

test('Enum', function(assert) {
    const options = ['a', 'b', 'c', '1'];
    const type = Types.Enum(options);

    options.forEach(function(option) {
        assert.ok(check(option, type), 'Typecheck passes for ' + option);
    });

    assert.deepEqual(check(1, type), new TypeError('TypeError: Invalid value in Enum: 1 is not one of 1,2,3'));
    assert.end();
});

test("Enum, not strict", function(assert) {
   const options = [1];
   const type = Types.Enum(options, false);
   assert.ok(check("1", type), "Passes stringy one for non-strict comparison");
   assert.end();
});