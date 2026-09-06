# buffer [![ci][ci-image]][ci-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url] [![javascript style guide][standard-image]][standard-url]

[ci-image]: https://img.shields.io/github/workflow/status/feross/buffer/ci/master
[ci-url]: https://github.com/feross/buffer/actions
[npm-image]: https://img.shields.io/npm/v/buffer.svg
[npm-url]: https://npmjs.org/package/buffer
[downloads-image]: https://img.shields.io/npm/dm/buffer.svg
[downloads-url]: https://npmjs.org/package/buffer
[standard-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[standard-url]: https://standardjs.com

#### The buffer module from [node.js](https://nodejs.org), for the browser.

[![saucelabs][saucelabs-image]][saucelabs-url]

[saucelabs-image]: https://saucelabs.com/browser-matrix/buffer.svg
[saucelabs-url]: https://saucelabs.com/u/buffer

With [browserify](http://browserify.org), simply `require('buffer')` or use the `Buffer` global and you will get this module.

The goal is to provide an API that is 100% identical to
[node's Buffer API](https://nodejs.org/api/buffer.html). Read the
[official docs](https://nodejs.org/api/buffer.html) for the full list of properties,
instance methods, and class methods that are supported.

## features

- Manipulate binary data like a boss, in all browsers!
- Super fast. Backed by Typed Arrays (`Uint8Array`/`ArrayBuffer`, not `Object`)
- Extremely small bundle size (**6.75KB minified + gzipped**, 51.9KB with comments)
- Excellent browser support (Chrome, Firefox, Edge, Safari 11+, iOS 11+, Android, etc.)
- Preserves Node API exactly
- Square-bracket `buf[4]` notation works!
- Does not modify any browser prototypes or put anything on `window`
- Comprehensive test suite (including all buffer tests from node.js core)

## install

To use this module directly (without browserify), install it:

```bash
npm install buffer
```

This module was previously called **native-buffer-browserify**, but please use **buffer**
from now on.

If you do not use a bundler, you can use the [standalone script](https://bundle.run/buffer).

## usage

The module's API is identical to node's `Buffer` API. Read the
[official docs](https://nodejs.org/api/buffer.html) for the full list of properties,
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

The Buffer constructor returns instances of `Uint8Array` that have their prototype
changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of `Uint8Array`,
so the returned instances will have all the node `Buffer` methods and the
`Uint8Array` methods. Square bracket notation works as expected -- it returns a
single octet.

The `Uint8Array` prototype remains unmodified.


## tracking the latest node api

This module tracks the Buffer API in the latest (unstable) version of node.js. The Buffer
API is considered **stable** in the
[node stability index](https://nodejs.org/docs/latest/api/documentation.html#documentation_stability_index),
so it is unlikely that there will ever be breaking changes.
Nonetheless, when/if the Buffer API changes in node, this module's API will change
accordingly.

## related packages

- [`buffer-reverse`](https://www.npmjs.com/package/buffer-reverse) - Reverse a buffer
- [`buffer-xor`](https://www.npmjs.com/package/buffer-xor) - Bitwise xor a buffer
- [`is-buffer`](https://www.npmjs.com/package/is-buffer) - Determine if an object is a Buffer without including the whole `Buffer` package

## conversion packages

### convert typed array to buffer

Use [`typedarray-to-buffer`](https://www.npmjs.com/package/typedarray-to-buffer) to convert any kind of typed array to a `Buffer`. Does not perform a copy, so it's super fast.

### convert buffer to typed array

`Buffer` is a subclass of `Uint8Array` (which is a typed array). So there is no need to explicitly convert to typed array. Just use the buffer as a `Uint8Array`.

### convert blob to buffer

Use [`blob-to-buffer`](https://www.npmjs.com/package/blob-to-buffer) to convert a `Blob` to a `Buffer`.

### convert buffer to blob

To convert a `Buffer` to a `Blob`, use the `Blob` constructor:

```js
var blob = new Blob([ buffer ])
```

Optionally, specify a mimetype:

```js
var blob = new Blob([ buffer ], { type: 'text/html' })
```

### convert arraybuffer to buffer

To convert an `ArrayBuffer` to a `Buffer`, use the `Buffer.from` function. Does not perform a copy, so it's super fast.

```js
var buffer = Buffer.from(arrayBuffer)
```

### convert buffer to arraybuffer

To convert a `Buffer` to an `ArrayBuffer`, use the `.buffer` property (which is present on all `Uint8Array` objects):

```js
var arrayBuffer = buffer.buffer.slice(
  buffer.byteOffset, buffer.byteOffset + buffer.byteLength
)
```

Alternatively, use the [`to-arraybuffer`](https://www.npmjs.com/package/to-arraybuffer) module.

## performance

See perf tests in `/perf`.

`BrowserBuffer` is the browser `buffer` module (this repo). `Uint8Array` is included as an
additional check (since `BrowserBuffer` uses `Uint8Array` under the hood, `Uint8Array` will
always be at least a bit faster). Finally, `NodeBuffer` is the node.js buffer module,
which is included to compare against.

NOTE: Performance has improved since these benchmarks were taken. PR welcome to update the README.

### Chrome 38

| Method | Operations | Accuracy | Sampled | Fastest |
|:-------|:-----------|:---------|:--------|:-------:|
| BrowserBuffer#bracket-notation | 11,457,464 ops/sec | ±0.86% | 66 | ✓ |
| Uint8Array#bracket-notation | 10,824,332 ops/sec | ±0.74% | 65 | |
| | | | |
| BrowserBuffer#concat | 450,532 ops/sec | ±0.76% | 68 | |
| Uint8Array#concat | 1,368,911 ops/sec | ±1.50% | 62 | ✓ |
| | | | |
| BrowserBuffer#copy(16000) | 903,001 ops/sec | ±0.96% | 67 | |
| Uint8Array#copy(16000) | 1,422,441 ops/sec | ±1.04% | 66 | ✓ |
| | | | |
| BrowserBuffer#copy(16) | 11,431,358 ops/sec | ±0.46% | 69 | |
| Uint8Array#copy(16) | 13,944,163 ops/sec | ±1.12% | 68 | ✓ |
| | | | |
| BrowserBuffer#new(16000) | 106,329 ops/sec | ±6.70% | 44 | |
| Uint8Array#new(16000) | 131,001 ops/sec | ±2.85% | 31 | ✓ |
| | | | |
| BrowserBuffer#new(16) | 1,554,491 ops/sec | ±1.60% | 65 | |
| Uint8Array#new(16) | 6,623,930 ops/sec | ±1.66% | 65 | ✓ |
| | | | |
| BrowserBuffer#readDoubleBE | 112,830 ops/sec | ±0.51% | 69 | ✓ |
| DataView#getFloat64 | 93,500 ops/sec | ±0.57% | 68 | |
| | | | |
| BrowserBuffer#readFloatBE | 146,678 ops/sec | ±0.95% | 68 | ✓ |
| DataView#getFloat32 | 99,311 ops/sec | ±0.41% | 67 | |
| | | | |
| BrowserBuffer#readUInt32LE | 843,214 ops/sec | ±0.70% | 69 | ✓ |
| DataView#getUint32 | 103,024 ops/sec | ±0.64% | 67 | |
| | | | |
| BrowserBuffer#slice | 1,013,941 ops/sec | ±0.75% | 67 | |
| Uint8Array#subarray | 1,903,928 ops/sec | ±0.53% | 67 | ✓ |
| | | | |
| BrowserBuffer#writeFloatBE | 61,387 ops/sec | ±0.90% | 67 | |
| DataView#setFloat32 | 141,249 ops/sec | ±0.40% | 66 | ✓ |


### Firefox 33

| Method | Operations | Accuracy | Sampled | Fastest |
|:-------|:-----------|:---------|:--------|:-------:|
| BrowserBuffer#bracket-notation | 20,800,421 ops/sec | ±1.84% | 60 | |
| Uint8Array#bracket-notation | 20,826,235 ops/sec | ±2.02% | 61 | ✓ |
| | | | |
| BrowserBuffer#concat | 153,076 ops/sec | ±2.32% | 61 | |
| Uint8Array#concat | 1,255,674 ops/sec | ±8.65% | 52 | ✓ |
| | | | |
| BrowserBuffer#copy(16000) | 1,105,312 ops/sec | ±1.16% | 63 | |
| Uint8Array#copy(16000) | 1,615,911 ops/sec | ±0.55% | 66 | ✓ |
| | | | |
| BrowserBuffer#copy(16) | 16,357,599 ops/sec | ±0.73% | 68 | |
| Uint8Array#copy(16) | 31,436,281 ops/sec | ±1.05% | 68 | ✓ |
| | | | |
| BrowserBuffer#new(16000) | 52,995 ops/sec | ±6.01% | 35 | |
| Uint8Array#new(16000) | 87,686 ops/sec | ±5.68% | 45 | ✓ |
| | | | |
| BrowserBuffer#new(16) | 252,031 ops/sec | ±1.61% | 66 | |
| Uint8Array#new(16) | 8,477,026 ops/sec | ±0.49% | 68 | ✓ |
| | | | |
| BrowserBuffer#readDoubleBE | 99,871 ops/sec | ±0.41% | 69 | |
| DataView#getFloat64 | 285,663 ops/sec | ±0.70% | 68 | ✓ |
| | | | |
| BrowserBuffer#readFloatBE | 115,540 ops/sec | ±0.42% | 69 | |
| DataView#getFloat32 | 288,722 ops/sec | ±0.82% | 68 | ✓ |
| | | | |
| BrowserBuffer#readUInt32LE | 633,926 ops/sec | ±1.08% | 67 | ✓ |
| DataView#getUint32 | 294,808 ops/sec | ±0.79% | 64 | |
| | | | |
| BrowserBuffer#slice | 349,425 ops/sec | ±0.46% | 69 | |
| Uint8Array#subarray | 5,965,819 ops/sec | ±0.60% | 65 | ✓ |
| | | | |
| BrowserBuffer#writeFloatBE | 59,980 ops/sec | ±0.41% | 67 | |
| DataView#setFloat32 | 317,634 ops/sec | ±0.63% | 68 | ✓ |

### Safari 8

| Method | Operations | Accuracy | Sampled | Fastest |
|:-------|:-----------|:---------|:--------|:-------:|
| BrowserBuffer#bracket-notation | 10,279,729 ops/sec | ±2.25% | 56 | ✓ |
| Uint8Array#bracket-notation | 10,030,767 ops/sec | ±2.23% | 59 | |
| | | | |
| BrowserBuffer#concat | 144,138 ops/sec | ±1.38% | 65 | |
| Uint8Array#concat | 4,950,764 ops/sec | ±1.70% | 63 | ✓ |
| | | | |
| BrowserBuffer#copy(16000) | 1,058,548 ops/sec | ±1.51% | 64 | |
| Uint8Array#copy(16000) | 1,409,666 ops/sec | ±1.17% | 65 | ✓ |
| | | | |
| BrowserBuffer#copy(16) | 6,282,529 ops/sec | ±1.88% | 58 | |
| Uint8Array#copy(16) | 11,907,128 ops/sec | ±2.87% | 58 | ✓ |
| | | | |
| BrowserBuffer#new(16000) | 101,663 ops/sec | ±3.89% | 57 | |
| Uint8Array#new(16000) | 22,050,818 ops/sec | ±6.51% | 46 | ✓ |
| | | | |
| BrowserBuffer#new(16) | 176,072 ops/sec | ±2.13% | 64 | |
| Uint8Array#new(16) | 24,385,731 ops/sec | ±5.01% | 51 | ✓ |
| | | | |
| BrowserBuffer#readDoubleBE | 41,341 ops/sec | ±1.06% | 67 | |
| DataView#getFloat64 | 322,280 ops/sec | ±0.84% | 68 | ✓ |
| | | | |
| BrowserBuffer#readFloatBE | 46,141 ops/sec | ±1.06% | 65 | |
| DataView#getFloat32 | 337,025 ops/sec | ±0.43% | 69 | ✓ |
| | | | |
| BrowserBuffer#readUInt32LE | 151,551 ops/sec | ±1.02% | 66 | |
| DataView#getUint32 | 308,278 ops/sec | ±0.94% | 67 | ✓ |
| | | | |
| BrowserBuffer#slice | 197,365 ops/sec | ±0.95% | 66 | |
| Uint8Array#subarray | 9,558,024 ops/sec | ±3.08% | 58 | ✓ |
| | | | |
| BrowserBuffer#writeFloatBE | 17,518 ops/sec | ±1.03% | 63 | |
| DataView#setFloat32 | 319,751 ops/sec | ±0.48% | 68 | ✓ |


### Node 0.11.14

| Method | Operations | Accuracy | Sampled | Fastest |
|:-------|:-----------|:---------|:--------|:-------:|
| BrowserBuffer#bracket-notation | 10,489,828 ops/sec | ±3.25% | 90 | |
| Uint8Array#bracket-notation | 10,534,884 ops/sec | ±0.81% | 92 | ✓ |
| NodeBuffer#bracket-notation | 10,389,910 ops/sec | ±0.97% | 87 | |
| | | | |
| BrowserBuffer#concat | 487,830 ops/sec | ±2.58% | 88 | |
| Uint8Array#concat | 1,814,327 ops/sec | ±1.28% | 88 | ✓ |
| NodeBuffer#concat | 1,636,523 ops/sec | ±1.88% | 73 | |
| | | | |
| BrowserBuffer#copy(16000) | 1,073,665 ops/sec | ±0.77% | 90 | |
| Uint8Array#copy(16000) | 1,348,517 ops/sec | ±0.84% | 89 | ✓ |
| NodeBuffer#copy(16000) | 1,289,533 ops/sec | ±0.82% | 93 | |
| | | | |
| BrowserBuffer#copy(16) | 12,782,706 ops/sec | ±0.74% | 85 | |
| Uint8Array#copy(16) | 14,180,427 ops/sec | ±0.93% | 92 | ✓ |
| NodeBuffer#copy(16) | 11,083,134 ops/sec | ±1.06% | 89 | |
| | | | |
| BrowserBuffer#new(16000) | 141,678 ops/sec | ±3.30% | 67 | |
| Uint8Array#new(16000) | 161,491 ops/sec | ±2.96% | 60 | |
| NodeBuffer#new(16000) | 292,699 ops/sec | ±3.20% | 55 | ✓ |
| | | | |
| BrowserBuffer#new(16) | 1,655,466 ops/sec | ±2.41% | 82 | |
| Uint8Array#new(16) | 14,399,926 ops/sec | ±0.91% | 94 | ✓ |
| NodeBuffer#new(16) | 3,894,696 ops/sec | ±0.88% | 92 | |
| | | | |
| BrowserBuffer#readDoubleBE | 109,582 ops/sec | ±0.75% | 93 | ✓ |
| DataView#getFloat64 | 91,235 ops/sec | ±0.81% | 90 | |
| NodeBuffer#readDoubleBE | 88,593 ops/sec | ±0.96% | 81 | |
| | | | |
| BrowserBuffer#readFloatBE | 139,854 ops/sec | ±1.03% | 85 | ✓ |
| DataView#getFloat32 | 98,744 ops/sec | ±0.80% | 89 | |
| NodeBuffer#readFloatBE | 92,769 ops/sec | ±0.94% | 93 | |
| | | | |
| BrowserBuffer#readUInt32LE | 710,861 ops/sec | ±0.82% | 92 | |
| DataView#getUint32 | 117,893 ops/sec | ±0.84% | 91 | |
| NodeBuffer#readUInt32LE | 851,412 ops/sec | ±0.72% | 93 | ✓ |
| | | | |
| BrowserBuffer#slice | 1,673,877 ops/sec | ±0.73% | 94 | |
| Uint8Array#subarray | 6,919,243 ops/sec | ±0.67% | 90 | ✓ |
| NodeBuffer#slice | 4,617,604 ops/sec | ±0.79% | 93 | |
| | | | |
| BrowserBuffer#writeFloatBE | 66,011 ops/sec | ±0.75% | 93 | |
| DataView#setFloat32 | 127,760 ops/sec | ±0.72% | 93 | ✓ |
| NodeBuffer#writeFloatBE | 103,352 ops/sec | ±0.83% | 93 | |

### iojs 1.8.1

| Method | Operations | Accuracy | Sampled | Fastest |
|:-------|:-----------|:---------|:--------|:-------:|
| BrowserBuffer#bracket-notation | 10,990,488 ops/sec | ±1.11% | 91 | |
| Uint8Array#bracket-notation | 11,268,757 ops/sec | ±0.65% | 97 | |
| NodeBuffer#bracket-notation | 11,353,260 ops/sec | ±0.83% | 94 | ✓ |
| | | | |
| BrowserBuffer#concat | 378,954 ops/sec | ±0.74% | 94 | |
| Uint8Array#concat | 1,358,288 ops/sec | ±0.97% | 87 | |
| NodeBuffer#concat | 1,934,050 ops/sec | ±1.11% | 78 | ✓ |
| | | | |
| BrowserBuffer#copy(16000) | 894,538 ops/sec | ±0.56% | 84 | |
| Uint8Array#copy(16000) | 1,442,656 ops/sec | ±0.71% | 96 | |
| NodeBuffer#copy(16000) | 1,457,898 ops/sec | ±0.53% | 92 | ✓ |
| | | | |
| BrowserBuffer#copy(16) | 12,870,457 ops/sec | ±0.67% | 95 | |
| Uint8Array#copy(16) | 16,643,989 ops/sec | ±0.61% | 93 | ✓ |
| NodeBuffer#copy(16) | 14,885,848 ops/sec | ±0.74% | 94 | |
| | | | |
| BrowserBuffer#new(16000) | 109,264 ops/sec | ±4.21% | 63 | |
| Uint8Array#new(16000) | 138,916 ops/sec | ±1.87% | 61 | |
| NodeBuffer#new(16000) | 281,449 ops/sec | ±3.58% | 51 | ✓ |
| | | | |
| BrowserBuffer#new(16) | 1,362,935 ops/sec | ±0.56% | 99 | |
| Uint8Array#new(16) | 6,193,090 ops/sec | ±0.64% | 95 | ✓ |
| NodeBuffer#new(16) | 4,745,425 ops/sec | ±1.56% | 90 | |
| | | | |
| BrowserBuffer#readDoubleBE | 118,127 ops/sec | ±0.59% | 93 | ✓ |
| DataView#getFloat64 | 107,332 ops/sec | ±0.65% | 91 | |
| NodeBuffer#readDoubleBE | 116,274 ops/sec | ±0.94% | 95 | |
| | | | |
| BrowserBuffer#readFloatBE | 150,326 ops/sec | ±0.58% | 95 | ✓ |
| DataView#getFloat32 | 110,541 ops/sec | ±0.57% | 98 | |
| NodeBuffer#readFloatBE | 121,599 ops/sec | ±0.60% | 87 | |
| | | | |
| BrowserBuffer#readUInt32LE | 814,147 ops/sec | ±0.62% | 93 | |
| DataView#getUint32 | 137,592 ops/sec | ±0.64% | 90 | |
| NodeBuffer#readUInt32LE | 931,650 ops/sec | ±0.71% | 96 | ✓ |
| | | | |
| BrowserBuffer#slice | 878,590 ops/sec | ±0.68% | 93 | |
| Uint8Array#subarray | 2,843,308 ops/sec | ±1.02% | 90 | |
| NodeBuffer#slice | 4,998,316 ops/sec | ±0.68% | 90 | ✓ |
| | | | |
| BrowserBuffer#writeFloatBE | 65,927 ops/sec | ±0.74% | 93 | |
| DataView#setFloat32 | 139,823 ops/sec | ±0.97% | 89 | ✓ |
| NodeBuffer#writeFloatBE | 135,763 ops/sec | ±0.65% | 96 | |
| | | | |

## Testing the project

First, install the project:

    npm install

Then, to run tests in Node.js, run:

    npm run test-node

To test locally in a browser, you can run:

    npm run test-browser-old-local # For ES5 browsers that don't support ES6
    npm run test-browser-new-local # For ES6 compliant browsers

This will print out a URL that you can then open in a browser to run the tests, using [airtap](https://www.npmjs.com/package/airtap).

To run automated browser tests using Saucelabs, ensure that your `SAUCE_USERNAME` and `SAUCE_ACCESS_KEY` environment variables are set, then run:

    npm test

This is what's run in Travis, to check against various browsers. The list of browsers is kept in the `bin/airtap-es5.yml` and `bin/airtap-es6.yml` files.

## JavaScript Standard Style

This module uses [JavaScript Standard Style](https://github.com/feross/standard).

[![JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

To test that the code conforms to the style, `npm install` and run:

    ./node_modules/.bin/standard

## credit

This was originally forked from [buffer-browserify](https://github.com/toots/buffer-browserify).

## Security Policies and Procedures

The `buffer` team and community take all security bugs in `buffer` seriously. Please see our [security policies and procedures](https://github.com/feross/security) document to learn how to report issues.

## license

MIT. Copyright (C) [Feross Aboukhadijeh](http://feross.org), and other contributors. Originally forked from an MIT-licensed module by Romain Beauxis.


## 🌐 Web Resources & Interactive Index
- [BFFS Y2K FASHION](https://learnquester.pages.dev/bffs-y2k-fashion.html)
- [HUGGY WUGGY GUESS THE RIGHT DOOR](https://learnquesters.pages.dev/huggy-wuggy-guess-the-right-door.html)
- [HERO MATCH](https://thequizzone.pages.dev/hero-match.html)
- [DRAW WAR](https://iskillquest.pages.dev/draw-war.html)
- [HAPPY COLOR](https://learnquesters.pages.dev/happy-color.html)
- [CATEGORY CARTOON76](https://themindzone.pages.dev/category-cartoon76.html)
- [DYNAMONS 11](https://learnquester.github.io/dynamons-11.html)
- [CELEBRITY FACE DANCE](https://iskillquest.pages.dev/celebrity-face-dance.html)
- [BUTTERFLY KYODAI DELUXE 2](https://thequizzone.pages.dev/butterfly-kyodai-deluxe-2.html)
- [CATEGORY IDLE](https://thelearnquesters.pages.dev/category-idle.html)
- [CATEGORY UNBLOCKED WEBSITES](https://learnquester.pages.dev/category-unblocked-websites.html)
- [CATEGORY FLASH](https://thequizzone.pages.dev/category-flash.html)
- [CAKE MERGE](https://thequizzone.pages.dev/cake-merge.html)
- [CATEGORY THINKY 3](https://themindplay.pages.dev/category-thinky-3.html)
- [LOVE ARCHER](https://iskillquest.pages.dev/love-archer.html)
- [DROP BRICKS BREAKER](https://themindplay.github.io/drop-bricks-breaker.html)
- [MINICRAFT WINTERBLOCK](https://studyplayings.pages.dev/minicraft-winterblock.html)
- [INDEX7](https://studyplayings.pages.dev/index7.html)
- [FURRY KUNG FU](https://iskillquest.pages.dev/furry-kung-fu.html)
- [STACKTRIS 2048](https://iskillquest.pages.dev/stacktris-2048.html)
- [TOILET ROLL](https://thelearnquesters.pages.dev/toilet-roll.html)
- [CATEGORY PIXEL313](https://studyplayings.pages.dev/category-pixel313.html)
- [UNPUZZLE MASTER](https://studyplayings.web.app/unpuzzle-master.html)
- [BINGO HALLOWEEN](https://learnquester.pages.dev/bingo-halloween.html)
- [CATEGORY MOUSE1 697](https://studyplayings.pages.dev/category-mouse1-697.html)
- [ZOMBIES BATTLE FOR SURVIVAL](https://studyplaying.github.io/zombies-battle-for-survival.html)
- [CATEGORY SPOT THE DIFFERENCE](https://studyplayings.pages.dev/category-spot-the-difference.html)
- [2 PLAYER BATTLE](https://learnquester.pages.dev/2-player-battle.html)
- [LOST IN THE FOREST](https://studyplayings.web.app/lost-in-the-forest.html)
- [JUMPER](https://iskillquest.pages.dev/jumper.html)
- [DOLPHIN DASH](https://thelearnquesters.pages.dev/dolphin-dash.html)
- [BLOCK STACKING](https://thequizzone.pages.dev/block-stacking.html)
- [CONNECT IMAGE](https://iskillquest.pages.dev/connect-image.html)
- [CATEGORY LISTS](https://studyplayings.pages.dev/category-lists.html)
- [CATEGORY MANAGEMENT209](https://studyplayings.pages.dev/category-management209.html)
- [CATEGORY PREMIUM PERKS71](https://studyplayings.pages.dev/category-premium-perks71.html)
- [MEME WARS](https://iskillquest.pages.dev/meme-wars.html)
- [COLORWARSIO](https://thequizzone.pages.dev/colorwarsio.html)
- [CATEGORY MOUSE](https://studyplayings.web.app/category-mouse.html)
- [HUNGRY SNAKE IO](https://themindplay.pages.dev/hungry-snake-io.html)
- [CITY DRIFT RACING](https://thelearnquesters.pages.dev/city-drift-racing.html)
- [BLACK JUMP](https://themindzone.pages.dev/black-jump.html)
- [SUPER KID ADVENTURE](https://studyplayings.web.app/super-kid-adventure.html)
- [MONSTER DUELIST](https://themindplay.pages.dev/monster-duelist.html)
- [CATEGORY MISSION207](https://learnquesters.pages.dev/category-mission207.html)
- [MINETAP](https://thequizzone.pages.dev/minetap.html)
- [INDEX19](https://thequizzone.pages.dev/index19.html)
- [CATEGORY SANDBOX40](https://studyplayings.web.app/category-sandbox40.html)
- [CATEGORY SOLITAIRE](https://learnquesters.pages.dev/category-solitaire.html)
- [BRAWL STARS SOUND](https://themindplay.pages.dev/brawl-stars-sound.html)
- [CATEGORY SURVIVAL](https://iskillquest.pages.dev/category-survival.html)
- [WORMS ZONE](https://studyplayings.web.app/worms-zone.html)
- [BUBBLE SHOOTER TEMPLE JEWELS](https://thelearnquesters.pages.dev/bubble-shooter-temple-jewels.html)
- [CATEGORY HORDE SURVIVAL67](https://thequizzone.pages.dev/category-horde-survival67.html)
- [SORTSTORE](https://themindzone.pages.dev/sortstore.html)
- [GRILL IT ALL](https://thequizzone.pages.dev/grill-it-all.html)
- [YOUTUBER MCRAFT 2PLAYER](https://themindzone.pages.dev/youtuber-mcraft-2player.html)
- [CHAOS ROAD COMBAT CAR RACING](https://themindplay.github.io/chaos-road-combat-car-racing.html)
- [LATUTU HOLIDAY GIFT HUNT](https://themindzone.pages.dev/latutu-holiday-gift-hunt.html)
- [CATEGORY SIMULATION 3](https://themindplays.pages.dev/category-simulation-3.html)
- [WORDMIX](https://studyplayings.web.app/wordmix.html)
- [CATEGORY SNAKE40](https://studyplayings.web.app/category-snake40.html)
- [X TO Y ALMOST IMPOSSIBLE](https://skillplay.github.io/x-to-y-almost-impossible.html)
- [MAZE CRAZE](https://thelearnquesters.pages.dev/maze-craze.html)
- [TANKS](https://themindzone.pages.dev/tanks.html)
- [BLOOM WITHIN A LIFE SIMULATOR](https://iskillquest.pages.dev/bloom-within-a-life-simulator.html)
- [MOSQUITO BITE 3D](https://themindzone.pages.dev/mosquito-bite-3d.html)
- [12 IN 1 SOLITAIRE](https://studyplayings.web.app/12-in-1-solitaire.html)
- [ZOMBIE EEASTER BUNNIES](https://studyplayings.web.app/zombie-eeaster-bunnies.html)
- [ANIME DRESS UP DOLL DRESS UP](https://learnquester.pages.dev/anime-dress-up-doll-dress-up.html)
- [WORDS FROM WORDS](https://quizverses-9d2f2.web.app/words-from-words.html)
- [BRAINROT CLEANING](https://thelearnquesters.pages.dev/brainrot-cleaning.html)
- [MARBLE PUZZLE QUEST](https://iskillplay.web.app/marble-puzzle-quest.html)
- [PRIVACY](https://themindzone.pages.dev/privacy.html)
- [CROWD EVOLUTION](https://thelearnquesters.pages.dev/crowd-evolution.html)
- [STELLAR STYLE SPECTACLE FASHION](https://theskillquest.pages.dev/stellar-style-spectacle-fashion.html)
- [CATEGORY HORROR 2](https://studyquests.github.io/category-horror-2.html)
- [DOTS MASTER](https://studyquests.github.io/dots-master.html)
- [ATOMIC MERGE 2048](https://themindplay.pages.dev/atomic-merge-2048.html)
- [THE FINAL RIDDLE](https://themindskillplayplay.pages.dev/the-final-riddle.html)
- [CATEGORY BLOCK91](https://thequizzone.pages.dev/category-block91.html)
- [MENTAL HOSPITAL ESCAPE](https://thelearnquesters.pages.dev/mental-hospital-escape.html)
- [CATEGORY POOL](https://themindplay.github.io/category-pool.html)
- [FISHING FISHES](https://themindplay.pages.dev/fishing-fishes.html)
- [MOTO X3M DEAD AHEAD](https://studyplayings.web.app/moto-x3m-dead-ahead.html)
- [CATEGORY 1 PLAYER139](https://iskillquest.pages.dev/category-1-player139.html)
- [MERGE SHOOTER](https://thelearnquesters.pages.dev/merge-shooter.html)
- [CATEGORY SCRATCH17](https://studyplayings.web.app/category-scratch17.html)
- [CATEGORY INCREMENTAL](https://themindplays.pages.dev/category-incremental.html)
- [CARDS KLONDIKE SOLITAIRE](https://themindzone.pages.dev/cards-klondike-solitaire.html)
- [HOTEL MANAGER](https://studyplayings.web.app/hotel-manager.html)
- [SNIPER FOR BRAINROT](https://themindzone.pages.dev/sniper-for-brainrot.html)
- [ANIMAL MERGE BUBBLE SHOOTER](https://themindplay.pages.dev/animal-merge-bubble-shooter.html)
- [HAPPY EGG CATCH](https://studyplaying.github.io/happy-egg-catch.html)
- [CRYPTOWORD](https://themindzone.pages.dev/cryptoword.html)
- [CHICKEN BANANA QUEST](https://studyquests.github.io/chicken-banana-quest.html)
- [CLAY CRAFT TYCOON](https://themindzone.pages.dev/clay-craft-tycoon.html)
- [CATEGORY PHYSICS371](https://themindskillplayplay.pages.dev/category-physics371.html)
- [DINOSAUR RAMPAGE](https://studyquests.github.io/dinosaur-rampage.html)
- [TRI PEAKS EMERLAND SOLITAIRE](https://thequizzone.pages.dev/tri-peaks-emerland-solitaire.html)
- [CHRISTMAS FIND THE DIFFERENCES](https://studyplayings.web.app/christmas-find-the-differences.html)
- [MY LITTLE CAR WASH](https://themindzone.pages.dev/my-little-car-wash.html)
- [CATEGORY PUZZLE 2](https://studyplayings.pages.dev/category-puzzle-2.html)
- [CATEGORY CAR376](https://iskillquest.pages.dev/category-car376.html)
- [BRICK MATCH](https://studyplayings.web.app/brick-match.html)
- [CATEGORY TOWER DEFENSE 3](https://themindskillplayplay.pages.dev/category-tower-defense-3.html)
- [IBIZA FOAM PARTY](https://themindzone.pages.dev/ibiza-foam-party.html)
- [CATEGORY PUZZLE 7](https://studyplaying.github.io/category-puzzle-7.html)
- [GARDEN GUARDIANS](https://themindplays.pages.dev/garden-guardians.html)
- [TAILOR STYLIST FASHION DIARY](https://studyplayings.web.app/tailor-stylist-fashion-diary.html)
- [PHRASLE MASTER](https://themindplay.pages.dev/phrasle-master.html)
- [DRAW BRIDGE BRAIN GAME](https://themindskillplayplay.pages.dev/draw-bridge-brain-game.html)
- [COLOR BLOCK JAM](https://themindplay.pages.dev/color-block-jam.html)
- [ARCHER DUNGEON HERO](https://quizverses-9d2f2.web.app/archer-dungeon-hero.html)
- [SPIN SHOT SIEGE](https://iskillplay.web.app/spin-shot-siege.html)
- [CATEGORY MINECRAFT81](https://studyquesthub.web.app/category-minecraft81.html)
- [POPPYTILE](https://themindplay.pages.dev/poppytile.html)
- [WORD SEARCH UNIVERSE](https://skillplay.github.io/word-search-universe.html)
- [CATEGORY INCREMENTAL388](https://studyplayings.pages.dev/category-incremental388.html)
- [TURBO RACE 3D](https://themindplay.pages.dev/turbo-race-3d.html)
- [CATEGORY CASUAL 2](https://quizverses-9d2f2.web.app/category-casual-2.html)
- [DUNK CHALLENGE](https://quizverses-9d2f2.web.app/dunk-challenge.html)
- [SUPER NINJA BALLOON](https://themindskillplayplay.pages.dev/super-ninja-balloon.html)
- [TOP HOG](https://skillplay.github.io/top-hog.html)
- [THE STONE MINER](https://skillplay.github.io/the-stone-miner.html)
- [CATEGORY FLASH 2](https://themindplay.github.io/category-flash-2.html)
- [CATEGORY MOUSE1 707](https://studyplayings.pages.dev/category-mouse1-707.html)
- [CARD QUEST 10 MINUTE ADVENTURE](https://studyplaying.github.io/card-quest-10-minute-adventure.html)
- [CATEGORY MANAGEMENT](https://studyplayings.pages.dev/category-management.html)
- [CONNECT THE DOTS COLOR LINES](https://iskillquest.pages.dev/connect-the-dots-color-lines.html)
