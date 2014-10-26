var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 50
var browserBuffer = new BrowserBuffer(LENGTH)
var typedarray = new Uint8Array(LENGTH)
var nodeBuffer = new Buffer(LENGTH)

suite
  .add('BrowserBuffer#bracket-notation', function () {
    for (var i = 0; i < LENGTH; i++) {
      browserBuffer[i] = i + 97
    }
  })
  .add('Uint8Array#bracket-notation', function () {
    for (var i = 0; i < LENGTH; i++) {
      typedarray[i] = i + 97
    }
  })

if (!process.browser) suite
  .add('NodeBuffer#bracket-notation', function () {
    for (var i = 0; i < LENGTH; i++) {
      nodeBuffer[i] = i + 97
    }
  })
