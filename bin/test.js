#!/usr/bin/env node

const cp = require('child_process')
const fs = require('fs')
const path = require('path')

const node = cp.spawn('npm', ['run', 'test-node'], { stdio: 'inherit' })
node.on('close', function (code) {
  if (code !== 0) return process.exit(code)
  runBrowserTests()
})

function runBrowserTests () {
  const airtapYmlPath = path.join(__dirname, '..', '.airtap.yml')

  writeES5AirtapYml()
  cp.spawn('npm', ['run', 'test-browser-old'], { stdio: 'inherit' })
    .on('close', function (code) {
      if (code !== 0) process.exit(code)
      writeES6AirtapYml()
      cp.spawn('npm', ['run', 'test-browser-new'], { stdio: 'inherit' })
        .on('close', function (code) {
          process.exit(code)
        })
    })

  function writeES5AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-old.yml')))
  }

  function writeES6AirtapYml () {
    fs.writeFileSync(airtapYmlPath, fs.readFileSync(path.join(__dirname, 'airtap-new.yml')))
  }
}
