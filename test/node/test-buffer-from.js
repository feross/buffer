'use strict';
var Buffer = require('../../').Buffer;

const common = require('./common');
const assert = require('assert');
const { deepStrictEqual, throws } = assert;
const { runInNewContext } = require('vm');

const checkString = 'test';

const check = Buffer.from(checkString);

class MyString extends String {
  constructor() {
    super(checkString);
  }
}

class MyPrimitive {
  [Symbol.toPrimitive]() {
    return checkString;
  }
}

class MyBadPrimitive {
  [Symbol.toPrimitive]() {
    return 1;
  }
}

deepStrictEqual(Buffer.from(new String(checkString)), check);
deepStrictEqual(Buffer.from(new MyString()), check);
deepStrictEqual(Buffer.from(new MyPrimitive()), check);
deepStrictEqual(
  Buffer.from(runInNewContext('new String(checkString)', { checkString })),
  check
);

[
  [{}, 'object'],
  [new Boolean(true), 'boolean'],
  [{ valueOf() { return null; } }, 'object'],
  [{ valueOf() { return undefined; } }, 'object'],
  [{ valueOf: null }, 'object'],
  [Object.create(null), 'object']
].forEach(([input, actualType]) => {
  const err = common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError,
    message: 'The first argument must be one of type string, Buffer, ' +
             'ArrayBuffer, Array, or Array-like Object. Received ' +
             `type ${actualType}`
  });
  throws(() => Buffer.from(input), err);
});

[
  new Number(true),
  new MyBadPrimitive()
].forEach((input) => {
  const errMsg = common.expectsError({
    code: 'ERR_INVALID_ARG_TYPE',
    type: TypeError,
    message: 'The "value" argument must not be of type number. ' +
             'Received type number'
  });
  throws(() => Buffer.from(input), errMsg);
});

{
  const u16 = new Uint16Array([0xffff]);
  const b16 = Buffer.copyBytesFrom(u16);
  u16[0] = 0;
  assert.strictEqual(b16.length, 2);
  assert.strictEqual(b16[0], 255);
  assert.strictEqual(b16[1], 255);
}

{
  const u16 = new Uint16Array([0, 0xffff]);
  const b16 = Buffer.copyBytesFrom(u16, 1, 5);
  u16[0] = 0xffff;
  u16[1] = 0;
  assert.strictEqual(b16.length, 2);
  assert.strictEqual(b16[0], 255);
  assert.strictEqual(b16[1], 255);
}

{
  const u32 = new Uint32Array([0xffffffff]);
  const b32 = Buffer.copyBytesFrom(u32);
  u32[0] = 0;
  assert.strictEqual(b32.length, 4);
  assert.strictEqual(b32[0], 255);
  assert.strictEqual(b32[1], 255);
  assert.strictEqual(b32[2], 255);
  assert.strictEqual(b32[3], 255);
}

assert.throws(() => {
  Buffer.copyBytesFrom();
}, TypeError);

{
  const dv = new DataView(new ArrayBuffer(1));
  assert.throws(() => {
    Buffer.copyBytesFrom(dv);
  }, TypeError);
}

['', Symbol(), true, false, {}, [], () => {}, 1, 1n, null, undefined].forEach(
  notTypedArray => assert.throws(() => {
    Buffer.copyBytesFrom(notTypedArray);
  }, TypeError)
);

['', Symbol(), true, false, {}, [], () => {}, 1n].forEach(notANumber =>
  assert.throws(() => {
    Buffer.copyBytesFrom(new Uint8Array(1), notANumber);
  }, TypeError)
);

[-1, NaN, 1.1, -Infinity].forEach(outOfRange =>
  assert.throws(() => {
    Buffer.copyBytesFrom(new Uint8Array(1), outOfRange);
  }, RangeError)
);

['', Symbol(), true, false, {}, [], () => {}, 1n].forEach(notANumber =>
  assert.throws(() => {
    Buffer.copyBytesFrom(new Uint8Array(1), 0, notANumber);
  }, TypeError)
);

[-1, NaN, 1.1, -Infinity].forEach(outOfRange =>
  assert.throws(() => {
    Buffer.copyBytesFrom(new Uint8Array(1), 0, outOfRange);
  }, RangeError)
);
