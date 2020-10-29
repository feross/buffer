const B = require('../').Buffer
const test = require('tape')

test('buffer.compare', function (t) {
  const b = new B(1).fill('a')
  const c = new B(1).fill('c')
  const d = new B(2).fill('aa')

  t.equal(b.compare(c), -1)
  t.equal(c.compare(d), 1)
  t.equal(d.compare(b), 1)
  t.equal(b.compare(d), -1)

  // static method
  t.equal(B.compare(b, c), -1)
  t.equal(B.compare(c, d), 1)
  t.equal(B.compare(d, b), 1)
  t.equal(B.compare(b, d), -1)
  t.end()
})

test('buffer.compare argument validation', function (t) {
  t.throws(function () {
    const b = new B(1)
    B.compare(b, 'abc')
  })

  t.throws(function () {
    const b = new B(1)
    B.compare('abc', b)
  })

  t.throws(function () {
    const b = new B(1)
    b.compare('abc')
  })
  t.end()
})

test('buffer.equals', function (t) {
  const b = new B(5).fill('abcdf')
  const c = new B(5).fill('abcdf')
  const d = new B(5).fill('abcde')
  const e = new B(6).fill('abcdef')

  t.ok(b.equals(c))
  t.ok(!c.equals(d))
  t.ok(!d.equals(e))
  t.end()
})

test('buffer.equals argument validation', function (t) {
  t.throws(function () {
    const b = new B(1)
    b.equals('abc')
  })
  t.end()
})
