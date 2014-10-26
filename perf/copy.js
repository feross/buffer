var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 16

var browserSubject = new BrowserBuffer(LENGTH)
var typedarraySubject = new Uint8Array(LENGTH)
var nodeSubject = new Buffer(LENGTH)

var browserTarget = new BrowserBuffer(LENGTH)
var typedarrayTarget = new Uint8Array(LENGTH)
var nodeTarget = new Buffer(LENGTH)

suite
  .add('BrowserBuffer#copy (' + LENGTH + ')', function () {
    browserSubject.copy(browserTarget)
  })
  .add('Uint8Array#copy (' + LENGTH + ')', function () {
    typedarrayTarget.set(typedarraySubject, 0)
  })

if (!process.browser) suite
  .add('NodeBuffer#copy (' + LENGTH + ')', function () {
    nodeSubject.copy(nodeTarget)
  })
