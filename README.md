# buffer [![build](https://img.shields.io/travis/feross/buffer.svg?style=flat)](https://travis-ci.org/feross/buffer) [![npm](https://img.shields.io/npm/v/buffer.svg?style=flat)](https://npmjs.org/package/buffer) [![npm downloads](https://img.shields.io/npm/dm/buffer.svg?style=flat)](https://npmjs.org/package/buffer) [![gittip](https://img.shields.io/gittip/feross.svg?style=flat)](https://www.gittip.com/feross/)

#### The buffer module from [node.js](http://nodejs.org/), for the browser.

[![testling badge](https://ci.testling.com/feross/buffer.png)](https://ci.testling.com/feross/buffer)

With [browserify](http://browserify.org), simply `require('buffer')` or use the `Buffer` global and you will get this module.

The goal is to provide an API that is 100% identical to
[node's Buffer API](http://nodejs.org/api/buffer.html). Read the
[official docs](http://nodejs.org/api/buffer.html) for the full list of properties,
instance methods, and class methods that are supported.

## features

- Manipulate binary data like a boss, in all browsers -- even IE6!
- Super fast. Backed by Typed Arrays (`Uint8Array`/`ArrayBuffer`, not `Object`)
- Extremely small bundle size (**5.04KB minified + gzipped**, 35.5KB with comments)
- Excellent browser support (IE 6+, Chrome 4+, Firefox 3+, Safari 5.1+, Opera 11+, iOS, etc.)
- Preserves Node API exactly, with one important difference (see below)
- `.slice()` returns instances of the same type (Buffer)
- Square-bracket `buf[4]` notation works, even in old browsers like IE6!
- Does not modify any browser prototypes or put anything on `window`
- Comprehensive test suite


## install

To use this module directly (without browserify), install it:

```bash
npm install buffer
```

This module was previously called **native-buffer-browserify**, but please use **buffer**
from now on.


## usage

The module's API is identical to node's `Buffer` API. Read the
[official docs](http://nodejs.org/api/buffer.html) for the full list of properties,
instance methods, and class methods that are supported.

As mentioned above, `require('buffer')` or use the `Buffer` global with
[browserify](http://browserify.org) and this module will automatically be included
in your bundle. Almost any npm module will work in the browser, even if it assumes that
the node `Buffer` API will be available.

To depend on this module explicitly (without browserify), require it like this:

```js
var Buffer = require('buffer/').Buffer  // note: the trailing slash is important!
```

To require this module explicitly, use `require('buffer/')` which tells the node.js module
lookup algorithm (also used by browserify) to use the **npm module** named `buffer`
instead of the **node.js core** module named `buffer`!


## how does it work?

The `Buffer` constructor returns instances of `Uint8Array` that are augmented with function properties for all the `Buffer` API functions. We use `Uint8Array` so that square bracket notation works as expected -- it returns a single octet. By augmenting the instances, we can avoid modifying the `Uint8Array` prototype.


## differences

#### IMPORTANT: always use `Buffer.isBuffer` instead of `instanceof Buffer`

The Buffer constructor returns a `Uint8Array` (with all the Buffer methods added as
properties on the instance) for performance reasons, so `instanceof Buffer` won't work. In
node, you can use either `Buffer.isBuffer` or `instanceof Buffer` to check if an object
is a `Buffer`. But, in the browser you must use `Buffer.isBuffer` to detect the special
`Uint8Array`-based Buffers.

#### Minor: `buf.slice()` does not modify parent buffer's memory in old browsers

If you only support modern browsers (specifically, those with typed array support), then
this issue does not affect you.

In node, the `slice()` method returns a new `Buffer` that shares underlying memory with
the original Buffer. When you modify one buffer, you modify the other. [Read more.](http://nodejs.org/api/buffer.html#buffer_buf_slice_start_end)

This works correctly in browsers with typed array support (\* with the exception of Firefox older than version 30). Browsers that lack typed arrays get an alternate buffer implementation based on `Object` which has no mechanism to point separate `Buffer`s to the same underlying slab of memory.

\* *Firefox older than version 30 gets the `Object` implementation -- not the typed arrays one -- because of [this
bug](https://bugzilla.mozilla.org/show_bug.cgi?id=952403) (now fixed!) that made it impossible to add properties to a typed array.*


## tracking the latest node api

This module tracks the Buffer API in the latest (unstable) version of node.js. The Buffer
API is considered **stable** in the
[node stability index](http://nodejs.org/docs/latest/api/documentation.html#documentation_stability_index),
so it is unlikely that there will ever be breaking changes.
Nonetheless, when/if the Buffer API changes in node, this module's API will change
accordingly.

## performance

See perf tests in `/perf`.

```
# Chrome 33

NewBuffer#bracket-notation x 11,194,815 ops/sec ±1.73% (64 runs sampled)
OldBuffer#bracket-notation x 9,546,694 ops/sec ±0.76% (67 runs sampled)
Fastest is NewBuffer#bracket-notation

NewBuffer#concat x 949,714 ops/sec ±2.48% (63 runs sampled)
OldBuffer#concat x 634,906 ops/sec ±0.42% (68 runs sampled)
Fastest is NewBuffer#concat

NewBuffer#copy x 15,436,458 ops/sec ±1.74% (67 runs sampled)
OldBuffer#copy x 3,990,346 ops/sec ±0.42% (68 runs sampled)
Fastest is NewBuffer#copy

NewBuffer#readDoubleBE x 1,132,954 ops/sec ±2.36% (65 runs sampled)
OldBuffer#readDoubleBE x 846,337 ops/sec ±0.58% (68 runs sampled)
Fastest is NewBuffer#readDoubleBE

NewBuffer#new x 1,419,300 ops/sec ±3.50% (66 runs sampled)
Uint8Array#new x 3,898,573 ops/sec ±0.88% (67 runs sampled) (used internally by NewBuffer)
OldBuffer#new x 2,284,568 ops/sec ±0.57% (67 runs sampled)
Fastest is Uint8Array#new

NewBuffer#readFloatBE x 1,203,763 ops/sec ±1.81% (68 runs sampled)
OldBuffer#readFloatBE x 954,923 ops/sec ±0.66% (70 runs sampled)
Fastest is NewBuffer#readFloatBE

NewBuffer#readUInt32LE x 750,341 ops/sec ±1.70% (66 runs sampled)
OldBuffer#readUInt32LE x 1,408,478 ops/sec ±0.60% (68 runs sampled)
Fastest is OldBuffer#readUInt32LE

NewBuffer#slice x 1,802,870 ops/sec ±1.87% (64 runs sampled)
OldBuffer#slice x 1,725,928 ops/sec ±0.74% (68 runs sampled)
Fastest is NewBuffer#slice

NewBuffer#writeFloatBE x 830,407 ops/sec ±3.09% (66 runs sampled)
OldBuffer#writeFloatBE x 508,446 ops/sec ±0.49% (69 runs sampled)
Fastest is NewBuffer#writeFloatBE

# Node 0.11.14

BrowserBuffer#bracket-notation x 10,489,828 ops/sec ±3.25% (90 runs sampled)
Uint8Array#bracket-notation x 10,534,884 ops/sec ±0.81% (92 runs sampled)
NodeBuffer#bracket-notation x 10,389,910 ops/sec ±0.97% (87 runs sampled)
Fastest is Uint8Array#bracket-notation,BrowserBuffer#bracket-notation

BrowserBuffer#concat x 487,830 ops/sec ±2.58% (88 runs sampled)
Uint8Array#concat x 1,814,327 ops/sec ±1.28% (88 runs sampled)
NodeBuffer#concat x 1,636,523 ops/sec ±1.88% (73 runs sampled)
Fastest is Uint8Array#concat

BrowserBuffer#copy(16000) x 1,073,665 ops/sec ±0.77% (90 runs sampled)
Uint8Array#copy(16000) x 1,348,517 ops/sec ±0.84% (89 runs sampled)
NodeBuffer#copy(16000) x 1,289,533 ops/sec ±0.82% (93 runs sampled)
Fastest is Uint8Array#copy(16000)

BrowserBuffer#copy(16) x 12,782,706 ops/sec ±0.74% (85 runs sampled)
Uint8Array#copy(16) x 14,180,427 ops/sec ±0.93% (92 runs sampled)
NodeBuffer#copy(16) x 11,083,134 ops/sec ±1.06% (89 runs sampled)
Fastest is Uint8Array#copy(16)

BrowserBuffer#new(16000) x 141,678 ops/sec ±3.30% (67 runs sampled)
Uint8Array#new(16000) x 161,491 ops/sec ±2.96% (60 runs sampled)
NodeBuffer#new(16000) x 292,699 ops/sec ±3.20% (55 runs sampled)
Fastest is NodeBuffer#new(16000)

BrowserBuffer#new(16) x 1,655,466 ops/sec ±2.41% (82 runs sampled)
Uint8Array#new(16) x 14,399,926 ops/sec ±0.91% (94 runs sampled)
NodeBuffer#new(16) x 3,894,696 ops/sec ±0.88% (92 runs sampled)
Fastest is Uint8Array#new(16)

BrowserBuffer#readDoubleBE x 109,582 ops/sec ±0.75% (93 runs sampled)
DataView#getFloat64 x 91,235 ops/sec ±0.81% (90 runs sampled)
NodeBuffer#readDoubleBE x 88,593 ops/sec ±0.96% (81 runs sampled)
Fastest is BrowserBuffer#readDoubleBE

BrowserBuffer#readFloatBE x 139,854 ops/sec ±1.03% (85 runs sampled)
DataView#getFloat32 x 98,744 ops/sec ±0.80% (89 runs sampled)
NodeBuffer#readFloatBE x 92,769 ops/sec ±0.94% (93 runs sampled)
Fastest is BrowserBuffer#readFloatBE

BrowserBuffer#readUInt32LE x 710,861 ops/sec ±0.82% (92 runs sampled)
DataView#getUint32 x 117,893 ops/sec ±0.84% (91 runs sampled)
NodeBuffer#readUInt32LE x 851,412 ops/sec ±0.72% (93 runs sampled)
Fastest is NodeBuffer#readUInt32LE

BrowserBuffer#slice x 1,673,877 ops/sec ±0.73% (94 runs sampled)
Uint8Array#subarray x 6,919,243 ops/sec ±0.67% (90 runs sampled)
NodeBuffer#slice x 4,617,604 ops/sec ±0.79% (93 runs sampled)
Fastest is Uint8Array#subarray

BrowserBuffer#writeFloatBE x 66,011 ops/sec ±0.75% (93 runs sampled)
DataView#setFloat32 x 127,760 ops/sec ±0.72% (93 runs sampled)
NodeBuffer#writeFloatBE x 103,352 ops/sec ±0.83% (93 runs sampled)
Fastest is DataView#setFloat32
```


## credit

This was originally forked from [buffer-browserify](https://github.com/toots/buffer-browserify).


## license

MIT. Copyright (C) [Feross Aboukhadijeh](http://feross.org), and other contributors. Originally forked from an MIT-licensed module by Romain Beauxis.
