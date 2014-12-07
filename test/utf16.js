var B = require('../').Buffer
var test = require('tape')
if (process.env.OBJECT_IMPL) B.TYPED_ARRAY_SUPPORT = false


test('detect utf16 surrogate pairs', function(t) {
  var text = '\uD83D\uDE38' + '\uD83D\uDCAD' + '\uD83D\uDC4D'
  var buf = new B(text)
  t.equal(text, buf.toString())
  t.end()
})

test('throw on orphaned utf16 surrogate lead code point', function(t) {
  var text = '\uD83D\uDE38' + '\uD83D' + '\uD83D\uDC4D'
  var err
  try {
    var buf = new B(text)
  } catch (e) {
    err = e
  }
  t.equal(err instanceof URIError, true)
  t.end()
})

test('throw on orphaned utf16 surrogate trail code point', function(t) {
  var text = '\uD83D\uDE38' + '\uDCAD' + '\uD83D\uDC4D'
  var err
  try {
    var buf = new B(text)
  } catch (e) {
    err = e
  }
  t.equal(err instanceof URIError, true)
  t.end()
})

test('do not write partial utf16 code units', function(t) {
  var f = new B([0, 0, 0, 0, 0])
  t.equal(f.length, 5)
  var size = f.write('あいうえお', 'utf16le')
  t.equal(size, 4)
  t.deepEqual(f, new B([0x42, 0x30, 0x44, 0x30, 0x00]))
  t.end()
})
