 'use strict';

 const test = require('tape'),
     partal = require('partal'),
     async = require('async'),
     isa = require('./isa');

 test('isa returns true or false', function(assert) {

     assert.ok(isa(Number, 1), "ok for number");
     assert.equal(isa(Number, "foo"), false, "string is not a number");

     assert.end();
 });

 test('isa returns error objects to a callback', function(assert) {
     async.series([
         function(next) {
             isa(Number, 1, function(err) {
                 assert.equal(err, undefined, "1 isa number, check returns undefined");
                 next();
             });
         },
         function(next) {
             isa(Number, "foo", function(err) {
                 assert.ok(err instanceof Error, "err is an error");
                 assert.equal(err.toString(), 'TypeError: "foo" is not a "Number", it is a "string"', "got the expected err");
                 next();
             });
         }
     ], assert.end);
 });

 test('isa can be partial', function(assert) {

     const check = isa(Number);

     assert.ok(check(1), "isa can be partially applied");
     assert.equal(check("foo"), false, "returns false when check fails");

     check("foo", function(err) {
         assert.ok(err instanceof Error, "err is an error");
         assert.equal(err.toString(), 'TypeError: "foo" is not a "Number", it is a "string"', "got the expected err");

         assert.end();
     });
 });

 test('isa works well in an async loop', function(assert) {
     async.parallel([
         function(next) {
             isa(Number, 1, next);
         },
         function(next) {
             isa(String, 'foo', next);
         },
         function(next) {
             isa(Boolean, false, next);
         },
         function(next) {
             isa(Date, new Date(), next);
         },
         function(next) {
             isa(Array, [1], next);
         },
     ], function(err) {
         assert.ok(!err, "no errors");
         assert.end();
     });
 });

 test('isa in async.each', function(assert) {
     async.each([1, 2, 3, 4], isa(Number), function(err) {
         assert.ok(!err, 'no err, all is a number');
         assert.end();
     });
 });

 test('isa works well in an async loop', function(assert) {
     async.parallel([
         partal(isa(Number), 1),
         partal(isa(String), "foo"),
         partal(isa(Boolean), false),
         partal(isa(Date), new Date()),
         partal(isa(Array), [1]),
     ], function(err) {
         assert.ok(!err, "no errors");
         assert.end();
     });
 });
