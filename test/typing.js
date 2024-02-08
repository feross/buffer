'use strict'

const Buffer = require('../').Buffer
const test = require('tape')
const vm = require('vm')

// Get a Uint8Array and Buffer constructor from another context.
const code = `
  'use strict'
  function Buffer (...args) {
    const buf = new Uint8Array(...args)
    Object.setPrototypeOf(buf, Buffer.prototype)
    return buf
  }
  Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
  Object.setPrototypeOf(Buffer, Uint8Array)
  Buffer.prototype._isBuffer = true
  exports.Uint8Array = Uint8Array
  exports.Buffer = Buffer
`

const context = {}

// Should work in browserify.
vm.runInNewContext(code, { exports: context })

const arrays = [context.Uint8Array, context.Buffer]

// Extracted from the index.js code for testing purposes.
function isInstance (obj, type) {
  return (obj instanceof type) ||
         (obj != null &&
          obj.constructor != null &&
          obj.constructor.name != null &&
          obj.constructor.name === type.name) ||
         (type === Uint8Array && Buffer.isBuffer(obj))
}

test('Uint8Arrays and Buffers from other contexts', (t) => {
  // Our buffer is considered a view.
  t.ok(ArrayBuffer.isView(Buffer.alloc(0)))

  for (const ForeignArray of arrays) {
    const buf = new ForeignArray(1)

    buf[0] = 1

    // Prove that ArrayBuffer.isView and isInstance
    // return true for objects from other contexts.
    t.ok(!(buf instanceof Object))
    t.ok(!(buf instanceof Uint8Array))
    t.ok(!(buf instanceof Buffer))
    t.ok(ArrayBuffer.isView(buf))

    // Now returns true even for Buffers from other contexts:
    t.ok(isInstance(buf, Uint8Array))

    if (ForeignArray === context.Uint8Array) {
      t.ok(!Buffer.isBuffer(buf))
    } else {
      t.ok(Buffer.isBuffer(buf))
    }

    // They even behave the same!
    const copy = new Uint8Array(buf)

    t.ok(copy instanceof Object)
    t.ok(copy instanceof Uint8Array)
    t.ok(ArrayBuffer.isView(copy))
    t.equal(copy[0], 1)
  }

  t.end()
})

test('should instantiate from foreign arrays', (t) => {
  for (const ForeignArray of arrays) {
    const arr = new ForeignArray(2)

    arr[0] = 1
    arr[1] = 2

    const buf = Buffer.from(arr)

    t.equal(buf.toString('hex'), '0102')
  }

  t.end()
})

test('should do comparisons with foreign arrays', (t) => {
  const a = Buffer.from([1, 2, 3])
  const b = new context.Uint8Array(a)
  const c = new context.Buffer(a)

  t.equal(Buffer.byteLength(a), 3)
  t.equal(Buffer.byteLength(b), 3)
  t.equal(Buffer.byteLength(c), 3)
  t.equal(b[0], 1)
  t.equal(c[0], 1)

  t.ok(a.equals(b))
  t.ok(a.equals(c))
  t.ok(a.compare(b) === 0)
  t.ok(a.compare(c) === 0)
  t.ok(Buffer.compare(a, b) === 0)
  t.ok(Buffer.compare(a, c) === 0)
  t.ok(Buffer.compare(b, c) === 0)
  t.ok(Buffer.compare(c, b) === 0)

  a[0] = 0

  t.ok(!a.equals(b))
  t.ok(!a.equals(c))
  t.ok(a.compare(b) < 0)
  t.ok(a.compare(c) < 0)
  t.ok(Buffer.compare(a, b) < 0)
  t.ok(Buffer.compare(a, c) < 0)

  b[0] = 0

  t.ok(Buffer.compare(b, c) < 0)
  t.ok(Buffer.compare(c, b) > 0)

  t.end()
})

test('should fill with foreign arrays', (t) => {
  for (const ForeignArray of arrays) {
    const buf = Buffer.alloc(4)
    const arr = new ForeignArray(2)

    arr[0] = 1
    arr[1] = 2

    buf.fill(arr)

    t.equal(buf.toString('hex'), '01020102')
  }

  t.end()
})

test('should do concatenation with foreign arrays', (t) => {
  for (const ForeignArray of arrays) {
    const a = new ForeignArray(2)

    a[0] = 1
    a[1] = 2

    const b = new ForeignArray(a)

    {
      const buf = Buffer.concat([a, b])
      t.equal(buf.toString('hex'), '01020102')
    }

    {
      const buf = Buffer.concat([a, b], 3)
      t.equal(buf.toString('hex'), '010201')
    }
  }

  t.end()
})

test('should copy on to foreign arrays', (t) => {
  for (const ForeignArray of arrays) {
    const a = Buffer.from([1, 2])
    const b = new ForeignArray(2)

    a.copy(b)

    t.equal(b[0], 1)
    t.equal(b[1], 2)
  }

  t.end()
})
