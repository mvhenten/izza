'use strict';

const test = require('tape');
const assertType = require('./assert');

test("assertType throws", (assert) => {
    assert.throws(() => assertType(Number, "1"),
        /AssertionError: "1" is not a "Number", it is a "string"/
    );
    assert.end();
});




test("assertType throws custom message", (assert) => {
    assert.throws(() => assertType(Number, "1", '"foo" is a number'),
        /AssertionError: "foo" is a number: "1" is not a "Number", it is a "string"/
    );
    assert.end();
});