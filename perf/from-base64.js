const BrowserBuffer = require('../').Buffer // (this module)
const util = require('./util')
const suite = util.suite()

const LENGTH = 4096
const browserSubject = BrowserBuffer.alloc(LENGTH)

for (let i = 0; i < LENGTH; i++) {
  browserSubject[i] = (Math.random() * 255) << 0
}

const base64 = browserSubject.toString('base64')

suite
  .add('BrowserBuffer#from(base64String, "base64")', function () {
    BrowserBuffer.from(base64, 'base64')
  })

if (!process.browser) suite
  .add('NodeBuffer#from(base64String, "base64")', function () {
    Buffer.from(base64, 'base64')
  })
