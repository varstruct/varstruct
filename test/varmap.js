'use strict'
var test = require('tape').test
var varstruct = require('../')
var example = varstruct.VarMap(varstruct.UInt8, varstruct.String(4), varstruct.UInt8)

test('asserts on codec creation', function (t) {
  t.plan(3)

  t.test('lengthType is invalid codec', function (t) {
    t.plan(1)
    t.throws(function () {
      varstruct.VarMap(null)
    }, /^TypeError: lengthType is invalid codec$/)
  })

  t.test('keyType is invalid codec', function (t) {
    t.plan(1)
    t.throws(function () {
      varstruct.VarMap(varstruct.UInt8, null)
    }, /^TypeError: keyType is invalid codec$/)
  })

  t.test('valueType is invalid codec', function (t) {
    t.plan(1)
    t.throws(function () {
      varstruct.VarMap(varstruct.UInt8, varstruct.UInt8, null)
    }, /^TypeError: valueType is invalid codec$/)
  })
})

test('encode', function (t) {
  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      example.encode({
        'food': 0
      }, Buffer.allocUnsafe(3))
    }, /^RangeError: destination buffer is too small$/)
    t.end()
  })

  t.test('write buffer (empty)', function (t) {
    var result = example.encode({})
    t.same(example.encode.bytes, 1)
    t.same(result.toString('hex'), '00')
    t.end()
  })

  t.test('write buffer', function (t) {
    var result = example.encode({
      'food': 0,
      'cafe': 1,
      'four': 5
    })
    t.same(example.encode.bytes, 16)
    // 03 | (food | 00) | (cafe | 01) | (four | 05)
    t.same(result.toString('hex'), '03666f6f64006361666501666f757205')

    result.fill(0)
    example.encode({
      'food': 0,
      'cafe': 1,
      'four': 5
    }, result, 0)
    t.same(result.toString('hex'), '03666f6f64006361666501666f757205')

    // offset > 0 case
    result.fill(0)
    example.encode({
      'food': 0
    }, result, 10)
    t.same(result.slice(10).toString('hex'), '01666f6f6400')

    t.end()
  })

  t.test('invalid key', function (t) {
    t.throws(function () {
      example.encode({
        'booooooooo': 0
      })
    }, /^RangeError: value.length is out of bounds$/)
    t.end()
  })

  t.end()
})

test('decode', function (t) {
  t.test('not enough data for decode', function (t) {
    t.throws(function () {
      example.decode(Buffer.from('deadbe', 'hex'))
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('extra data for decode', function (t) {
    example.decode(Buffer.from('016667686902ffff', 'hex'))
    t.end()
  })

  t.test('enough data for decode, but restricted via end', function (t) {
    t.throws(function () {
      example.decode(Buffer.from('016667686902', 'hex'), 0, 4)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('not enough data for decode (w/ offset and end)', function (t) {
    t.throws(function () {
      example.decode(Buffer.from('016667686902', 'hex'), 2, 4)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('read buffers', function (t) {
    var result = example.decode(Buffer.from('016667686902', 'hex'))
    t.same(example.decode.bytes, 6)
    t.same(result, {
      'fghi': 2
    })
    t.end()
  })

  t.test('read/write buffer with non-string keyCodec', function (t) {
    var type = varstruct.VarMap(varstruct.UInt8, varstruct.UInt8, varstruct.UInt8)
    var result = type.decode(Buffer.from('011502', 'hex'))
    t.same(type.decode.bytes, 3)
    t.same(result, {
      '21': 2
    })

    t.throws(function () {
      t.same(type.encode({
        '21': 2
      }).toString('hex'), '011502')
    }, /TypeError: value must be a number/)

    t.end()
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('value must not be undefined', function (t) {
    t.throws(function () {
      example.encodingLength(null)
    }, /^TypeError: Expected object/)
    t.end()
  })

  t.end()
})
