'use strict'
var tap = require('tap')
var varstruct = require('../../')

var vararray = varstruct.VarArray(varstruct.UInt32BE, varstruct.Buffer(42))

tap.test('asserts on codec creation', function (t) {
  t.test('lengthType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.VarArray(null)
    }, new TypeError('lengthType is invalid codec'))
    t.end()
  })

  t.test('itemType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.VarArray(varstruct.UInt32BE)
    }, new TypeError('itemType is invalid codec'))
    t.end()
  })

  t.end()
})

tap.test('encode', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      vararray.encode(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  var expectedError = new RangeError('index out of range')
  if (process.version.split('.').slice(0, 2).join('') === 'v010') {
    expectedError = new RangeError('Trying to write outside buffer length')
  }

  t.test('index out of range #1', function (t) {
    t.throws(function () {
      vararray.encode(new Array(42), new Buffer(3))
    }, expectedError)
    t.end()
  })

  t.test('index out of range #2', function (t) {
    t.throws(function () {
      vararray.encode(new Array(42), undefined, 1765)
    }, expectedError)
    t.end()
  })

  t.test('write buffers', function (t) {
    var buffers = new Array(42)
    for (var i = 0; i < buffers.length; ++i) buffers[i] = new Buffer(42)
    var buf = vararray.encode(buffers)
    t.same(vararray.encode.bytes, 1768)
    t.same(buf.slice(0, 4).toString('hex'), '0000002a')
    t.same(buf.slice(4).toString('hex'), Buffer.concat(buffers).toString('hex'))
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  var buf = new Buffer(1768)
  buf.writeUInt32BE(42, 0)

  t.test('not enough data for decode #1', function (t) {
    t.throws(function () {
      vararray.decode(buf.slice(1))
    }, new RangeError('not enough data for decode'))
    t.end()
  })

  t.test('not enough data for decode #2', function (t) {
    t.throws(function () {
      vararray.decode(buf, 1)
    }, new RangeError('not enough data for decode'))
    t.end()
  })

  t.test('read buffers', function (t) {
    var buffers = vararray.decode(buf)
    t.plan(43)
    t.same(vararray.decode.bytes, 1768)
    for (var i = 0, offset = 4; i < buffers.length; ++i, offset += 42) {
      t.same(buffers[i].toString('hex'), buf.slice(offset, offset + 42).toString('hex'))
    }
    t.end()
  })

  t.end()
})

tap.test('encodingLength', function (t) {
  t.test('value must be an Array instance', function (t) {
    t.throws(function () {
      vararray.encodingLength(null)
    }, new TypeError('value must be an Array instance'))
    t.end()
  })

  t.test('length for 42 items', function (t) {
    t.same(vararray.encodingLength(new Array(42)), 1768) // 4 + 42 * 42
    t.end()
  })

  t.end()
})
