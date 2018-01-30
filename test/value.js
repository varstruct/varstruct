'use strict'
var Buffer = require('safe-buffer').Buffer
var test = require('tape').test
var varstruct = require('../')
var value = varstruct.Value(varstruct.UInt32BE, 0xdeadbeef)

test('asserts on codec creation', function (t) {
  t.test('valueType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.Value(null)
    }, /^TypeError: valueType is invalid codec$/)
    t.end()
  })

  t.end()
})

test('encode', function (t) {
  t.test('value must be undefined', function (t) {
    t.throws(function () {
      value.encode(null)
    }, /^TypeError: Value parameter must be undefined/)
    t.end()
  })

  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      value.encode(undefined, Buffer.allocUnsafe(3))
    }, /^RangeError: destination buffer is too small$/)
    t.end()
  })

  t.test('write buffer', function (t) {
    var result = value.encode()
    t.same(value.encode.bytes, 4)
    t.same(result.toString('hex'), 'deadbeef')

    var buf = Buffer.allocUnsafe(4)
    value.encode(undefined, buf)
    t.same(value.encode.bytes, 4)
    t.same(buf.toString('hex'), 'deadbeef')

    t.end()
  })

  t.end()
})

test('decode', function (t) {
  t.test('not enough data for decode', function (t) {
    t.throws(function () {
      value.decode(Buffer.from('deadbe', 'hex'))
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('extra data for decode', function (t) {
    value.decode(Buffer.from('deadbeefffff', 'hex'))
    t.end()
  })

  t.test('(Un)expected value', function (t) {
    t.throws(function () {
      value.decode(Buffer.from('deadbeeeeeff', 'hex'))
    }, /^TypeError: Expected value 3735928559$/)
    t.end()
  })

  t.test('not enough data for decode (w/ offset and end)', function (t) {
    t.throws(function () {
      value.decode(Buffer.from('ffffdeadbeef', 'hex'), 2, 4)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('read buffers', function (t) {
    var result = value.decode(Buffer.from('deadbeef', 'hex'))
    t.same(value.decode.bytes, 4)
    t.same(result, 0xdeadbeef)
    t.end()
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('value must be undefined', function (t) {
    t.throws(function () {
      value.encodingLength(null)
    }, /^TypeError: Value parameter must be undefined/)
    t.end()
  })

  t.test('constant length', function (t) {
    t.same(value.encodingLength(), 4)
    t.end()
  })

  t.end()
})
