const B = require('../').Buffer
const test = require('tape')

test('slice clamps offsets outside the signed 32-bit range', function (t) {
  const buf = B.from('abcdef')
  const offsets = [0x80000000, 0x100000000, 0x100000001, Number.MAX_SAFE_INTEGER, Infinity]

  offsets.forEach(function (offset) {
    t.equal(buf.slice(offset).toString(), '', 'start ' + offset)
    t.equal(buf.slice(1, offset).toString(), 'bcdef', 'end ' + offset)
    t.equal(buf.slice(-offset).toString(), 'abcdef', 'start ' + -offset)
    t.equal(buf.slice(0, -offset).toString(), '', 'end ' + -offset)
  })

  t.end()
})

test('slice preserves offset coercion and truncates toward zero', function (t) {
  const buf = B.from('abcdef')
  const cases = [
    [undefined, 'abcdef', 'abcdef'],
    [null, 'abcdef', ''],
    [false, 'abcdef', ''],
    [true, 'bcdef', 'a'],
    ['2.9', 'cdef', 'ab'],
    ['-2.9', 'ef', 'abcd'],
    ['not a number', 'abcdef', ''],
    [NaN, 'abcdef', ''],
    [0.9, 'abcdef', ''],
    [-0.9, 'abcdef', ''],
    [3.9, 'def', 'abc'],
    [-3.9, 'def', 'abc'],
    ['4294967296', '', 'abcdef'],
    ['-4294967296', 'abcdef', ''],
    [{ valueOf: function () { return 0x100000000 } }, '', 'abcdef']
  ]

  cases.forEach(function (entry) {
    const offset = entry[0]
    t.equal(buf.slice(offset).toString(), entry[1], 'start ' + String(offset))
    t.equal(buf.slice(0, offset).toString(), entry[2], 'end ' + String(offset))
  })

  t.end()
})

test('slice with a large end preserves the buffer type and shared memory', function (t) {
  const buf = B.from('abcdef')
  const sliced = buf.slice(1, 0x100000000).slice(1, Infinity)

  t.ok(B.isBuffer(sliced))
  t.equal(sliced.toString(), 'cdef')
  t.equal(sliced.buffer, buf.buffer)
  t.equal(sliced.byteOffset, buf.byteOffset + 2)
  sliced[0] = '!'.charCodeAt(0)
  t.equal(buf.toString(), 'ab!def')
  buf[3] = '?'.charCodeAt(0)
  t.equal(sliced.toString(), '!?ef')

  t.end()
})

test('modifying buffer created by .slice() modifies original memory', function (t) {
  const buf1 = new B(26)
  for (let i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  const buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf2[0] = '!'.charCodeAt(0)
  t.equal(buf1.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})

test('modifying parent buffer modifies .slice() buffer\'s memory', function (t) {
  const buf1 = new B(26)
  for (let i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  const buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf1[0] = '!'.charCodeAt(0)
  t.equal(buf2.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})
