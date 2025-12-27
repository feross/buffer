'use strict'

var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite = util.suite()

var LENGTH = 4096
var browserSubject = BrowserBuffer.alloc(LENGTH)
var nodeSubject = Buffer.alloc(LENGTH)

var charset = '0123456789abcdef'

var str = ''

for (var i = 0; i < LENGTH * 2; i++) {
  str += charset[Math.random() * charset.length | 0]
}

suite.add('BrowserBuffer#write(' + str.length + ', "hex")', function () {
  browserSubject.write(str, 'hex')
})

if (!process.browser) {
  suite.add('NodeBuffer#write(' + str.length + ', "hex")', function () {
    nodeSubject.write(str, 'hex')
  })
}
