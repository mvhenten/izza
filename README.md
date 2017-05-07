# izza

Yet another typecheck lib.

# Installation

    npm install izza
    
# Usage

While I am aware that there are many alternatives, I wanted something that would 
return a boolean false/true in synchronous mode, and a pretty formatted error when
invoked asynchrounous.

### Simple type checks

```javascript
const isa = require("izza/isa");

assert.ok(isa(Number, 1), "It is a number");
assert.equal(isa(Number, "1"), false, "not a number");
```

### Async type checks

When running in async mode, izza returns a javascript `TypeError` with useful
information about the type being checked:

```javascript
const isa = require("izza/isa");

isa(Number, 1, (err) => {
    assert.ok(!err, "No error was returned, it is a number");
});

isa(Number, "1", (err) => {
   assert.equal(err, new TypeError('"1" is not a "Number", it is a "string"'));
});
```

### Custom type checks

Custom type checks are just functions, that should either return a boolean false
or an `Error`. In all other cases, the result is ignored.

Named functions get mentioned in the error object returned in async mode. 

```javascript
function LikeAnInt(val) {
    return /\d+/.test(val);
}

assert.ok(isa(LikeAnInt, "1"), "it's like an int");

isa(LikeAnInt, "foo", (err) => {
    assert.equal(err, new TypeError('"foo" is not a "LikeAnInt", it is a "string"'));
});

```
## Utilities

#### check(type, value)

Runs a type check, and returns an error object or undefined

#### assert(type, value)

Throws an error if returned by check

#### types

A small utility collection of useful types:

```javascript
const Types = require("izza/types");

const MaybeNumber = Types.Maybe(Number);

izza(MaybeNumber, undefined); // true
isa(MaybeNumber, "not a number") // false

const Options = Types.Enum([1,2,3]);

isa(Options, 1); // true
isa(Options, "1"); // false

const Format = Types.Tuple(Number, String, Object);
assert.ok(isa([1, "some string", {}], Format), 'Typecheck passes');

```



