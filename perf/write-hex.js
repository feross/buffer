const BrowserBuffer = require('../').Buffer // (this module)
const util = require('./util')
const suite = util.suite()

const LENGTH = 4096
const browserSubject = BrowserBuffer.alloc(LENGTH)
const nodeSubject = Buffer.alloc(LENGTH)

const charset = '0123456789abcdef'

let str = ''

for (let i = 0; i < LENGTH * 2; i++)
  str += charset[Math.random() * charset.length | 0]

suite
  .add('BrowserBuffer#write(' + LENGTH + ', "hex")', function () {
    browserSubject.write(str, 'hex')
  })

if (!process.browser) suite
  .add('NodeBuffer#write(' + LENGTH + ', "hex")', function () {
    nodeSubject.write(str, 'hex')
  })
