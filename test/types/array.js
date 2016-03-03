'use strict'
var tap = require('tap')
var varstruct = require('../../')

var array42 = varstruct.Array(42, varstruct.Buffer(42))

tap.test('encode', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      array42.encode(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  t.test('value.length is out of bounds', function (t) {
    t.throws(function () {
      array42.encode(new Array(41))
    }, new RangeError('value.length is out of bounds'))
    t.end()
  })

  t.test('value must be a Buffer instance #1', function (t) {
    t.throws(function () {
      array42.encode(new Array(42), new Buffer(3))
    }, new TypeError('value must be a Buffer instance'))
    t.end()
  })

  t.test('value must be a Buffer instance #2', function (t) {
    t.throws(function () {
      array42.encode(new Array(42), undefined, 1765)
    }, new TypeError('value must be a Buffer instance'))
    t.end()
  })

  t.test('write buffers', function (t) {
    var buffers = new Array(42)
    for (var i = 0; i < buffers.length; ++i) buffers[i] = new Buffer(42)
    var buf = array42.encode(buffers)
    t.same(array42.encode.bytes, 1764)
    t.same(buf.toString('hex'), Buffer.concat(buffers).toString('hex'))
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  t.test('not enough data for decode #1', function (t) {
    t.throws(function () {
      array42.decode(new Buffer(1763))
    }, new RangeError('not enough data for decode'))
    t.end()
  })

  t.test('not enough data for decode #2', function (t) {
    t.throws(function () {
      array42.decode(new Buffer(1764), 1)
    }, new RangeError('not enough data for decode'))
    t.end()
  })

  t.test('read buffers', function (t) {
    var buf = new Buffer(1764)
    var buffers = array42.decode(buf)
    t.plan(43)
    t.same(array42.decode.bytes, 1764)
    for (var i = 0, offset = 0; i < buffers.length; ++i, offset += 42) {
      t.same(buffers[i].toString('hex'), buf.slice(offset, offset + 42).toString('hex'))
    }
    t.end()
  })

  t.end()
})

tap.test('length', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      array42.encodingLength(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  t.test('value.length is out of bounds', function (t) {
    t.throws(function () {
      array42.encodingLength(new Array(41))
    }, new RangeError('value.length is out of bounds'))
    t.end()
  })

  t.test('varstruct.Array(42, varstruct.Buffer(42)) length is 1764', function (t) {
    t.same(array42.encodingLength(new Array(42)), 1764) // 42 * 42
    t.end()
  })

  t.end()
})
