const B = require('../').Buffer
const test = require('tape')

test('base64: ignore whitespace', function (t) {
  const text = '\n   YW9ldQ==  '
  const buf = new B(text, 'base64')
  t.equal(buf.toString(), 'aoeu')
  t.end()
})

test('base64: strings without padding', function (t) {
  t.equal((new B('YW9ldQ', 'base64').toString()), 'aoeu')
  t.end()
})

test('base64: newline in utf8 -- should not be an issue', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n'
  )
  t.end()
})

test('base64: newline in base64 -- should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\nICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64: tab characters in base64 - should get stripped', function (t) {
  t.equal(
    new B('LS0tCnRpdGxlOiBUaHJlZSBkYXNoZXMgbWFya3MgdGhlIHNwb3QKdGFnczoK\t\t\t\tICAtIHlhbWwKICAtIGZyb250LW1hdHRlcgogIC0gZGFzaGVzCmV4cGFuZWQt', 'base64').toString('utf8'),
    '---\ntitle: Three dashes marks the spot\ntags:\n  - yaml\n  - front-matter\n  - dashes\nexpaned-'
  )
  t.end()
})

test('base64: invalid non-alphanumeric characters -- should be stripped', function (t) {
  t.equal(
    new B('!"#$%&\'()*,.:;<=>?@[\\]^`{|}~', 'base64').toString('utf8'),
    ''
  )
  t.end()
})

test('base64: high byte', function (t) {
  const highByte = B.from([128])
  t.deepEqual(
    B.alloc(1, highByte.toString('base64'), 'base64'),
    highByte
  )
  t.end()
})

test('base64: rfc test vectors', function (t) {
  // https://tools.ietf.org/html/rfc4648#section-10
  const vectors = [
    ['', ''],
    ['66', 'Zg=='],
    ['666f', 'Zm8='],
    ['666f6f', 'Zm9v'],
    ['666f6f62', 'Zm9vYg=='],
    ['666f6f6261', 'Zm9vYmE='],
    ['666f6f626172', 'Zm9vYmFy'],
    ['53e9363b2962fcaf', 'U+k2Oyli/K8=']
  ]

  for (const [base16, base64] of vectors) {
    const buf16 = B.from(base16, 'hex')
    const buf64 = B.from(base64, 'base64')

    t.equal(buf16.toString('base64'), base64)
    t.equal(buf64.toString('hex'), base16)
  }

  t.end()
})

test('base64url: rfc test vectors', function (t) {
  const vectors = [
    ['', ''],
    ['66', 'Zg'],
    ['666f', 'Zm8'],
    ['666f6f', 'Zm9v'],
    ['666f6f62', 'Zm9vYg'],
    ['666f6f6261', 'Zm9vYmE'],
    ['666f6f626172', 'Zm9vYmFy'],
    ['53e9363b2962fcaf', 'U-k2Oyli_K8']
  ]

  for (const [base16, base64] of vectors) {
    const buf16 = B.from(base16, 'hex')
    const buf64 = B.from(base64, 'base64url')

    t.equal(buf16.toString('base64url'), base64)
    t.equal(buf64.toString('hex'), base16)
  }

  t.end()
})
