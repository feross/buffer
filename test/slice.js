var B = require('../').Buffer
var test = require('tape')

test('modifying buffer created by .slice() modifies original memory', function (t) {
  var buf1 = new B(26)
  for (var i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  var buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf2[0] = '!'.charCodeAt(0)
  t.equal(buf1.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})

test('modifying parent buffer modifies .slice() buffer\'s memory', function (t) {
  var buf1 = new B(26)
  for (var i = 0; i < 26; i++) {
    buf1[i] = i + 97 // 97 is ASCII a
  }

  var buf2 = buf1.slice(0, 3)
  t.equal(buf2.toString('ascii', 0, buf2.length), 'abc')

  buf1[0] = '!'.charCodeAt(0)
  t.equal(buf2.toString('ascii', 0, buf2.length), '!bc')

  t.end()
})

test('subarray returns buffer', function (t) {
  var a = B.from('test')
  t.equal(a.subarray(2, 3).constructor.name, 'Buffer')
  t.end()
})
