var B = require('../index.js').Buffer
var test = require('tape')
var TA = require('typedarray')
var xUint16Array = typeof Uint16Array === 'undefined'
  ? TA.Uint16Array : Uint16Array
var xUint8Array = typeof Uint8Array === 'undefined'
  ? TA.Uint8Array : Uint8Array

test('new buffer from array', function (t) {
    t.plan(1)
    t.equal(
        new B([1, 2, 3]).toString(),
        new Buffer([1, 2, 3]).toString()
    )
    t.end()
})

test('new buffer from string', function (t) {
    t.plan(1)
    t.equal(
        new B('hey', 'utf8').toString(),
        new Buffer('hey', 'utf8').toString()
    )
    t.end()
})

function arraybufferToString (arraybuffer) {
  return String.fromCharCode.apply(null, new xUint16Array(arraybuffer))
}

test('buffer toArrayBuffer()', function (t) {
    t.plan(1)
    var data = [1, 2, 3, 4, 5, 6, 7, 8]
    t.equal(
        arraybufferToString(new B(data).toArrayBuffer()),
        arraybufferToString(new xUint8Array(data).buffer)
    )
    t.end()
})

test('buffer toJSON()', function (t) {
    t.plan(1)
    var data = [1, 2, 3, 4]
    t.deepEqual(
      new B(data).toJSON(),
      { type: 'Buffer', data: [1,2,3,4] }
    )
    t.end()
})

test('buffer copy example', function (t) {
    t.plan(1)

    buf1 = new B(26)
    buf2 = new B(26)

    for (var i = 0 ; i < 26 ; i++) {
      buf1[i] = i + 97; // 97 is ASCII a
      buf2[i] = 33; // ASCII !
    }

    buf1.copy(buf2, 8, 16, 20)

    t.equal(
      buf2.toString('ascii', 0, 25),
      '!!!!!!!!qrst!!!!!!!!!!!!!'
    )
    t.end()
})
