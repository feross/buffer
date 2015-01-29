var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 9
var singleByte = 'abcdefghi'
var multiByte = '\u0610' + '\u6100' + '\uD944\uDC00'

var browserBuffer = new BrowserBuffer(LENGTH)
var nodeBuffer = new Buffer(LENGTH)

suite
  .add('BrowserBuffer#singleByte', function () {
    browserBuffer.write(singleByte)
  })
  .add('BrowserBuffer#multiByte', function () {
    browserBuffer.write(multiByte)
  })

if (!process.browser) suite
  .add('NodeBuffer#singleByte', function () {
    nodeBuffer.write(singleByte)
  })
  .add('NodeBuffer#multiByte', function () {
    nodeBuffer.write(multiByte)
  })
