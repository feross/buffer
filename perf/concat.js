var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 160
var browserBuffer = new BrowserBuffer(LENGTH)
var browserBuffer2 = new BrowserBuffer(LENGTH)
var typedarray = new Uint8Array(LENGTH)
var typedarray2 = new Uint8Array(LENGTH)
var nodeBuffer = new Buffer(LENGTH)
var nodeBuffer2 = new Buffer(LENGTH)

;[browserBuffer, browserBuffer2, typedarray, typedarray2, nodeBuffer, nodeBuffer2].forEach(function (buf) {
  for (var i = 0; i < LENGTH; i++) {
    buf[i] = i + 97
  }
})

suite
  .add('BrowserBuffer#concat', function () {
    var x = BrowserBuffer.concat([browserBuffer, browserBuffer2], LENGTH * 2)
  })
  .add('Uint8Array#concat', function () {
    var x = new Uint8Array(LENGTH * 2)
    x.set(typedarray, 0)
    x.set(typedarray2, typedarray.length)
  })

if (!process.browser) suite
  .add('NodeBuffer#concat', function () {
    var x = Buffer.concat([nodeBuffer, nodeBuffer2], LENGTH * 2)
  })
