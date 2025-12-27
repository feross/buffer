'use strict'

var BrowserBuffer = require('../').Buffer // (this module)
var util = require('./util')
var suite1 = util.suite(false)
var suite2 = util.suite(false)
var suite3 = util.suite(false)

var LENGTH = (8192 * 3) >>> 2
var browserSubject = BrowserBuffer.alloc(LENGTH)
var nodeSubject = Buffer.alloc(LENGTH)

var charset =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

var str = ''

for (var i = 0; i < 8192; i++) {
  str += charset[Math.random() * charset.length | 0]
}

suite1.add('BrowserBuffer.byteLength(' + str.length + ', "base64")', function () {
  BrowserBuffer.byteLength(str, 'base64')
})

if (!process.browser) {
  suite1.add('NodeBuffer.byteLength(' + str.length + ', "base64")', function () {
    Buffer.byteLength(str, 'base64')
  })
}

suite2.add('BrowserBuffer#write(' + str.length + ', "base64")', function () {
  browserSubject.write(str, 'base64')
})

if (!process.browser) {
  suite2.add('NodeBuffer#write(' + str.length + ', "base64")', function () {
    nodeSubject.write(str, 'base64')
  })
}

suite3.add('BrowserBuffer#toString(' + str.length + ', "base64")', function () {
  browserSubject.toString('base64')
})

if (!process.browser) {
  suite3.add('NodeBuffer#toString(' + str.length + ', "base64")', function () {
    nodeSubject.toString('base64')
  })
}
