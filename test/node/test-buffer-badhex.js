'use strict';
var Buffer = require('../../').Buffer;


var assert = require('assert');
var Buffer = require('../../').Buffer;

/**
 * TEMPORARY HACK UNTIL THIS ASSERT BUG IS FIXED IN NODE CORE
 * https://github.com/nodejs/node/issues/8001
 */
var pToString = function (obj) { return Object.prototype.toString.call(obj) }
var _deepStrictEqual = assert.deepStrictEqual
assert.deepStrictEqual = function (actual, expected, msg) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(actual) &&
      ArrayBuffer.isView(expected) && !require('buffer').Buffer.isBuffer(actual) &&
      !require('buffer').Buffer.isBuffer(expected) && pToString(actual) === pToString(expected) &&
      !(actual instanceof Float32Array || actual instanceof Float64Array)) {
    assert.equal(Buffer.compare(Buffer.from(actual.buffer,
                                            actual.byteOffset,
                                            actual.byteLength),
                             Buffer.from(expected.buffer,
                                         expected.byteOffset,
                                         expected.byteLength)), 0);
  } else {
    _deepStrictEqual.call(assert, actual, expected, msg)
  }
}
var _deepEqual = assert.deepEqual
assert.deepEqual = function (actual, expected, msg) {
  if (typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(actual) &&
      ArrayBuffer.isView(expected) && !require('buffer').Buffer.isBuffer(actual) &&
      !require('buffer').Buffer.isBuffer(expected) && pToString(actual) === pToString(expected) &&
      !(actual instanceof Float32Array || actual instanceof Float64Array)) {
    assert.ok(Buffer.compare(Buffer.from(actual.buffer,
                                         actual.byteOffset,
                                         actual.byteLength),
                             Buffer.from(expected.buffer,
                                         expected.byteOffset,
                                         expected.byteLength)) === 0);
  } else {
    _deepEqual.call(assert, actual, expected, msg)
  }
}
/**
 * END HACK
 */

// Test hex strings and bad hex strings
{
  var buf1 = Buffer.alloc(4);
  assert.strictEqual(buf1.length, 4);
  assert.deepStrictEqual(buf1, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf1.write('abcdxx', 0, 'hex'), 2);
  assert.deepStrictEqual(buf1, new Buffer([0xab, 0xcd, 0x00, 0x00]));
  assert.strictEqual(buf1.toString('hex'), 'abcd0000');
  assert.strictEqual(buf1.write('abcdef01', 0, 'hex'), 4);
  assert.deepStrictEqual(buf1, new Buffer([0xab, 0xcd, 0xef, 0x01]));
  assert.strictEqual(buf1.toString('hex'), 'abcdef01');

  var buf2 = Buffer.from(buf1.toString('hex'), 'hex');
  assert.strictEqual(buf1.toString('hex'), buf2.toString('hex'));

  var buf3 = Buffer.alloc(5);
  assert.strictEqual(buf3.write('abcdxx', 1, 'hex'), 2);
  assert.strictEqual(buf3.toString('hex'), '00abcd0000');

  var buf4 = Buffer.alloc(4);
  assert.deepStrictEqual(buf4, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf4.write('xxabcd', 0, 'hex'), 0);
  assert.deepStrictEqual(buf4, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf4.write('xxab', 1, 'hex'), 0);
  assert.deepStrictEqual(buf4, new Buffer([0, 0, 0, 0]));
  assert.strictEqual(buf4.write('cdxxab', 0, 'hex'), 1);
  assert.deepStrictEqual(buf4, new Buffer([0xcd, 0, 0, 0]));

  var buf5 = Buffer.alloc(256);
  for (var i = 0; i < 256; i++)
    buf5[i] = i;

  var hex = buf5.toString('hex');
  assert.deepStrictEqual(Buffer.from(hex, 'hex'), buf5);

  var badHex = hex.slice(0, 256) + 'xx' + hex.slice(256, 510);
  assert.deepStrictEqual(Buffer.from(badHex, 'hex'), buf5.slice(0, 128));
}

