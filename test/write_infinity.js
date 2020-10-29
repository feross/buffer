const B = require('../').Buffer
const test = require('tape')

test('write/read Infinity as a float', function (t) {
  const buf = new B(4)
  t.equal(buf.writeFloatBE(Infinity, 0), 4)
  t.equal(buf.readFloatBE(0), Infinity)
  t.end()
})

test('write/read -Infinity as a float', function (t) {
  const buf = new B(4)
  t.equal(buf.writeFloatBE(-Infinity, 0), 4)
  t.equal(buf.readFloatBE(0), -Infinity)
  t.end()
})

test('write/read Infinity as a double', function (t) {
  const buf = new B(8)
  t.equal(buf.writeDoubleBE(Infinity, 0), 8)
  t.equal(buf.readDoubleBE(0), Infinity)
  t.end()
})

test('write/read -Infinity as a double', function (t) {
  const buf = new B(8)
  t.equal(buf.writeDoubleBE(-Infinity, 0), 8)
  t.equal(buf.readDoubleBE(0), -Infinity)
  t.end()
})

test('write/read float greater than max', function (t) {
  const buf = new B(4)
  t.equal(buf.writeFloatBE(4e38, 0), 4)
  t.equal(buf.readFloatBE(0), Infinity)
  t.end()
})

test('write/read float less than min', function (t) {
  const buf = new B(4)
  t.equal(buf.writeFloatBE(-4e40, 0), 4)
  t.equal(buf.readFloatBE(0), -Infinity)
  t.end()
})
