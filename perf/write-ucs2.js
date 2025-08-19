'use strict'

var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 16384
var browserSubject = BrowserBuffer.alloc(LENGTH)
var nodeSubject = Buffer.alloc(LENGTH)

var str = ''

for (var i = 0; i < LENGTH / 2; i++) {
  str += String.fromCharCode(Math.random() * 0x10000 | 0)
}

suite.add('BrowserBuffer#write(' + str.length + ', "ucs2")', function () {
  browserSubject.write(str, 'ucs2')
})

if (!process.browser) {
  suite.add('NodeBuffer#write(' + str.length + ', "ucs2")', function () {
    nodeSubject.write(str, 'ucs2')
  })
}
