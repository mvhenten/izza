  'use strict';

 const test = require('tape'),
     assertType = require('./assert');

test("assertType throws", (assert) => {
    assert.throws(() => assertType(Number, "1"), 'TypeError: "1" is not a "Number", it is a "string"');
    assert.end();
});
     
