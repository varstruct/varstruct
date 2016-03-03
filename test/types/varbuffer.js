'use strict'
var tap = require('tap')
var varstruct = require('../../')

var varbuffer = varstruct.VarBuffer(varstruct.UInt32BE)

tap.test('encode', function (t) {
  t.test('value must be a Buffer instance', function (t) {
    t.throws(function () {
      varbuffer.encode(null)
    }, new TypeError('value must be a Buffer instance'))
    t.end()
  })

  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      varbuffer.encode(new Buffer(42), undefined, 1)
    }, new RangeError('destination buffer is too small'))
    t.end()
  })

  t.test('write buffer', function (t) {
    var buf = new Buffer(42)
    var result = varbuffer.encode(buf)
    t.same(varbuffer.encode.bytes, 46)
    t.same(result.slice(0, 4).toString('hex'), '0000002a')
    t.same(result.slice(4).toString('hex'), buf.toString('hex'))
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  var buf = new Buffer(46)
  buf.writeUInt32BE(42, 0)

  t.test('not enough data for decode', function (t) {
    t.throws(function () {
      varbuffer.decode(Buffer.concat([Buffer([0x00]), buf.slice(0, 45)]), 1)
    }, new RangeError('not enough data for decode'))
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

tap.test('encodingLength', function (t) {
  t.test('value must be a Buffer instance', function (t) {
    t.throws(function () {
      varbuffer.encodingLength(null)
    }, new TypeError('value must be a Buffer instance'))
    t.end()
  })

  t.test('length for new Buffer(42)', function (t) {
    t.same(varbuffer.encodingLength(new Buffer(42)), 46) // 4 + 42
    t.end()
  })

  t.end()
})
