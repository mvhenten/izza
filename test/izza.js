'use strict';

var test = require('tape'),
    isa = require('../index').isa;

function withFixtures(cat, run) {
    fixtures.forEach(function(fixed) {
        fixed[cat].forEach(function(val) {
            run(fixed, val);
        });
    });
}

test('When value is of correct type, isa should return true', function(assert) {
    withFixtures('ok', function(fixed, val) {
        try {
            isa(fixed.type, val);
            assert.pass('The thing isa ' + fixed.name);
        }
        catch (err) {
            assert.fail(err);
        }
    });

    assert.end();
});

test('When value is not of correct type, isa should throw', function(assert) {
    withFixtures('fail', function(fixed, val) {
        assert.throws(function() {
            isa(fixed.type, val);
        }, /is not a/);
    });

    assert.end();
});

test('When type is a RegExp, isa should check against it', function(assert) {

    assert.ok(isa(/\d+/, 100), 'Matches /\d+/');

    assert.ok(isa(new RegExp('\\d+'), 100), 'Matches /\d+/');

    assert.throws(function() {
        isa(/\d+/, 'abc');
    }, /TypeError: "abc" is not a value matching "\/\\d+/);

    assert.end();
});


test('When type is a Named Function, isa should run it as check', function(assert) {
    function PositiveInt(value) {
        return /\d+/.test(value);
    }

    assert.ok(isa(PositiveInt, 100), 'Value matches "PositiveInt"');

    assert.throws(function() {
        isa(PositiveInt, 'abc');
    }, /TypeError: "abc" is not a "PositiveInt"/);

    assert.end();
});

test('When type is a constructor, isa should check for instanceof', function(assert) {
    function Point() {};

    Point.prototype.test = 1;

    function Dot() {};

    var p = new Point();

    assert.ok(isa(Point, p), 'Value is an instanceof "Point"');

    assert.throws(function() {
        isa(Dot, p);
    }, /TypeError: .+is not a "Dot", it is a "Point"/);


    assert.end();
});

test('Throws with nice errors', function(assert) {

    assert.throws(function() {
        isa(String, 1);
    }, /TypeError: "1" is not a "String", it is a "Number"/);

    assert.throws(function() {
        isa(String, []);
    }, /TypeError: "" is not a "String", it is a "Array"/);

    assert.throws(function() {
        isa(Array, 1);
    }, /TypeError: "1" is not an "Array", it is a "Number"/);


    assert.end();
});


test('All builtin types', function(assert) {
    isa(String, 'one');
    isa(Date, new Date());
    isa(Array, []);
    isa(Function, function() {});
    isa(/\d+/, 123);

    assert.throws(function() {
        isa(String, 1);
    }, /TypeError: "1" is not a "String", it is a "Number"/);

    assert.throws(function() {
        isa(Array, 1);
    }, /TypeError: "1" is not an "Array", it is a "Number"/);

    assert.throws(function() {
        isa(/\d+/, 'abc');
    }, /TypeError: "abc" is not a value matching "\/\\d+/);

    assert.end();

});

var fixtures = [{
    type: Boolean,
    name: "Boolean",
    ok: [true, false],
    fail: [new Date(), function() {}, {},
        [], /ok/, new RegExp('ok'), [1, 2, 3], new Array(10), 1, 1e10, -999, 'foobar'
    ]
}, {
    type: Number,
    name: 'Number',
    ok: [1, 1e10, -999],
    fail: [new Date(), function() {}, {},
        [], /ok/, new RegExp('ok'), [1, 2, 3], new Array(10), true, false, 'foobar'
    ]
}, {
    type: String,
    name: "String",
    ok: ['foobar'],
    fail: [new Date(), function() {}, {},
        [], /ok/, new RegExp('ok'), [1, 2, 3], new Array(10), 1, 1e10, -999, true, false
    ]
}, {
    type: RegExp,
    name: "RegExp",
    ok: [/ok/, new RegExp('ok')],
    fail: [new Date(), function() {}, {},
        [],
        [1, 2, 3], new Array(10), 1, 1e10, -999, true, false, 'foobar'
    ]
}, {
    type: Array,
    name: "Array",
    ok: [
        [1, 2, 3], new Array(10)
    ],
    fail: [new Date(), function() {}, {}, /ok/, new RegExp('ok'), 1, 1e10, -999, true, false, 'foobar']
}, {
    type: Object,
    name: "Object",
    ok: [{},
        [],
        function() {},
        new Date(), /ok/, new RegExp('ok')
    ],
    fail: [1, 1e10, -999, true, false]
}, {
    type: Date,
    name: "Date",
    ok: [new Date()],
    fail: [function() {}, {},
        [], /ok/, new RegExp('ok'), [1, 2, 3], new Array(10), 1, 1e10, -999, true, false, 'foobar'
    ]
}, {
    type: Function,
    name: "Function",
    ok: [function() {}],
    fail: [new Date(), {},
        [], /ok/, new RegExp('ok'), [1, 2, 3], new Array(10), 1, 1e10, -999, true, false, 'foobar'
    ]
}];
