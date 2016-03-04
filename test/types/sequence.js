'use strict'
var tap = require('tap')
var varstruct = require('../../')

var seq = varstruct.Sequence([
  varstruct.UInt64BE,
  varstruct.UInt32LE,
  varstruct.UInt16BE,
  varstruct.UInt8
])

tap.test('asserts on codec creation', function (t) {
  t.test('expected types as Array', function (t) {
    t.throws(function () {
      varstruct.Sequence(null)
    }, new TypeError('types must be an Array instance'))
    t.end()
  })

  t.test('type is null', function (t) {
    t.throws(function () {
      varstruct.Sequence([null])
    }, new TypeError('types Array has invalid codec'))
    t.end()
  })

  t.end()
})

tap.test('encode', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      seq.encode(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  t.test('value.length is out of bounds', function (t) {
    t.throws(function () {
      seq.encode(new Array(42))
    }, new RangeError('value.length is out of bounds'))
    t.end()
  })

  t.test('write buffers', function (t) {
    var items = [1, 2, 3, 4]
    var buf = seq.encode(items)
    t.same(seq.encode.bytes, 15)
    t.same(buf.toString('hex'), '000000000000000102000000000304')
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  t.test('read buffers', function (t) {
    var buf = new Buffer('000000000000000102000000000304', 'hex')
    t.same(seq.decode(buf), [1, 2, 3, 4])
    t.same(seq.decode.bytes, 15)
    t.end()
  })

  t.end()
})

tap.test('encodingLength', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      seq.encodingLength(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  t.test('value.length is out of bounds', function (t) {
    t.throws(function () {
      seq.encodingLength(new Array(42))
    }, new RangeError('value.length is out of bounds'))
    t.end()
  })

  t.test('should return correct length', function (t) {
    t.same(seq.encodingLength([0, 0, 0, 0]), 15) // 8 + 4 + 2 + 1
    t.end()
  })

  t.end()
})
