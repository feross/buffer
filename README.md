# @craftzdog/react-native-buffer

#### The buffer module from [node.js](https://nodejs.org/), for React Native.

Simply `require('@craftzdog/react-native-buffer')` or use the `Buffer` global and you will get this module.
It internally uses [react-native-quick-base64](https://github.com/craftzdog/react-native-quick-base64), which is a performant native implementation of base64.

The goal is to provide an API that is 100% identical to
[node's Buffer API](https://nodejs.org/api/buffer.html). Read the
[official docs](https://nodejs.org/api/buffer.html) for the full list of properties,
instance methods, and class methods that are supported.

## install

```bash
npm install @craftzdog/react-native-buffer react-native-quick-base64
cd ios && pod install
```

## usage

The module's API is identical to node's `Buffer` API. Read the
[official docs](https://nodejs.org/api/buffer.html) for the full list of properties,
instance methods, and class methods that are supported.

To depend on this module explicitly, require it like this:

```js
import { Buffer } from "@craftzdog/react-native-buffer";
```

## how does it work?

The Buffer constructor returns instances of `Uint8Array` that have their prototype
changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of `Uint8Array`,
so the returned instances will have all the node `Buffer` methods and the
`Uint8Array` methods. Square bracket notation works as expected -- it returns a
single octet.

The `Uint8Array` prototype remains unmodified.

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
var blob = new Blob([buffer]);
```

Optionally, specify a mimetype:

```js
var blob = new Blob([buffer], { type: "text/html" });
```

### convert arraybuffer to buffer

To convert an `ArrayBuffer` to a `Buffer`, use the `Buffer.from` function. Does not perform a copy, so it's super fast.

```js
var buffer = Buffer.from(arrayBuffer);
```

### convert buffer to arraybuffer

To convert a `Buffer` to an `ArrayBuffer`, use the `.buffer` property (which is present on all `Uint8Array` objects):

```js
var arrayBuffer = buffer.buffer.slice(
  buffer.byteOffset,
  buffer.byteOffset + buffer.byteLength
);
```

Alternatively, use the [`to-arraybuffer`](https://www.npmjs.com/package/to-arraybuffer) module.

## performance

4x faster than base64-js on an iPhone 11 Pro when dealing with base64, thanks to [react-native-quick-base64](https://github.com/craftzdog/react-native-quick-base64).

## credit

This was originally forked from [feross/buffer](https://github.com/feross/buffer).

## Security Policies and Procedures

The `buffer` team and community take all security bugs in `buffer` seriously. Please see our [security policies and procedures](https://github.com/feross/security) document to learn how to report issues.

## license

MIT.
Copyright (C) [Takuya Matsuyama](https://www.craftz.dog/), and other contributors.
Originally forked from an MIT-licensed module by [Feross Aboukhadijeh](http://feross.org) and Romain Beauxis.
