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

test('base64url: convert to/from base64', function (t) {
  const base64url = '8J-Ps--4j_Cfj7PvuI8='
  const base64 = '8J+Ps++4j/Cfj7PvuI8='
  const text = '🏳️🏳️'

  const base64urlBuf = new B(base64url, 'base64url')
  t.equal(base64urlBuf.toString('base64'), base64)
  t.equal(base64urlBuf.toString(), text)

  const base64Buf = new B(base64, 'base64')
  t.equal(base64Buf.toString('base64url'), base64url)
  t.equal(base64Buf.toString(), text)

  const buf = new B(text)
  t.equal(buf.toString('base64url'), base64url)
  t.end()
})
