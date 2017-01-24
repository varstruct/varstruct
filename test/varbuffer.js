'use strict'
var test = require('tape').test
var varstruct = require('../')

var varbuffer = varstruct.VarBuffer(varstruct.UInt32BE)

test('asserts on codec creation', function (t) {
  t.test('lengthType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.VarBuffer(null)
    }, /^TypeError: lengthType is invalid codec$/)
    t.end()
  })

  t.end()
})

test('encode', function (t) {
  t.test('value must be a Buffer instance', function (t) {
    t.throws(function () {
      varbuffer.encode(null)
    }, /^TypeError: value must be a Buffer instance$/)
    t.end()
  })

  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      varbuffer.encode(Buffer.allocUnsafe(42), Buffer.allocUnsafe(41))
    }, /^RangeError: destination buffer is too small$/)
    t.end()
  })

  t.test('write buffer', function (t) {
    var buf = Buffer.allocUnsafe(42)
    var result = varbuffer.encode(buf)
    t.same(varbuffer.encode.bytes, 46)
    t.same(result.slice(0, 4).toString('hex'), '0000002a')
    t.same(result.slice(4).toString('hex'), buf.toString('hex'))
    t.end()
  })

  t.end()
})

test('decode', function (t) {
  var buf = Buffer.allocUnsafe(46)
  buf.writeUInt32BE(42, 0)

  t.test('not enough data for decode', function (t) {
    t.throws(function () {
      varbuffer.decode(Buffer.concat([Buffer.from([0x00]), buf.slice(0, 45)]), 1)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('read buffers', function (t) {
    var result = varbuffer.decode(buf)
    t.same(varbuffer.decode.bytes, 46)
    t.same(result.toString('hex'), buf.slice(4).toString('hex'))
    t.end()
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('value must be a Buffer instance', function (t) {
    t.throws(function () {
      varbuffer.encodingLength(null)
    }, /^TypeError: value must be a Buffer instance$/)
    t.end()
  })

  t.test('length for Buffer.allocUnsafe(42)', function (t) {
    t.same(varbuffer.encodingLength(Buffer.allocUnsafe(42)), 46) // 4 + 42
    t.end()
  })

  t.end()
})
