const test = require('tape')
const Buffer = require('../').Buffer

test('BigUint64 aliases', function (t) {
  if (typeof BigInt === 'undefined') {
    t.skip('BigInt is not supported')
    t.end()
    return
  }

  ;['LE', 'BE'].forEach(function (endianness) {
    const read = 'readBigUint64' + endianness
    const write = 'writeBigUint64' + endianness
    t.equal(typeof Buffer.prototype[read], 'function', read + ' exists')
    t.equal(typeof Buffer.prototype[write], 'function', write + ' exists')
    t.equal(Buffer.prototype[read], Buffer.prototype['readBigUInt64' + endianness], read + ' is an alias')
    t.equal(Buffer.prototype[write], Buffer.prototype['writeBigUInt64' + endianness], write + ' is an alias')
    if (!Buffer.prototype[read] || !Buffer.prototype[write]) return

    ;['0', '123456789', '18446744073709551615'].forEach(function (value) {
      const buf = Buffer.alloc(9)
      t.equal(buf[write](BigInt(value), 1), 9, 'write returns end offset')
      t.equal(buf[read](1), BigInt(value), 'read returns the unsigned value')
      t.equal(buf[0], 0, 'prefix byte is unchanged')
      t.equal(buf[write](BigInt(value)), 8, 'write accepts default offset')
      t.equal(buf[read](), BigInt(value), 'read accepts default offset')
    })

    const buf = Buffer.alloc(8)
    t.throws(function () { buf[write](BigInt(-1)) }, RangeError)
    t.throws(function () { buf[write](BigInt('18446744073709551616')) }, RangeError)
    t.throws(function () { buf[read](1) }, RangeError)
    t.throws(function () { buf[write](BigInt(0), 1) }, RangeError)
  })
  t.end()
})
