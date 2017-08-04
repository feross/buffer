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
