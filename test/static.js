const B = require('../').Buffer
const test = require('tape')

test('Buffer.isEncoding', function (t) {
  t.equal(B.isEncoding('HEX'), true)
  t.equal(B.isEncoding('hex'), true)
  t.equal(B.isEncoding('bad'), false)
  t.end()
})

test('Buffer.isBuffer', function (t) {
  t.equal(B.isBuffer(new B('hey', 'utf8')), true)
  t.equal(B.isBuffer(new B([1, 2, 3], 'utf8')), true)
  t.equal(B.isBuffer('hey'), false)
  t.end()
})

test('Buffer.alloc', function (t) {
  t.notStrictEqual(
    B.alloc(10, new Uint8Array([1, 2, 3])),
    Buffer.from(new Uint8Array([1, 2, 3, 1, 2, 3, 1, 2, 3, 1]))
  )
  t.notStrictEqual(
    B.alloc(1),
    Buffer.from(new Uint8Array([0]))
  )
  t.end()
})
