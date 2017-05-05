'use strict'
var test = require('tape').test
var varstruct = require('../')
var example = varstruct([
  ['number', varstruct.UInt8],
  ['foobar', varstruct.Buffer(8)]
])

function noop () {}

test('asserts on codec creation', function (t) {
  t.test('expected items as Array', function (t) {
    t.throws(function () {
      varstruct(null)
    }, /^TypeError: items must be an Array instance$/)
    t.end()
  })

  t.test('missing "name" property', function (t) {
    t.throws(function () {
      varstruct([{ foo: 'bar' }])
    }, /^TypeError: item missing "name" property/)
    t.end()
  })

  t.test('type is null', function (t) {
    t.throws(function () {
      varstruct([{ name: 'foo', type: null }])
    }, /^TypeError: item "foo" has invalid codec/)
    t.end()
  })

  t.test('type encode should be function', function (t) {
    t.throws(function () {
      varstruct([{
        name: 'foo',
        type: { encode: null, decode: noop, encodingLength: noop }
      }])
    }, /^TypeError: item "foo" has invalid codec/)
    t.end()
  })

  t.test('type decode should be function', function (t) {
    t.throws(function () {
      varstruct([{
        name: 'foo',
        type: { encode: noop, decode: null, encodingLength: noop }
      }])
    }, /^TypeError: item "foo" has invalid codec/)
    t.end()
  })

  t.test('type encodingLength should be function', function (t) {
    t.throws(function () {
      varstruct([{
        name: 'foo',
        type: { encode: noop, decode: noop, encodingLength: null }
      }])
    }, /^TypeError: item "foo" has invalid codec/)
    t.end()
  })

  t.end()
})

test('encode', function (t) {
  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      example.encode({
        'number': 0xfe,
        'foobar': Buffer.alloc(8)
      }, Buffer.allocUnsafe(3))
    }, /^RangeError: destination buffer is too small$/)
    t.end()
  })

  t.test('write buffer', function (t) {
    var result = example.encode({
      'number': 0xfe,
      'foobar': Buffer.alloc(8)
    })

    t.same(example.encode.bytes, 9)
    t.same(result.toString('hex'), 'fe0000000000000000')

    result.fill(0)
    example.encode({
      'number': 0xfe,
      'foobar': Buffer.alloc(8)
    }, result, 0)
    t.same(result.toString('hex'), 'fe0000000000000000')

    // offset > 0 case
    result = Buffer.alloc(19)
    example.encode({
      'number': 0xfe,
      'foobar': Buffer.alloc(8)
    }, result, 10)
    t.same(result.slice(10).toString('hex'), 'fe0000000000000000')

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
    example.decode(Buffer.from('fe0000000000000000ffffffffff', 'hex'))
    t.end()
  })

  t.test('decode (w/ offset)', function (t) {
    var result = example.decode(Buffer.from('fffffe0000000000000000', 'hex'), 2)
    t.same(result, {
      'number': 0xfe,
      'foobar': Buffer.alloc(8)
    })
    t.end()
  })

  t.test('not enough data for decode (w/ offset and end)', function (t) {
    t.throws(function () {
      example.decode(Buffer.from('fe0000000000000000', 'hex'), 2, 4)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('read buffers', function (t) {
    var result = example.decode(Buffer.from('fe0000000000000000', 'hex'))
    t.same(example.decode.bytes, 9)
    t.same(result, {
      'number': 0xfe,
      'foobar': Buffer.alloc(8)
    })
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
