#!/usr/bin/env node

const concat = require('concat-stream')
const cp = require('child_process')
const fs = require('fs')
const hyperquest = require('hyperquest')
const path = require('path')
const split = require('split')
const through = require('through2')

const url = 'https://api.github.com/repos/nodejs/node/contents'
const dirs = [
  '/test/parallel',
  '/test/pummel'
]

cp.execSync('rm -rf node/test-*.js', { cwd: path.join(__dirname, '../test') })

const httpOpts = {
  headers: {
    'User-Agent': null
    // auth if github rate-limits you...
    // 'Authorization': 'Basic ' + Buffer('username:password').toString('base64'),
  }
}

dirs.forEach(function (dir) {
  const req = hyperquest(url + dir, httpOpts)
  req.pipe(concat(function (data) {
    if (req.response.statusCode !== 200) {
      throw new Error(url + dir + ': ' + data.toString())
    }
    downloadBufferTests(dir, JSON.parse(data))
  }))
})

function downloadBufferTests (dir, files) {
  files.forEach(function (file) {
    if (!/test-buffer.*/.test(file.name)) return

    const skipFileNames = [
      // Only applies to node. Calls into C++ and needs to ensure the prototype can't
      // be faked, or else there will be a segfault.
      'test-buffer-fakes.js',
      // Tests SharedArrayBuffer support, which is obscure and now temporarily
      // disabled in all browsers due to the Spectre/Meltdown security issue.
      'test-buffer-sharedarraybuffer.js',
      // References Node.js internals, irrelevant to browser implementation
      'test-buffer-bindingobj-no-zerofill.js',
      // Destructive test, modifies buffer.INSPECT_MAX_BYTES and causes later tests
      // to fail.
      'test-buffer-inspect.js'
    ]

    // Skip test files with these names
    if (skipFileNames.includes(file.name)) return

    console.log(file.download_url)

    const out = path.join(__dirname, '../test/node', file.name)
    hyperquest(file.download_url, httpOpts)
      .pipe(split())
      .pipe(testfixer(file.name))
      .pipe(fs.createWriteStream(out))
      .on('finish', function () {
        console.log('wrote ' + file.name)
      })
  })
}

function testfixer (filename) {
  let firstline = true

  return through(function (line, enc, cb) {
    line = line.toString()

    if (firstline) {
      // require buffer explicitly
      const preamble = 'var Buffer = require(\'../../\').Buffer;'
      if (/use strict/.test(line)) line += '\n' + preamble
      else line += preamble + '\n' + line
      firstline = false
    }

    // make `require('../common')` work
    line = line.replace(/require\('\.\.\/common'\);/g, 'require(\'./common\');')

    // require browser buffer
    line = line.replace(/(.*)require\('buffer'\)(.*)/g, '$1require(\'../../\')$2')

    // comment out console logs
    line = line.replace(/(.*console\..*)/g, '// $1')

    // we can't reliably test typed array max-sizes in the browser
    if (filename === 'test-buffer-big.js') {
      line = line.replace(/(.*new Int8Array.*RangeError.*)/, '// $1')
      line = line.replace(/(.*new ArrayBuffer.*RangeError.*)/, '// $1')
      line = line.replace(/(.*new Float64Array.*RangeError.*)/, '// $1')
    }

    // https://github.com/nodejs/node/blob/v0.12/test/parallel/test-buffer.js#L1138
    // unfortunately we can't run this because crypto-browserify doesn't work in old
    // versions of ie
    if (filename === 'test-buffer.js') {
      line = line.replace(/^(\s*)(var crypto = require.*)/, '$1// $2')
      line = line.replace(/(crypto.createHash.*\))/, '1 /*$1*/')
    }

    cb(null, line + '\n')
  })
}
