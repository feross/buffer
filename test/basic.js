const B = require('../').Buffer
const test = require('tape')

test('instanceof Buffer', function (t) {
  const buf = new B([1, 2])
  t.ok(buf instanceof B)
  t.end()
})

test('convert to Uint8Array in modern browsers', function (t) {
  const buf = new B([1, 2])
  const uint8array = new Uint8Array(buf.buffer)
  t.ok(uint8array instanceof Uint8Array)
  t.equal(uint8array[0], 1)
  t.equal(uint8array[1], 2)
  t.end()
})

test('indexes from a string', function (t) {
  const buf = new B('abc')
  t.equal(buf[0], 97)
  t.equal(buf[1], 98)
  t.equal(buf[2], 99)
  t.end()
})

test('indexes from an array', function (t) {
  const buf = new B([97, 98, 99])
  t.equal(buf[0], 97)
  t.equal(buf[1], 98)
  t.equal(buf[2], 99)
  t.end()
})

test('setting index value should modify buffer contents', function (t) {
  const buf = new B([97, 98, 99])
  t.equal(buf[2], 99)
  t.equal(buf.toString(), 'abc')

  buf[2] += 10
  t.equal(buf[2], 109)
  t.equal(buf.toString(), 'abm')
  t.end()
})

test('storing negative number should cast to unsigned', function (t) {
  let buf = new B(1)

  buf[0] = -3
  t.equal(buf[0], 253)

  buf = new B(1)
  buf.writeInt8(-3, 0)
  t.equal(buf[0], 253)

  t.end()
})

test('test that memory is copied from array-like', function (t) {
  const u = new Uint8Array(4)
  const b = new B(u)
  b[0] = 1
  b[1] = 2
  b[2] = 3
  b[3] = 4

  t.equal(u[0], 0)
  t.equal(u[1], 0)
  t.equal(u[2], 0)
  t.equal(u[3], 0)

  t.end()
})
