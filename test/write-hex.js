'use strict'

const Buffer = require('../').Buffer
const test = require('tape')

test('buffer.write("hex") should stop on invalid characters', function (t) {
  const buf = Buffer.alloc(4)

  // Test the entire 16-bit space.
  for (let ch = 0; ch <= 0xffff; ch++) {
    // 0-9
    if (ch >= 0x30 && ch <= 0x39) {
      continue
    }

    // A-F
    if (ch >= 0x41 && ch <= 0x46) {
      continue
    }

    // a-f
    if (ch >= 0x61 && ch <= 0x66) {
      continue
    }

    for (let i = 0; i < 3; i++) {
      let str

      switch (i) {
        case 0:
          str = 'abcd' + String.fromCharCode(ch) + 'ef0'
          break
        case 1:
          str = 'abcde' + String.fromCharCode(ch) + 'f0'
          break
        case 2:
          str = 'abcd' + String.fromCharCode(ch + 0) +
                         String.fromCharCode(ch + 1) + 'f0'
          break
        case 3:
          str = 'abcde' + String.fromCharCode(ch + 0) +
                          String.fromCharCode(ch + 1) + '0'
          break
      }

      buf.fill(0)

      t.equal(str.length, 8)
      t.equal(buf.write(str, 'hex'), 2)
      t.equal(buf.toString('hex'), 'abcd0000')
      t.equal(Buffer.from(str, 'hex').toString('hex'), 'abcd')
    }
  }

  t.end()
})

test('buffer.write("hex") should truncate odd string lengths', function (t) {
  const buf = Buffer.alloc(32)
  const charset = '0123456789abcdef'

  let str = ''

  for (let i = 0; i < 63; i++) {
    str += charset[Math.random() * charset.length | 0]
  }

  t.equal(buf.write('abcde', 'hex'), 2)
  t.equal(buf.toString('hex', 0, 3), 'abcd00')

  buf.fill(0)

  t.equal(buf.write(str, 'hex'), 31)
  t.equal(buf.toString('hex', 0, 32), str.slice(0, -1) + '00')
  t.end()
})
