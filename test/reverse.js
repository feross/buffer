var B = require('../').Buffer
var test = require('tape')

test('reversing a buffer', function (t) {
  var i
  var len = 4
  var buf1 = new B(len)
  var buf2 = new B(len)
  for (i = 0; i < len; i++) {
    buf1[i] = i + 97
    buf2[i] = i + 97
  }

  buf2.reverse()
  for (i = 0; i < len; i++) {
    t.equal(buf1[i], buf2[len - i - 1])
  }

  t.end()
})

test('reversing a known buffer', function (t) {
  t.equal('d9b4bef9', B.from('f9beb4d9', 'hex').reverse().toString('hex'))
  t.end()
})
