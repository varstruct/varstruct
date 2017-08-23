'use strict'
var randomBytes = require('crypto').randomBytes
var test = require('tape').test
var varstruct = require('../')

test('asserts on codec creation', function (t) {
  t.test('length must be a number', function (t) {
    t.throws(function () {
      varstruct.String()
    }, /^TypeError: length must be a number$/)
    t.end()
  })

  t.end()
})

test('Unknown encoding', function (t) {
  t.throws(function () {
    varstruct.String(14, 'h1')
  }, /^TypeError: invalid encoding$/)
  t.end()
})

test('encode', function (t) {
  t.test('value must be a string', function (t) {
    t.throws(function () {
      varstruct.String(42).encode(null)
    }, /^TypeError: value must be a string$/)
    t.end()
  })

  t.test('encoded value must not exceed length', function (t) {
    t.plan(4)
    t.throws(function () {
      varstruct.String(3).encode('foobar')
    }, /^RangeError: value.length is out of bounds/)

    t.throws(function () {
      varstruct.String(6).encode('foobar', 'not a buffer')
    }, /^TypeError: buffer must be a Buffer instance/)

    t.throws(function () {
      varstruct.String(6).encode('foobar', Buffer.alloc(3))
    }, /^RangeError: destination buffer is too small/)

    t.throws(function () {
      varstruct.String(6).encode('foobar', Buffer.alloc(6), 3)
    }, /^RangeError: destination buffer is too small/)
  })

  t.end()
})

test('encode/decode', function (t) {
  var encodings = [
    'base64',
    'binary',
    'hex'
  ]

  encodings.forEach(function (encoding) {
    t.test('encoding: ' + encoding, function (t) {
      var length = 42
      var s = randomBytes(length).toString(encoding)
      var fixedstring = varstruct.String(length, encoding)

      t.same(fixedstring.decode(fixedstring.encode(s)), s)
      t.end()
    })
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('should return length even if value is not string', function (t) {
    t.same(varstruct.String(42).encodingLength(null), 42)
    t.end()
  })

  t.end()
})
