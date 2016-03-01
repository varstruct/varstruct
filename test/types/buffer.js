'use strict'
var tap = require('tap')
var varstruct = require('../../lib')

tap.test('type: Buffer', function (t) {
  var buffer42 = varstruct.Buffer(42)

  t.test('encode', function (t) {
    t.test('buffer length for encode less than required', function (t) {
      t.throws(function () {
        buffer42.encode(new Buffer(41))
      }, new Error('Expected 42-byte Buffer, got 41-byte Buffer'))
      t.end()
    })

    t.test('buffer length for encode more than required', function (t) {
      t.throws(function () {
        buffer42.encode(new Buffer(43))
      }, new Error('Expected 42-byte Buffer, got 43-byte Buffer'))
      t.end()
    })

    t.test('return new buffer', function (t) {
      var buf1 = new Buffer(42)
      var buf2 = new Buffer(buf1)
      var encoded = buffer42.encode(buf1)
      t.same(buffer42.encode.bytes, 42)
      t.same(encoded.toString('hex'), buf1.toString('hex'))
      for (var i = 0; i < buf1.length; ++i) buf1[i] += 42
      t.same(encoded.toString('hex'), buf2.toString('hex'))
      t.end()
    })

    t.test('buffer length is not enough', function (t) {
      t.throws(function () {
        buffer42.encode(new Buffer(42), new Buffer(42), 1)
      }, new Error('destination buffer is too small'))
      t.end()
    })

    t.test('copy buffer', function (t) {
      var buf1 = new Buffer(42)
      var buf2 = new Buffer(42)
      t.ok(buffer42.encode(buf1, buf2) === buf2)
      t.same(buffer42.encode.bytes, 42)
      t.same(buf2.toString('hex'), buf1.toString('hex'))
      t.end()
    })

    t.test('copy buffer with offset', function (t) {
      var buf1 = new Buffer(42)
      var buf2 = new Buffer(43)
      var first = buf2[0]
      t.ok(buffer42.encode(buf1, buf2, 1) === buf2)
      t.same(buffer42.encode.bytes, 42)
      t.same(first, buf2[0])
      t.same(buf2.slice(1).toString('hex'), buf1.toString('hex'))
      t.end()
    })

    t.end()
  })

  t.test('decode', function (t) {
    t.test('not data enough for decode', function (t) {
      t.throws(function () {
        buffer42.decode(new Buffer(9))
      }, new Error('not enough data for decode'))
      t.end()
    })

    t.test('offset is zero', function (t) {
      var buf1 = new Buffer(42)
      var buf2 = new Buffer(buf1)
      var decoded = buffer42.decode(buf1)
      t.same(buffer42.decode.bytes, 42)
      t.same(decoded.toString('hex'), buf1.toString('hex'))
      for (var i = 0; i < buf1.length; ++i) buf1[i] += 42
      t.same(decoded.toString('hex'), buf2.toString('hex'))
      t.end()
    })

    t.test('offset is not zero', function (t) {
      var buf1 = new Buffer(43)
      var buf2 = new Buffer(buf1.slice(1))
      var decoded = buffer42.decode(buf1, 1)
      t.same(buffer42.decode.bytes, 42)
      t.same(decoded.toString('hex'), buf2.toString('hex'))
      for (var i = 0; i < buf1.length; ++i) buf1[i] += 42
      t.same(decoded.toString('hex'), buf2.toString('hex'))
      t.end()
    })

    t.end()
  })

  t.test('length', function (t) {
    t.test('should be static', function (t) {
      t.same(buffer42.length, 42)
      t.end()
    })

    t.end()
  })

  t.end()
})
