var B = require('../index.js').Buffer;
var test = require('tap').test;

test("indexes from a string", function(t) {
    t.plan(3);
    var buf = new B('abc');
    t.equal(buf[0], 97);
    t.equal(buf[1], 98);
    t.equal(buf[2], 99);
});

test("indexes from an array", function(t) {
    t.plan(3);
    var buf = new B([ 97, 98, 99 ]);
    t.equal(buf[0], 97);
    t.equal(buf[1], 98);
    t.equal(buf[2], 99);
});
