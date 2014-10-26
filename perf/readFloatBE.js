var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 160

var browserBuffer = new BrowserBuffer(LENGTH * 4)
var typedarray = new Uint8Array(LENGTH * 4)
var dataview = new DataView(typedarray.buffer)
var nodeBuffer = new Buffer(LENGTH * 4)

;[browserBuffer, nodeBuffer].forEach(function (buf) {
  for (var i = 0; i < LENGTH; i++) {
    buf.writeFloatBE(97.1919 + i, i * 4)
  }
})

for (var i = 0; i < LENGTH; i++) {
  dataview.setFloat32(i * 4, 97.1919 + i)
}

suite
  .add('BrowserBuffer#readFloatBE', function () {
    for (var i = 0; i < LENGTH; i++) {
      var x = browserBuffer.readFloatBE(i * 4)
    }
  })
  .add('DataView#getFloat32', function () {
    for (var i = 0; i < LENGTH; i++) {
      var x = dataview.getFloat32(i * 4)
    }
  })

if (!process.browser) suite
  .add('NodeBuffer#readFloatBE', function () {
    for (var i = 0; i < LENGTH; i++) {
      var x = nodeBuffer.readFloatBE(i * 4)
    }
  })
