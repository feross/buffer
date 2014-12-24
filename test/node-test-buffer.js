var Buffer = require('../').Buffer
var test = require('tape')
if (process.env.OBJECT_IMPL) Buffer.TYPED_ARRAY_SUPPORT = false
test('test-buffer.js', function(t) {
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// var common = require('../common');
// var assert = require('assert');

var Buffer = require('../').Buffer;
var SlowBuffer = require('../').SlowBuffer;
var smalloc = { kMaxLength: 0x3FFFFFFF };

// counter to ensure unique value is always copied
var cntr = 0;

var b = Buffer(1024); // safe constructor

// console.log('b.length == %d', b.length);
t.strictEqual(1024, b.length);

b[0] = 255;
t.strictEqual(b[0], 255);

for (var i = 0; i < 1024; i++) {
  b[i] = i % 256;
}

for (var i = 0; i < 1024; i++) {
  t.strictEqual(i % 256, b[i]);
}

var c = new Buffer(512);
// console.log('c.length == %d', c.length);
t.strictEqual(512, c.length);

// First check Buffer#fill() works as expected.

t.throws(function() {
  Buffer(8).fill('a', -1);
});

t.throws(function() {
  Buffer(8).fill('a', 0, 9);
});

// Make sure this doesn't hang indefinitely.
Buffer(8).fill('');

var buf = new Buffer(64);
buf.fill(10);
for (var i = 0; i < buf.length; i++)
  t.equal(buf[i], 10);

buf.fill(11, 0, buf.length >> 1);
for (var i = 0; i < buf.length >> 1; i++)
  t.equal(buf[i], 11);
for (var i = (buf.length >> 1) + 1; i < buf.length; i++)
  t.equal(buf[i], 10);

buf.fill('h');
for (var i = 0; i < buf.length; i++)
  t.equal('h'.charCodeAt(0), buf[i]);

buf.fill(0);
for (var i = 0; i < buf.length; i++)
  t.equal(0, buf[i]);

buf.fill(null);
for (var i = 0; i < buf.length; i++)
  t.equal(0, buf[i]);

buf.fill(1, 16, 32);
for (var i = 0; i < 16; i++)
  t.equal(0, buf[i]);
for (; i < 32; i++)
  t.equal(1, buf[i]);
for (; i < buf.length; i++)
  t.equal(0, buf[i]);

var buf = new Buffer(10);
buf.fill('abc');
t.equal(buf.toString(), 'abcabcabca');
buf.fill('է');
t.equal(buf.toString(), 'էէէէէ');

// copy 512 bytes, from 0 to 512.
b.fill(++cntr);
c.fill(++cntr);
var copied = b.copy(c, 0, 0, 512);
// console.log('copied %d bytes from b into c', copied);
t.strictEqual(512, copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(b[i], c[i]);
}

// copy c into b, without specifying sourceEnd
b.fill(++cntr);
c.fill(++cntr);
var copied = c.copy(b, 0, 0);
// console.log('copied %d bytes from c into b w/o sourceEnd', copied);
t.strictEqual(c.length, copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(c[i], b[i]);
}

// copy c into b, without specifying sourceStart
b.fill(++cntr);
c.fill(++cntr);
var copied = c.copy(b, 0);
// console.log('copied %d bytes from c into b w/o sourceStart', copied);
t.strictEqual(c.length, copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(c[i], b[i]);
}

// copy longer buffer b to shorter c without targetStart
b.fill(++cntr);
c.fill(++cntr);
var copied = b.copy(c);
// console.log('copied %d bytes from b into c w/o targetStart', copied);
t.strictEqual(c.length, copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(b[i], c[i]);
}

// copy starting near end of b to c
b.fill(++cntr);
c.fill(++cntr);
var copied = b.copy(c, 0, b.length - Math.floor(c.length / 2));
// console.log('copied %d bytes from end of b into beginning of c', copied);
t.strictEqual(Math.floor(c.length / 2), copied);
for (var i = 0; i < Math.floor(c.length / 2); i++) {
  t.strictEqual(b[b.length - Math.floor(c.length / 2) + i], c[i]);
}
for (var i = Math.floor(c.length /2) + 1; i < c.length; i++) {
  t.strictEqual(c[c.length-1], c[i]);
}

// try to copy 513 bytes, and check we don't overrun c
b.fill(++cntr);
c.fill(++cntr);
var copied = b.copy(c, 0, 0, 513);
// console.log('copied %d bytes from b trying to overrun c', copied);
t.strictEqual(c.length, copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(b[i], c[i]);
}

// copy 768 bytes from b into b
b.fill(++cntr);
b.fill(++cntr, 256);
var copied = b.copy(b, 0, 256, 1024);
// console.log('copied %d bytes from b into b', copied);
t.strictEqual(768, copied);
for (var i = 0; i < b.length; i++) {
  t.strictEqual(cntr, b[i]);
}

// copy string longer than buffer length (failure will segfault)
var bb = new Buffer(10);
bb.fill('hello crazy world');


var caught_error = null;

// try to copy from before the beginning of b
caught_error = null;
try {
  var copied = b.copy(c, 0, 100, 10);
} catch (err) {
  caught_error = err;
}

// copy throws at negative sourceStart
t.throws(function() {
  Buffer(5).copy(Buffer(5), 0, -1);
}, RangeError);

// check sourceEnd resets to targetEnd if former is greater than the latter
b.fill(++cntr);
c.fill(++cntr);
var copied = b.copy(c, 0, 0, 1025);
// console.log('copied %d bytes from b into c', copied);
for (var i = 0; i < c.length; i++) {
  t.strictEqual(b[i], c[i]);
}

// throw with negative sourceEnd
// console.log('test copy at negative sourceEnd');
t.throws(function() {
  b.copy(c, 0, 0, -1);
}, RangeError);

// when sourceStart is greater than sourceEnd, zero copied
t.equal(b.copy(c, 0, 100, 10), 0);

// when targetStart > targetLength, zero copied
t.equal(b.copy(c, 512, 0, 10), 0);

var caught_error;

// invalid encoding for Buffer.toString
caught_error = null;
try {
  var copied = b.toString('invalid');
} catch (err) {
  caught_error = err;
}
t.strictEqual('Unknown encoding: invalid', caught_error.message);

// invalid encoding for Buffer.write
caught_error = null;
try {
  var copied = b.write('test string', 0, 5, 'invalid');
} catch (err) {
  caught_error = err;
}
t.strictEqual('Unknown encoding: invalid', caught_error.message);

// try to create 0-length buffers
new Buffer('');
new Buffer('', 'ascii');
new Buffer('', 'binary');
new Buffer(0);

// try to write a 0-length string beyond the end of b
t.throws(function() {
  b.write('', 2048);
}, RangeError);

// throw when writing to negative offset
t.throws(function() {
  b.write('a', -1);
}, RangeError);

// throw when writing past bounds from the pool
t.throws(function() {
  b.write('a', 2048);
}, RangeError);

// throw when writing to negative offset
t.throws(function() {
  b.write('a', -1);
}, RangeError);

// try to copy 0 bytes worth of data into an empty buffer
b.copy(new Buffer(0), 0, 0, 0);

// try to copy 0 bytes past the end of the target buffer
b.copy(new Buffer(0), 1, 1, 1);
b.copy(new Buffer(1), 1, 1, 1);

// try to copy 0 bytes from past the end of the source buffer
b.copy(new Buffer(1), 0, 2048, 2048);

// try to toString() a 0-length slice of a buffer, both within and without the
// valid buffer range
t.equal(new Buffer('abc').toString('ascii', 0, 0), '');
t.equal(new Buffer('abc').toString('ascii', -100, -100), '');
t.equal(new Buffer('abc').toString('ascii', 100, 100), '');

// try toString() with a object as a encoding
t.equal(new Buffer('abc').toString({toString: function() {
  return 'ascii';
}}), 'abc');

// testing for smart defaults and ability to pass string values as offset
var writeTest = new Buffer('abcdes');
writeTest.write('n', 'ascii');
writeTest.write('o', 'ascii', '1');
writeTest.write('d', '2', 'ascii');
writeTest.write('e', 3, 'ascii');
writeTest.write('j', 'ascii', 4);
t.equal(writeTest.toString(), 'nodejs');

var asciiString = 'hello world';
var offset = 100;
for (var j = 0; j < 500; j++) {

  for (var i = 0; i < asciiString.length; i++) {
    b[i] = asciiString.charCodeAt(i);
  }
  var asciiSlice = b.toString('ascii', 0, asciiString.length);
  t.equal(asciiString, asciiSlice);

  var written = b.write(asciiString, offset, 'ascii');
  t.equal(asciiString.length, written);
  var asciiSlice = b.toString('ascii', offset, offset + asciiString.length);
  t.equal(asciiString, asciiSlice);

  var sliceA = b.slice(offset, offset + asciiString.length);
  var sliceB = b.slice(offset, offset + asciiString.length);
  for (var i = 0; i < asciiString.length; i++) {
    t.equal(sliceA[i], sliceB[i]);
  }

  // TODO utf8 slice tests
}


for (var j = 0; j < 100; j++) {
  var slice = b.slice(100, 150);
  t.equal(50, slice.length);
  for (var i = 0; i < 50; i++) {
    t.equal(b[100 + i], slice[i]);
  }
}


// make sure only top level parent propagates from allocPool
var b = new Buffer(5);
var c = b.slice(0, 4);
var d = c.slice(0, 2);
t.equal(b.parent, c.parent);
t.equal(b.parent, d.parent);

// also from a non-pooled instance
var b = new SlowBuffer(5);
var c = b.slice(0, 4);
var d = c.slice(0, 2);
t.equal(b, c.parent);
t.equal(b, d.parent);



// Bug regression test
var testValue = '\u00F6\u65E5\u672C\u8A9E'; // ö日本語
var buffer = new Buffer(32);
var size = buffer.write(testValue, 0, 'utf8');
// console.log('bytes written to buffer: ' + size);
var slice = buffer.toString('utf8', 0, size);
t.equal(slice, testValue);


// Test triple  slice
var a = new Buffer(8);
for (var i = 0; i < 8; i++) a[i] = i;
var b = a.slice(4, 8);
t.equal(4, b[0]);
t.equal(5, b[1]);
t.equal(6, b[2]);
t.equal(7, b[3]);
var c = b.slice(2, 4);
t.equal(6, c[0]);
t.equal(7, c[1]);


var d = new Buffer([23, 42, 255]);
t.equal(d.length, 3);
t.equal(d[0], 23);
t.equal(d[1], 42);
t.equal(d[2], 255);
t.deepEqual(d, new Buffer(d));

var e = new Buffer('über');
// console.error('uber: \'%s\'', e.toString());
t.deepEqual(e, new Buffer([195, 188, 98, 101, 114]));

var f = new Buffer('über', 'ascii');
// console.error('f.length: %d     (should be 4)', f.length);
t.deepEqual(f, new Buffer([252, 98, 101, 114]));

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  var f = new Buffer('über', encoding);
//   console.error('f.length: %d     (should be 8)', f.length);
  t.deepEqual(f, new Buffer([252, 0, 98, 0, 101, 0, 114, 0]));

  var f = new Buffer('привет', encoding);
//   console.error('f.length: %d     (should be 12)', f.length);
  t.deepEqual(f, new Buffer([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4]));
  t.equal(f.toString(encoding), 'привет');

  var f = new Buffer([0, 0, 0, 0, 0]);
  t.equal(f.length, 5);
  var size = f.write('あいうえお', encoding);
//   console.error('bytes written to buffer: %d     (should be 4)', size);
  t.equal(size, 4);
  t.deepEqual(f, new Buffer([0x42, 0x30, 0x44, 0x30, 0x00]));
});

var f = new Buffer('\uD83D\uDC4D', 'utf-16le'); // THUMBS UP SIGN (U+1F44D)
t.equal(f.length, 4);
t.deepEqual(f, new Buffer('3DD84DDC', 'hex'));


var arrayIsh = {0: 0, 1: 1, 2: 2, 3: 3, length: 4};
var g = new Buffer(arrayIsh);
t.deepEqual(g, new Buffer([0, 1, 2, 3]));
var strArrayIsh = {0: '0', 1: '1', 2: '2', 3: '3', length: 4};
g = new Buffer(strArrayIsh);
t.deepEqual(g, new Buffer([0, 1, 2, 3]));


//
// Test toString('base64')
//
t.equal('TWFu', (new Buffer('Man')).toString('base64'));

// test that regular and URL-safe base64 both work
var expected = [0xff, 0xff, 0xbe, 0xff, 0xef, 0xbf, 0xfb, 0xef, 0xff];
t.deepEqual(Buffer('//++/++/++//', 'base64'), Buffer(expected));
t.deepEqual(Buffer('__--_--_--__', 'base64'), Buffer(expected));

// big example
var quote = 'Man is distinguished, not only by his reason, but by this ' +
            'singular passion from other animals, which is a lust ' +
            'of the mind, that by a perseverance of delight in the continued ' +
            'and indefatigable generation of knowledge, exceeds the short ' +
            'vehemence of any carnal pleasure.';
var expected = 'TWFuIGlzIGRpc3Rpbmd1aXNoZWQsIG5vdCBvbmx5IGJ5IGhpcyByZWFzb24s' +
               'IGJ1dCBieSB0aGlzIHNpbmd1bGFyIHBhc3Npb24gZnJvbSBvdGhlciBhbmltY' +
               'WxzLCB3aGljaCBpcyBhIGx1c3Qgb2YgdGhlIG1pbmQsIHRoYXQgYnkgYSBwZX' +
               'JzZXZlcmFuY2Ugb2YgZGVsaWdodCBpbiB0aGUgY29udGludWVkIGFuZCBpbmR' +
               'lZmF0aWdhYmxlIGdlbmVyYXRpb24gb2Yga25vd2xlZGdlLCBleGNlZWRzIHRo' +
               'ZSBzaG9ydCB2ZWhlbWVuY2Ugb2YgYW55IGNhcm5hbCBwbGVhc3VyZS4=';
t.equal(expected, (new Buffer(quote)).toString('base64'));


b = new Buffer(1024);
var bytesWritten = b.write(expected, 0, 'base64');
t.equal(quote.length, bytesWritten);
t.equal(quote, b.toString('ascii', 0, quote.length));

// check that the base64 decoder ignores whitespace
var expectedWhite = expected.slice(0, 60) + ' \n' +
                    expected.slice(60, 120) + ' \n' +
                    expected.slice(120, 180) + ' \n' +
                    expected.slice(180, 240) + ' \n' +
                    expected.slice(240, 300) + '\n' +
                    expected.slice(300, 360) + '\n';
b = new Buffer(1024);
bytesWritten = b.write(expectedWhite, 0, 'base64');
t.equal(quote.length, bytesWritten);
t.equal(quote, b.toString('ascii', 0, quote.length));

// check that the base64 decoder on the constructor works
// even in the presence of whitespace.
b = new Buffer(expectedWhite, 'base64');
t.equal(quote.length, b.length);
t.equal(quote, b.toString('ascii', 0, quote.length));

// check that the base64 decoder ignores illegal chars
var expectedIllegal = expected.slice(0, 60) + ' \x80' +
                      expected.slice(60, 120) + ' \xff' +
                      expected.slice(120, 180) + ' \x00' +
                      expected.slice(180, 240) + ' \x98' +
                      expected.slice(240, 300) + '\x03' +
                      expected.slice(300, 360);
b = new Buffer(expectedIllegal, 'base64');
t.equal(quote.length, b.length);
t.equal(quote, b.toString('ascii', 0, quote.length));


t.equal(new Buffer('', 'base64').toString(), '');
t.equal(new Buffer('K', 'base64').toString(), '');

// multiple-of-4 with padding
t.equal(new Buffer('Kg==', 'base64').toString(), '*');
t.equal(new Buffer('Kio=', 'base64').toString(), '**');
t.equal(new Buffer('Kioq', 'base64').toString(), '***');
t.equal(new Buffer('KioqKg==', 'base64').toString(), '****');
t.equal(new Buffer('KioqKio=', 'base64').toString(), '*****');
t.equal(new Buffer('KioqKioq', 'base64').toString(), '******');
t.equal(new Buffer('KioqKioqKg==', 'base64').toString(), '*******');
t.equal(new Buffer('KioqKioqKio=', 'base64').toString(), '********');
t.equal(new Buffer('KioqKioqKioq', 'base64').toString(), '*********');
t.equal(new Buffer('KioqKioqKioqKg==', 'base64').toString(),
             '**********');
t.equal(new Buffer('KioqKioqKioqKio=', 'base64').toString(),
             '***********');
t.equal(new Buffer('KioqKioqKioqKioq', 'base64').toString(),
             '************');
t.equal(new Buffer('KioqKioqKioqKioqKg==', 'base64').toString(),
             '*************');
t.equal(new Buffer('KioqKioqKioqKioqKio=', 'base64').toString(),
             '**************');
t.equal(new Buffer('KioqKioqKioqKioqKioq', 'base64').toString(),
             '***************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKg==', 'base64').toString(),
             '****************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKio=', 'base64').toString(),
             '*****************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKioq', 'base64').toString(),
             '******************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKioqKg==', 'base64').toString(),
             '*******************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKioqKio=', 'base64').toString(),
             '********************');

// no padding, not a multiple of 4
t.equal(new Buffer('Kg', 'base64').toString(), '*');
t.equal(new Buffer('Kio', 'base64').toString(), '**');
t.equal(new Buffer('KioqKg', 'base64').toString(), '****');
t.equal(new Buffer('KioqKio', 'base64').toString(), '*****');
t.equal(new Buffer('KioqKioqKg', 'base64').toString(), '*******');
t.equal(new Buffer('KioqKioqKio', 'base64').toString(), '********');
t.equal(new Buffer('KioqKioqKioqKg', 'base64').toString(), '**********');
t.equal(new Buffer('KioqKioqKioqKio', 'base64').toString(), '***********');
t.equal(new Buffer('KioqKioqKioqKioqKg', 'base64').toString(),
             '*************');
t.equal(new Buffer('KioqKioqKioqKioqKio', 'base64').toString(),
             '**************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKg', 'base64').toString(),
             '****************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKio', 'base64').toString(),
             '*****************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKioqKg', 'base64').toString(),
             '*******************');
t.equal(new Buffer('KioqKioqKioqKioqKioqKioqKio', 'base64').toString(),
             '********************');

// handle padding graciously, multiple-of-4 or not
t.equal(new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw==',
                        'base64').length, 32);
t.equal(new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw=',
                        'base64').length, 32);
t.equal(new Buffer('72INjkR5fchcxk9+VgdGPFJDxUBFR5/rMFsghgxADiw',
                        'base64').length, 32);
t.equal(new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg==',
                        'base64').length, 31);
t.equal(new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg=',
                        'base64').length, 31);
t.equal(new Buffer('w69jACy6BgZmaFvv96HG6MYksWytuZu3T1FvGnulPg',
                        'base64').length, 31);

// This string encodes single '.' character in UTF-16
var dot = new Buffer('//4uAA==', 'base64');
t.equal(dot[0], 0xff);
t.equal(dot[1], 0xfe);
t.equal(dot[2], 0x2e);
t.equal(dot[3], 0x00);
t.equal(dot.toString('base64'), '//4uAA==');

// Writing base64 at a position > 0 should not mangle the result.
//
// https://github.com/joyent/node/issues/402
var segments = ['TWFkbmVzcz8h', 'IFRoaXM=', 'IGlz', 'IG5vZGUuanMh'];
var buf = new Buffer(64);
var pos = 0;

for (var i = 0; i < segments.length; ++i) {
  pos += b.write(segments[i], pos, 'base64');
}
t.equal(b.toString('binary', 0, pos), 'Madness?! This is node.js!');

// Creating buffers larger than pool size.
var l = Buffer.poolSize + 5;
var s = '';
for (i = 0; i < l; i++) {
  s += 'h';
}

var b = new Buffer(s);

for (i = 0; i < l; i++) {
  t.equal('h'.charCodeAt(0), b[i]);
}

var sb = b.toString();
t.equal(sb.length, s.length);
t.equal(sb, s);


// Single argument slice
b = new Buffer('abcde');
t.equal('bcde', b.slice(1).toString());

// byte length
t.equal(14, Buffer.byteLength('Il était tué'));
t.equal(14, Buffer.byteLength('Il était tué', 'utf8'));
['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  t.equal(24, Buffer.byteLength('Il était tué', encoding));
});
t.equal(12, Buffer.byteLength('Il était tué', 'ascii'));
t.equal(12, Buffer.byteLength('Il était tué', 'binary'));

// slice(0,0).length === 0
t.equal(0, Buffer('hello').slice(0, 0).length);

// test hex toString
// console.log('Create hex string from buffer');
var hexb = new Buffer(256);
for (var i = 0; i < 256; i++) {
  hexb[i] = i;
}
var hexStr = hexb.toString('hex');
t.equal(hexStr,
             '000102030405060708090a0b0c0d0e0f' +
             '101112131415161718191a1b1c1d1e1f' +
             '202122232425262728292a2b2c2d2e2f' +
             '303132333435363738393a3b3c3d3e3f' +
             '404142434445464748494a4b4c4d4e4f' +
             '505152535455565758595a5b5c5d5e5f' +
             '606162636465666768696a6b6c6d6e6f' +
             '707172737475767778797a7b7c7d7e7f' +
             '808182838485868788898a8b8c8d8e8f' +
             '909192939495969798999a9b9c9d9e9f' +
             'a0a1a2a3a4a5a6a7a8a9aaabacadaeaf' +
             'b0b1b2b3b4b5b6b7b8b9babbbcbdbebf' +
             'c0c1c2c3c4c5c6c7c8c9cacbcccdcecf' +
             'd0d1d2d3d4d5d6d7d8d9dadbdcdddedf' +
             'e0e1e2e3e4e5e6e7e8e9eaebecedeeef' +
             'f0f1f2f3f4f5f6f7f8f9fafbfcfdfeff');

// console.log('Create buffer from hex string');
var hexb2 = new Buffer(hexStr, 'hex');
for (var i = 0; i < 256; i++) {
  t.equal(hexb2[i], hexb[i]);
}

// test an invalid slice end.
// console.log('Try to slice off the end of the buffer');
var b = new Buffer([1, 2, 3, 4, 5]);
var b2 = b.toString('hex', 1, 10000);
var b3 = b.toString('hex', 1, 5);
var b4 = b.toString('hex', 1);
t.equal(b2, b3);
t.equal(b2, b4);


function buildBuffer(data) {
  if (Array.isArray(data)) {
    var buffer = new Buffer(data.length);
    data.forEach(function(v, k) {
      buffer[k] = v;
    });
    return buffer;
  }
  return null;
}

var x = buildBuffer([0x81, 0xa3, 0x66, 0x6f, 0x6f, 0xa3, 0x62, 0x61, 0x72]);

// console.log(x.inspect());
t.equal('<Buffer 81 a3 66 6f 6f a3 62 61 72>', x.inspect());

var z = x.slice(4);
// console.log(z.inspect());
// console.log(z.length);
t.equal(5, z.length);
t.equal(0x6f, z[0]);
t.equal(0xa3, z[1]);
t.equal(0x62, z[2]);
t.equal(0x61, z[3]);
t.equal(0x72, z[4]);

var z = x.slice(0);
// console.log(z.inspect());
// console.log(z.length);
t.equal(z.length, x.length);

var z = x.slice(0, 4);
// console.log(z.inspect());
// console.log(z.length);
t.equal(4, z.length);
t.equal(0x81, z[0]);
t.equal(0xa3, z[1]);

var z = x.slice(0, 9);
// console.log(z.inspect());
// console.log(z.length);
t.equal(9, z.length);

var z = x.slice(1, 4);
// console.log(z.inspect());
// console.log(z.length);
t.equal(3, z.length);
t.equal(0xa3, z[0]);

var z = x.slice(2, 4);
// console.log(z.inspect());
// console.log(z.length);
t.equal(2, z.length);
t.equal(0x66, z[0]);
t.equal(0x6f, z[1]);

t.equal(0, Buffer('hello').slice(0, 0).length);

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  var b = new Buffer(10);
  b.write('あいうえお', encoding);
  t.equal(b.toString(encoding), 'あいうえお');
});

// Binary encoding should write only one byte per character.
var b = Buffer([0xde, 0xad, 0xbe, 0xef]);
var s = String.fromCharCode(0xffff);
b.write(s, 0, 'binary');
t.equal(0xff, b[0]);
t.equal(0xad, b[1]);
t.equal(0xbe, b[2]);
t.equal(0xef, b[3]);
s = String.fromCharCode(0xaaee);
b.write(s, 0, 'binary');
t.equal(0xee, b[0]);
t.equal(0xad, b[1]);
t.equal(0xbe, b[2]);
t.equal(0xef, b[3]);

// #1210 Test UTF-8 string includes null character
var buf = new Buffer('\0');
t.equal(buf.length, 1);
buf = new Buffer('\0\0');
t.equal(buf.length, 2);

buf = new Buffer(2);
var written = buf.write(''); // 0byte
t.equal(written, 0);
written = buf.write('\0'); // 1byte (v8 adds null terminator)
t.equal(written, 1);
written = buf.write('a\0'); // 1byte * 2
t.equal(written, 2);
written = buf.write('あ'); // 3bytes
t.equal(written, 0);
written = buf.write('\0あ'); // 1byte + 3bytes
t.equal(written, 1);
written = buf.write('\0\0あ'); // 1byte * 2 + 3bytes
t.equal(written, 2);

buf = new Buffer(10);
written = buf.write('あいう'); // 3bytes * 3 (v8 adds null terminator)
t.equal(written, 9);
written = buf.write('あいう\0'); // 3bytes * 3 + 1byte
t.equal(written, 10);

// #243 Test write() with maxLength
var buf = new Buffer(4);
buf.fill(0xFF);
var written = buf.write('abcd', 1, 2, 'utf8');
// console.log(buf);
t.equal(written, 2);
t.equal(buf[0], 0xFF);
t.equal(buf[1], 0x61);
t.equal(buf[2], 0x62);
t.equal(buf[3], 0xFF);

buf.fill(0xFF);
written = buf.write('abcd', 1, 4);
// console.log(buf);
t.equal(written, 3);
t.equal(buf[0], 0xFF);
t.equal(buf[1], 0x61);
t.equal(buf[2], 0x62);
t.equal(buf[3], 0x63);

buf.fill(0xFF);
written = buf.write('abcd', 'utf8', 1, 2);  // legacy style
// console.log(buf);
t.equal(written, 2);
t.equal(buf[0], 0xFF);
t.equal(buf[1], 0x61);
t.equal(buf[2], 0x62);
t.equal(buf[3], 0xFF);

buf.fill(0xFF);
written = buf.write('abcdef', 1, 2, 'hex');
// console.log(buf);
t.equal(written, 2);
t.equal(buf[0], 0xFF);
t.equal(buf[1], 0xAB);
t.equal(buf[2], 0xCD);
t.equal(buf[3], 0xFF);

['ucs2', 'ucs-2', 'utf16le', 'utf-16le'].forEach(function(encoding) {
  buf.fill(0xFF);
  written = buf.write('abcd', 0, 2, encoding);
//   console.log(buf);
  t.equal(written, 2);
  t.equal(buf[0], 0x61);
  t.equal(buf[1], 0x00);
  t.equal(buf[2], 0xFF);
  t.equal(buf[3], 0xFF);
});

// test offset returns are correct
var b = new Buffer(16);
t.equal(4, b.writeUInt32LE(0, 0));
t.equal(6, b.writeUInt16LE(0, 4));
t.equal(7, b.writeUInt8(0, 6));
t.equal(8, b.writeInt8(0, 7));
t.equal(16, b.writeDoubleLE(0, 8));

// test unmatched surrogates not producing invalid utf8 output
// ef bf bd = utf-8 representation of unicode replacement character
// see https://codereview.chromium.org/121173009/
buf = new Buffer('ab\ud800cd', 'utf8');
t.equal(buf[0], 0x61);
t.equal(buf[1], 0x62);
t.equal(buf[2], 0xef);
t.equal(buf[3], 0xbf);
t.equal(buf[4], 0xbd);
t.equal(buf[5], 0x63);
t.equal(buf[6], 0x64);

// test for buffer overrun
buf = new Buffer([0, 0, 0, 0, 0]); // length: 5
var sub = buf.slice(0, 4);         // length: 4
written = sub.write('12345', 'binary');
t.equal(written, 4);
t.equal(buf[4], 0);

// Check for fractional length args, junk length args, etc.
// https://github.com/joyent/node/issues/1758
Buffer(3.3).toString(); // throws bad argument error in commit 43cb4ec
t.equal(Buffer(-1).length, 0);
t.equal(Buffer(NaN).length, 0);
t.equal(Buffer(3.3).length, 3);
t.equal(Buffer({length: 3.3}).length, 3);
t.equal(Buffer({length: 'BAM'}).length, 0);

// Make sure that strings are not coerced to numbers.
t.equal(Buffer('99').length, 2);
t.equal(Buffer('13.37').length, 5);

// Ensure that the length argument is respected.
'ascii utf8 hex base64 binary'.split(' ').forEach(function(enc) {
  t.equal(Buffer(1).write('aaaaaa', 0, 1, enc), 1);
});

// Regression test, guard against buffer overrun in the base64 decoder.
var a = Buffer(3);
var b = Buffer('xxx');
a.write('aaaaaaaa', 'base64');
t.equal(b.toString(), 'xxx');

// issue GH-3416
Buffer(Buffer(0), 0, 0);

[ 'hex',
  'utf8',
  'utf-8',
  'ascii',
  'binary',
  'base64',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le' ].forEach(function(enc) {
    t.equal(Buffer.isEncoding(enc), true);
  });

[ 'utf9',
  'utf-7',
  'Unicode-FTW',
  'new gnu gun'  ].forEach(function(enc) {
    t.equal(Buffer.isEncoding(enc), false);
  });


// GH-5110
(function () {
  var buffer = new Buffer('test'),
      string = JSON.stringify(buffer);

  t.equal(string, '{"type":"Buffer","data":[116,101,115,116]}');

  t.deepEqual(buffer, JSON.parse(string, function(key, value) {
    return value && value.type === 'Buffer'
      ? new Buffer(value.data)
      : value;
  }));
})();

// issue GH-7849
(function() {
  var buf = new Buffer('test');
  var json = JSON.stringify(buf);
  var obj = JSON.parse(json);
  var copy = new Buffer(obj);

  t.ok(buf.equals(copy));
})();

// issue GH-4331
t.throws(function() {
  new Buffer(0xFFFFFFFF);
}, RangeError);
t.throws(function() {
  new Buffer(0xFFFFFFFFF);
}, RangeError);


// attempt to overflow buffers, similar to previous bug in array buffers
t.throws(function() {
  var buf = new Buffer(8);
  buf.readFloatLE(0xffffffff);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.writeFloatLE(0.0, 0xffffffff);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.readFloatLE(0xffffffff);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.writeFloatLE(0.0, 0xffffffff);
}, RangeError);


// ensure negative values can't get past offset
t.throws(function() {
  var buf = new Buffer(8);
  buf.readFloatLE(-1);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.writeFloatLE(0.0, -1);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.readFloatLE(-1);
}, RangeError);

t.throws(function() {
  var buf = new Buffer(8);
  buf.writeFloatLE(0.0, -1);
}, RangeError);

// offset checks
var buf = new Buffer(0);

t.throws(function() { buf.readUInt8(0); }, RangeError);
t.throws(function() { buf.readInt8(0); }, RangeError);

var buf = new Buffer([0xFF]);

t.equal(buf.readUInt8(0), 255);
t.equal(buf.readInt8(0), -1);

[16, 32].forEach(function(bits) {
  var buf = new Buffer(bits / 8 - 1);

  t.throws(function() { buf['readUInt' + bits + 'BE'](0); },
                RangeError,
                'readUInt' + bits + 'BE');

  t.throws(function() { buf['readUInt' + bits + 'LE'](0); },
                RangeError,
                'readUInt' + bits + 'LE');

  t.throws(function() { buf['readInt' + bits + 'BE'](0); },
                RangeError,
                'readInt' + bits + 'BE()');

  t.throws(function() { buf['readInt' + bits + 'LE'](0); },
                RangeError,
                'readInt' + bits + 'LE()');
});

[16, 32].forEach(function(bits) {
  var buf = new Buffer([0xFF, 0xFF, 0xFF, 0xFF]);

  t.equal(buf['readUInt' + bits + 'BE'](0),
                (0xFFFFFFFF >>> (32 - bits)));

  t.equal(buf['readUInt' + bits + 'LE'](0),
                (0xFFFFFFFF >>> (32 - bits)));

  t.equal(buf['readInt' + bits + 'BE'](0),
                (0xFFFFFFFF >> (32 - bits)));

  t.equal(buf['readInt' + bits + 'LE'](0),
                (0xFFFFFFFF >> (32 - bits)));
});

// test for common read(U)IntLE/BE
(function() {
  var buf = new Buffer([0x01, 0x02, 0x03, 0x04, 0x05, 0x06]);

  t.equal(buf.readUIntLE(0, 1), 0x01);
  t.equal(buf.readUIntBE(0, 1), 0x01);
  t.equal(buf.readUIntLE(0, 3), 0x030201);
  t.equal(buf.readUIntBE(0, 3), 0x010203);
  t.equal(buf.readUIntLE(0, 5), 0x0504030201);
  t.equal(buf.readUIntBE(0, 5), 0x0102030405);
  t.equal(buf.readUIntLE(0, 6), 0x060504030201);
  t.equal(buf.readUIntBE(0, 6), 0x010203040506);
  t.equal(buf.readIntLE(0, 1), 0x01);
  t.equal(buf.readIntBE(0, 1), 0x01);
  t.equal(buf.readIntLE(0, 3), 0x030201);
  t.equal(buf.readIntBE(0, 3), 0x010203);
  t.equal(buf.readIntLE(0, 5), 0x0504030201);
  t.equal(buf.readIntBE(0, 5), 0x0102030405);
  t.equal(buf.readIntLE(0, 6), 0x060504030201);
  t.equal(buf.readIntBE(0, 6), 0x010203040506);
})();

// test for common write(U)IntLE/BE
(function() {
  var buf = new Buffer(3);
  buf.writeUIntLE(0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  t.equal(buf.readUIntLE(0, 3), 0x123456);

  buf = new Buffer(3);
  buf.writeUIntBE(0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  t.equal(buf.readUIntBE(0, 3), 0x123456);

  buf = new Buffer(3);
  buf.writeIntLE(0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0x56, 0x34, 0x12]);
  t.equal(buf.readIntLE(0, 3), 0x123456);

  buf = new Buffer(3);
  buf.writeIntBE(0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0x12, 0x34, 0x56]);
  t.equal(buf.readIntBE(0, 3), 0x123456);

  buf = new Buffer(3);
  buf.writeIntLE(-0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0xaa, 0xcb, 0xed]);
  t.equal(buf.readIntLE(0, 3), -0x123456);

  buf = new Buffer(3);
  buf.writeIntBE(-0x123456, 0, 3);
  t.deepEqual(buf.toJSON().data, [0xed, 0xcb, 0xaa]);
  t.equal(buf.readIntBE(0, 3), -0x123456);

  buf = new Buffer(5);
  buf.writeUIntLE(0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  t.equal(buf.readUIntLE(0, 5), 0x1234567890);

  buf = new Buffer(5);
  buf.writeUIntBE(0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  t.equal(buf.readUIntBE(0, 5), 0x1234567890);

  buf = new Buffer(5);
  buf.writeIntLE(0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0x90, 0x78, 0x56, 0x34, 0x12]);
  t.equal(buf.readIntLE(0, 5), 0x1234567890);

  buf = new Buffer(5);
  buf.writeIntBE(0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0x12, 0x34, 0x56, 0x78, 0x90]);
  t.equal(buf.readIntBE(0, 5), 0x1234567890);

  buf = new Buffer(5);
  buf.writeIntLE(-0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0x70, 0x87, 0xa9, 0xcb, 0xed]);
  t.equal(buf.readIntLE(0, 5), -0x1234567890);

  buf = new Buffer(5);
  buf.writeIntBE(-0x1234567890, 0, 5);
  t.deepEqual(buf.toJSON().data, [0xed, 0xcb, 0xa9, 0x87, 0x70]);
  t.equal(buf.readIntBE(0, 5), -0x1234567890);
})();

// test Buffer slice
(function() {
  var buf = new Buffer('0123456789');
  t.equal(buf.slice(-10, 10).toString(), '0123456789');
  t.equal(buf.slice(-20, 10).toString(), '0123456789');
  t.equal(buf.slice(-20, -10).toString(), '');
  t.equal(buf.slice(0, -1).toString(), '012345678');
  t.equal(buf.slice(2, -2).toString(), '234567');
  t.equal(buf.slice(0, 65536).toString(), '0123456789');
  t.equal(buf.slice(65536, 0).toString(), '');
  for (var i = 0, s = buf.toString(); i < buf.length; ++i) {
    t.equal(buf.slice(-i).toString(), s.slice(-i));
    t.equal(buf.slice(0, -i).toString(), s.slice(0, -i));
  }
  // try to slice a zero length Buffer
  // see https://github.com/joyent/node/issues/5881
  SlowBuffer(0).slice(0, 1);
  // make sure a zero length slice doesn't set the .parent attribute
  t.equal(Buffer(5).slice(0,0).parent, undefined);
  // and make sure a proper slice does have a parent
  t.ok(typeof Buffer(5).slice(0, 5).parent === 'object');
})();

// Make sure byteLength properly checks for base64 padding
t.equal(Buffer.byteLength('aaa=', 'base64'), 2);
t.equal(Buffer.byteLength('aaaa==', 'base64'), 3);

// Regression test for #5482: should throw but not t in C++ land.
t.throws(function() {
  Buffer('', 'buffer');
}, TypeError);

// Regression test for #6111. Constructing a buffer from another buffer
// should a) work, and b) not corrupt the source buffer.
(function() {
  var a = [0];
  for (var i = 0; i < 7; ++i) a = a.concat(a);
  a = a.map(function(_, i) { return i });
  var b = Buffer(a);
  var c = Buffer(b);
  t.equal(b.length, a.length);
  t.equal(c.length, a.length);
  for (var i = 0, k = a.length; i < k; ++i) {
    t.equal(a[i], i);
    t.equal(b[i], i);
    t.equal(c[i], i);
  }
})();


t.throws(function () {
  new Buffer(smalloc.kMaxLength + 1);
}, RangeError);

t.throws(function () {
  new SlowBuffer(smalloc.kMaxLength + 1);
}, RangeError);

// Test truncation after decode
var crypto = require('crypto');

var b1 = new Buffer('YW55=======', 'base64');
var b2 = new Buffer('YW55', 'base64');

t.equal(
  1 /*crypto.createHash('sha1').update(b1).digest('hex')*/,
  1 /*crypto.createHash('sha1').update(b2).digest('hex')*/
);

// Test Compare
var b = new Buffer(1).fill('a');
var c = new Buffer(1).fill('c');
var d = new Buffer(2).fill('aa');

t.equal(b.compare(c), -1);
t.equal(c.compare(d), 1);
t.equal(d.compare(b), 1);
t.equal(b.compare(d), -1);

t.equal(Buffer.compare(b, c), -1);
t.equal(Buffer.compare(c, d), 1);
t.equal(Buffer.compare(d, b), 1);
t.equal(Buffer.compare(b, d), -1);

t.throws(function() {
  var b = new Buffer(1);
  Buffer.compare(b, 'abc');
});

t.throws(function() {
  var b = new Buffer(1);
  Buffer.compare('abc', b);
});

t.throws(function() {
  var b = new Buffer(1);
  b.compare('abc');
});

// Test Equals
var b = new Buffer(5).fill('abcdf');
var c = new Buffer(5).fill('abcdf');
var d = new Buffer(5).fill('abcde');
var e = new Buffer(6).fill('abcdef');

t.ok(b.equals(c));
t.ok(!c.equals(d));
t.ok(!d.equals(e));

t.throws(function() {
  var b = new Buffer(1);
  b.equals('abc');
});


t.end()
})