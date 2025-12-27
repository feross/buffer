'use strict'

var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 8192
var browserSubject = BrowserBuffer.alloc(LENGTH)
var nodeSubject = Buffer.alloc(LENGTH)

var str = ''

for (var i = 0; i < LENGTH; i++) {
  str += String.fromCharCode(Math.random() * 0x100 | 0)
}

suite.add('BrowserBuffer#write(' + str.length + ', "binary")', function () {
  browserSubject.write(str, 'binary')
})

if (!process.browser) {
  suite.add('NodeBuffer#write(' + str.length + ', "binary")', function () {
    nodeSubject.write(str, 'binary')
  })
}
