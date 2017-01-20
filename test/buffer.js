'use strict'
var test = require('tape').test
var varstruct = require('../')

var buffer42 = varstruct.Buffer(42)

test('asserts on codec creation', function (t) {
  t.test('length must be a number', function (t) {
    t.throws(function () {
      varstruct.Buffer()
    }, /^TypeError: length must be a number$/)
    t.end()
  })

  t.end()
})

test('encode', function (t) {
  t.test('value must be a Buffer instance', function (t) {
    t.throws(function () {
      buffer42.encode(new Array(42))
    }, /^TypeError: value must be a Buffer instance$/)
    t.end()
  })

  t.test('value.length is out of bounds', function (t) {
    t.throws(function () {
      buffer42.encode(new Buffer(41))
    }, /^RangeError: value.length is out of bounds$/)
    t.end()
  })

  t.test('return buffer copy', function (t) {
    var buf1 = new Buffer(42)
    var buf2 = buffer42.encode(buf1)
    t.same(buffer42.encode.bytes, 42)
    t.same(buf1.toString('hex'), buf2.toString('hex'))
    t.end()
  })

  t.test('destination buffer is too small', function (t) {
    t.throws(function () {
      buffer42.encode(new Buffer(42), new Buffer(42), 1)
    }, /^RangeError: destination buffer is too small$/)
    t.end()
  })

  t.test('write value to buffer', function (t) {
    var buf1 = new Buffer(42)
    var buf2 = new Buffer(42)
    t.true(buffer42.encode(buf1, buf2) === buf2)
    t.same(buffer42.encode.bytes, 42)
    t.same(buf1.toString('hex'), buf2.toString('hex'))
    t.end()
  })

  t.end()
})

test('decode', function (t) {
  t.test('not enough data for decode', function (t) {
    t.throws(function () {
      buffer42.decode(new Buffer(42), 1)
    }, /^RangeError: not enough data for decode$/)
    t.end()
  })

  t.test('read value from buffer', function (t) {
    var buf1 = new Buffer(42)
    var buf2 = buffer42.decode(buf1)
    t.same(buffer42.decode.bytes, 42)
    t.same(buf1.toString('hex'), buf2.toString('hex'))
    t.end()
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('should be length', function (t) {
    t.same(varstruct.Buffer(42).encodingLength(), 42)
    t.end()
  })

  t.end()
})
