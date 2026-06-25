const B = require('../').Buffer
const test = require('tape')
const isnan = require('is-nan')

test('buffer.write string should get parsed as number', function (t) {
  const b = new B(64)
  b.writeUInt16LE('1003', 0)
  t.equal(b.readUInt16LE(0), 1003)
  t.end()
})

test('buffer.writeUInt8 a fractional number will get Math.floored', function (t) {
  // Some extra work is necessary to make this test pass with the Object implementation

  const b = new B(1)
  b.writeInt8(5.5, 0)
  t.equal(b[0], 5)
  t.end()
})

test('writeUint8 with a negative number throws', function (t) {
  const buf = new B(1)

  t.throws(function () {
    buf.writeUInt8(-3, 0)
  })

  t.end()
})

test('hex of write{Uint,Int}{8,16,32}{LE,BE}', function (t) {
  t.plan(2 * ((2 * 2 * 2) + 2))
  const hex = [
    '03', '0300', '0003', '03000000', '00000003',
    'fd', 'fdff', 'fffd', 'fdffffff', 'fffffffd'
  ]
  const reads = [3, 3, 3, 3, 3, -3, -3, -3, -3, -3]
  const xs = ['UInt', 'Int']
  const ys = [8, 16, 32]
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]
    for (let j = 0; j < ys.length; j++) {
      const y = ys[j]
      const endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (let k = 0; k < endianesses.length; k++) {
        const z = endianesses[k]

        const v1 = new B(y / 8)
        const writefn = 'write' + x + y + z
        const val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        const readfn = 'read' + x + y + z
        t.equal(
          v1[readfn](0),
          reads.shift()
        )
      }
    }
  }
  t.end()
})

test('hex of write{Uint,Int}{8,16,32}{LE,BE} with overflow', function (t) {
  t.plan(3 * ((2 * 2 * 2) + 2))
  const hex = [
    '', '03', '00', '030000', '000000',
    '', 'fd', 'ff', 'fdffff', 'ffffff'
  ]
  const reads = [
    undefined, 3, 0, NaN, 0,
    undefined, 253, -256, 16777213, -256
  ]
  const xs = ['UInt', 'Int']
  const ys = [8, 16, 32]
  for (let i = 0; i < xs.length; i++) {
    const x = xs[i]
    for (let j = 0; j < ys.length; j++) {
      const y = ys[j]
      const endianesses = (y === 8) ? [''] : ['LE', 'BE']
      for (let k = 0; k < endianesses.length; k++) {
        const z = endianesses[k]

        const v1 = new B((y / 8) - 1)
        const next = new B(4)
        next.writeUInt32BE(0, 0)
        const writefn = 'write' + x + y + z
        const val = (x === 'Int') ? -3 : 3
        v1[writefn](val, 0, true)
        t.equal(
          v1.toString('hex'),
          hex.shift()
        )
        // check that nothing leaked to next buffer.
        t.equal(next.readUInt32BE(0), 0)
        // check that no bytes are read from next buffer.
        next.writeInt32BE(~0, 0)
        const readfn = 'read' + x + y + z
        const r = reads.shift()
        if (isnan(r)) t.pass('equal')
        else t.equal(v1[readfn](0, true), r)
      }
    }
  }
  t.end()
})
test('large values do not improperly roll over (ref #80)', function (t) {
  const nums = [-25589992, -633756690, -898146932]
  const out = new B(12)
  out.fill(0)
  out.writeInt32BE(nums[0], 0)
  let newNum = out.readInt32BE(0)
  t.equal(nums[0], newNum)
  out.writeInt32BE(nums[1], 4)
  newNum = out.readInt32BE(4)
  t.equal(nums[1], newNum)
  out.writeInt32BE(nums[2], 8)
  newNum = out.readInt32BE(8)
  t.equal(nums[2], newNum)
  t.end()
})

test('write with explicit length does not write a partial multibyte char (ref node parity)', function (t) {
  // Node guarantees: "partially encoded characters will not be written", and the
  // return value counts only complete characters. A length smaller than the
  // byte length of the next character must drop that character entirely.

  // 'é' is 2 utf8 bytes (c3 a9); length 1 cannot hold it -> nothing written.
  const a = B.alloc(8, 0)
  t.equal(a.write('é', 0, 1, 'utf8'), 0, 'é len 1 returns 0')
  t.equal(a.toString('hex'), '0000000000000000', 'é len 1 leaves buffer zeroed')

  // '€' is 3 utf8 bytes (e2 82 ac); length 2 cannot hold it -> nothing written.
  const b = B.alloc(8, 0)
  t.equal(b.write('€', 0, 2, 'utf8'), 0, '€ len 2 returns 0')
  t.equal(b.toString('hex'), '0000000000000000', '€ len 2 leaves buffer zeroed')

  // 'ab' utf16le is 4 bytes; length 3 holds one full 2-byte unit only.
  const c = B.alloc(8, 0)
  t.equal(c.write('ab', 0, 3, 'utf16le'), 2, 'ab len 3 utf16le returns 2')
  t.equal(c.toString('hex'), '6100000000000000', 'ab len 3 utf16le writes only the first complete unit')

  t.end()
})
