var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 16000

suite
  .add('BrowserBuffer#new(' + LENGTH + ')', function () {
    var buf = new BrowserBuffer(LENGTH)
  })
  .add('Uint8Array#new(' + LENGTH + ')', function () {
    var buf = new Uint8Array(LENGTH)
  })

if (!process.browser) suite
  .add('NodeBuffer#new(' + LENGTH + ')', function () {
    var buf = new Buffer(LENGTH)
  })
