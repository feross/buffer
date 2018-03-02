#!/usr/bin/env node

var cp = require('child_process')
var fs = require('fs')
var path = require('path')

var node = cp.spawn('npm', ['run', 'test-node'], { stdio: 'inherit' })
node.on('close', function (code) {
  if (code !== 0) return process.exit(code)
  runBrowserTests()
})

function runBrowserTests () {
  var airtapYmlPath = path.join(__dirname, '..', '.airtap.yml')

  writeES5AirtapYml()
  cp.spawn('npm', ['run', 'test-browser-es5'], { stdio: 'inherit' })
    .on('close', function (code) {
      if (code !== 0) process.exit(code)
      writeES6AirtapYml()
      cp.spawn('npm', ['run', 'test-browser-es6'], { stdio: 'inherit' })
        .on('close', function (code) {
          process.exit(code)
        })
    })

  function writeES5AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-es5.yml')))
  }

  function writeES6AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-es6.yml')))
  }
}
