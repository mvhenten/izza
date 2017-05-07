  'use strict';

 const test = require('tape'),
     check = require('./check');


 test('Unnamed custom types best efford: returning when type check returns boolean true', function(assert) {
     const anonType = function(value) {
         return /\w+/.test(value) && (typeof value == "string");
     };

     assert.equal(check(anonType, new anonType()).toString(), 'TypeError: "[object Object]" is not a "anonType", it is a "[instanceof anonType]"');
     assert.equal(check(anonType, "foo"), undefined, "anon type passes");
     assert.equal(check(anonType, "*").toString(), 'TypeError: "*" is not a "anonType", it is a "string"');

     assert.end();
 });

 test('Unnamed custom types best efford: type check returns error', function(assert) {
     const anonType = function(value) {
         return /\d+/.test(value) ? undefined : new Error("not like a number");
     };

     assert.equal(check(anonType, new anonType()).toString(), 'Error: not like a number');
     assert.equal(check(anonType, "123"), undefined, "anon type passes");

     assert.end();
 });

 test('Custom types with a name get pretty errors', function(assert) {
     function Type(value) {
         return /\d+/.test(value);
     }

     assert.equal(check(Type, "foo").toString(), 'TypeError: "foo" is not a "Type", it is a "string"');
     assert.equal(check(Type, 1), undefined, 'check passes for named Type');
     assert.equal(check(Type, new Type()).toString(), 'TypeError: "[object Object]" is not a "Type", it is a "[instanceof Type]"');

     assert.end();
 });

 test('Classes with a name get pretty errors', function(assert) {
     function TypeClass() {
         return true;
     }

     TypeClass.prototype = {
         foo: 'bar'
     };

     assert.equal(check(TypeClass, 1).toString(), 'TypeError: "1" is not a "TypeClass", it is a "number"');
     assert.equal(check(TypeClass, new TypeClass()), undefined, 'TypeClass has a prototype, it is not a plain function');

     assert.end();
 });

 test('Anonymous classes are still typechecked', function(assert) {
     const TypeClass = function() {
         return true;
     };

     TypeClass.prototype = {
         foo: 'bar'
     };

     assert.equal(check(TypeClass, 1).toString(), 'TypeError: "1" is not a "TypeClass", it is a "number"');
     assert.equal(check(new TypeClass(), 1).toString(), 'TypeError: First argument "type" is not an instanceof Function');
     assert.ok(new TypeClass(), TypeClass, 'instanceof check ok');

     assert.end();
 });

 test('Pretty errors: get the "name" of value', function(assert) {
     function Type() {
         return false;
     }

     const dt = new Date();

     assert.equal(check(Type, dt).toString(), 'TypeError: "' + dt + '" is not a "Type", it is a "[instanceof Date]"');
     assert.equal(check(Type, []).toString(), 'TypeError: "" is not a "Type", it is a "[instanceof Array]"');
     assert.equal(check(Type, undefined).toString(), 'TypeError: "undefined" is not a "Type", it is a "undefined"');
     assert.equal(check(Type, null).toString(), 'TypeError: "null" is not a "Type", it is a "null"');
     assert.equal(check(Type, false).toString(), 'TypeError: "false" is not a "Type", it is a "boolean"');
     assert.equal(check(Type, 1).toString(), 'TypeError: "1" is not a "Type", it is a "number"');
     assert.equal(check(Type, new Buffer([])).toString(), 'TypeError: "" is not a "Type", it is a "[instanceof Buffer]"');
     assert.equal(check(Type, function() {}).toString(), 'TypeError: "function () {}" is not a "Type", it is a "function"');
     assert.equal(check(Type, new Type()).toString(), 'TypeError: "[object Object]" is not a "Type", it is a "[instanceof Type]"');

     assert.end();
 });