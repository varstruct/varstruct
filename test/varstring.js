'use strict'
var randomBytes = require('crypto').randomBytes
var test = require('tape').test
var varstruct = require('../')

test('asserts on codec creation', function (t) {
  t.test('lengthType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.VarString(null)
    }, /^TypeError: lengthType is invalid codec$/)
    t.end()
  })

  t.end()
})

test('Unknown encoding', function (t) {
  t.throws(function () {
    varstruct.VarString(varstruct.UInt32BE, 'h1')
  }, /^TypeError: invalid encoding$/)
  t.end()
})

test('encode', function (t) {
  t.test('value must be a string', function (t) {
    t.throws(function () {
      varstruct.VarString(varstruct.UInt32BE).encode(null)
    }, /^TypeError: value must be a string$/)
    t.end()
  })

  t.end()
})

test('encode/decode', function (t) {
  var encodings = [
    'utf8',
    'utf16le',
    'base64',
    'binary',
    'hex'
  ]

  encodings.forEach(function (encoding) {
    t.test('encoding: ' + encoding, function (t) {
      var s = randomBytes(1000).toString(encoding)
      var varstring = varstruct.VarString(varstruct.UInt32BE, encoding)
      t.same(varstring.decode(varstring.encode(s)), s)
      t.same(varstring.encode.bytes, 4 + Buffer.byteLength(s, encoding))
      t.same(varstring.decode.bytes, 4 + Buffer.byteLength(s, encoding))
      t.end()
    })
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('value must be a string', function (t) {
    t.throws(function () {
      varstruct.VarString(varstruct.UInt32BE).encodingLength(null)
    }, /^TypeError: value must be a string$/)
    t.end()
  })

  t.end()
})
