const BrowserBuffer = require('../').Buffer // (this module)
const util = require('./util')
const suite = util.suite()

const LENGTH = 4096
const browserSubject = BrowserBuffer.alloc(LENGTH)
const nodeSubject = Buffer.alloc(LENGTH)

for (let i = 0; i < LENGTH; i++) {
  browserSubject[i] = nodeSubject[i] = (Math.random() * 255) << 0
}

suite
  .add('BrowserBuffer#toString("hex")', function () {
    browserSubject.toString('hex')
  })

if (!process.browser) suite
  .add('NodeBuffer#toString("hex")', function () {
    nodeSubject.toString('hex')
  })
