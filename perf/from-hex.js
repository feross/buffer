const BrowserBuffer = require('../').Buffer // (this module)
const util = require('./util')
const suite = util.suite()

const LENGTH = 4096
const browserSubject = BrowserBuffer.alloc(LENGTH)

for (let i = 0; i < LENGTH; i++) {
  browserSubject[i] = (Math.random() * 255) << 0
}

const hex = browserSubject.toString('hex')

suite
  .add('BrowserBuffer#from(hexString, "hex")', function () {
    BrowserBuffer.from(hex, 'hex')
  })

if (!process.browser) suite
  .add('NodeBuffer#from(hexString, "hex")', function () {
    Buffer.from(hex, 'hex')
  })
