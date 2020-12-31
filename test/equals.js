const B = require('../').Buffer
const test = require('tape')
const { randomBytes } = require('crypto')

test('buffer.equals', function (t) {
  const a = B.from(randomBytes(32))
  const b = B.from(randomBytes(64))
  const c = B.from(randomBytes(128))
  const d = B.from(randomBytes(256))
  const e = B.from(randomBytes(512))

  t.assert(a.equals(new Uint8Array(a.buffer)))
  t.assert(b.equals(new Uint8Array(b.buffer)))
  t.assert(c.equals(new Uint8Array(c.buffer)))
  t.assert(d.equals(new Uint8Array(d.buffer)))
  t.assert(e.equals(new Uint8Array(e.buffer)))
  t.end()
})
