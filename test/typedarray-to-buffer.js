if (process.env.OBJECT_IMPL) global.TYPED_ARRAY_SUPPORT = false
var B = require('../').Buffer
var toBuffer = require('typedarray-to-buffer')
var test = require('tape')

test('convert to buffer from Uint8Array', function (t) {
  if (B.TYPED_ARRAY_SUPPORT === true && typeof window !== 'undefined') {
    var arr = new Uint8Array([1, 2, 3])
    arr = toBuffer(arr)

    t.deepEqual(arr, new B([1, 2, 3]), 'contents equal')
    t.ok(B.isBuffer(arr), 'is buffer')
    t.equal(arr.readUInt8(0), 1)
    t.equal(arr.readUInt8(1), 2)
    t.equal(arr.readUInt8(2), 3)
  } else {
    t.pass('browser lacks Uint8Array support, skip test')
  }
  t.end()
})

test('convert to buffer from another arrayview type (Uint32Array)', function (t) {
  if (B.TYPED_ARRAY_SUPPORT === true && typeof window !== 'undefined') {
    var arr = new Uint32Array([1, 2, 3])
    arr = toBuffer(arr)

    t.deepEqual(arr, new B([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0]), 'contents equal')
    t.ok(B.isBuffer(arr), 'is buffer')
    t.equal(arr.readUInt32LE(0), 1)
    t.equal(arr.readUInt32LE(4), 2)
    t.equal(arr.readUInt32LE(8), 3)
    t.equal(arr instanceof Uint8Array, true)
  } else {
    t.pass('browser lacks Uint32Array support, skip test')
  }
  t.end()
})

test('convert to buffer from ArrayBuffer', function (t) {
  if (B.TYPED_ARRAY_SUPPORT === true && typeof window !== 'undefined') {
    var arr = new Uint32Array([1, 2, 3]).subarray(1, 2)
    arr = toBuffer(arr)

    t.deepEqual(arr, new B([2, 0, 0, 0]), 'contents equal')
    t.ok(B.isBuffer(arr), 'is buffer')
    t.equal(arr.readUInt32LE(0), 2)
    t.equal(arr instanceof Uint8Array, true)
  } else {
    t.pass('browser lacks ArrayBuffer support, skip test')
  }
  t.end()
})
