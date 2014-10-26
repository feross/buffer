var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 160

var browserBuffer = new BrowserBuffer(LENGTH * 4)
var typedarray = new Uint8Array(LENGTH * 4)
var dataview = new DataView(typedarray.buffer)
var nodeBuffer = new Buffer(LENGTH * 4)

suite
  .add('BrowserBuffer#writeFloatBE', function () {
    for (var i = 0; i < LENGTH; i++) {
      browserBuffer.writeFloatBE(97.1919 + i, i * 4)
    }
  })
  .add('DataView#setFloat32', function () {
    for (var i = 0; i < LENGTH; i++) {
      dataview.setFloat32(i * 4, 97.1919 + i)
    }
  })

if (!process.browser) suite
  .add('NodeBuffer#writeFloatBE', function () {
    for (var i = 0; i < LENGTH; i++) {
      nodeBuffer.writeFloatBE(97.1919 + i, i * 4)
    }
  })
