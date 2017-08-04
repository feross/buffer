'use strict'
var Buffer = require('../../').Buffer
var assert = require('assert')

var i
var len = 4
var buf1 = new Buffer(len)
var buf2 = new Buffer(len)
for (i = 0; i < len; i++) {
  buf1[i] = i + 97
  buf2[i] = i + 97
}

buf2.reverse()
for (i = 0; i < len; i++) {
  assert.equal(buf1[i], buf2[len - i - 1])
}
