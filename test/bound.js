'use strict'
var test = require('tape').test
var varstruct = require('../')

function bits12 (value) {
  if (value > 4095 || value < -4096) throw new Error('Answer 42!')
}

var Int12BitsBE = varstruct.Bound(varstruct.Int16BE, bits12)

test('asserts on codec creation', function (t) {
  t.test('itemType is invalid codec', function (t) {
    t.throws(function () {
      varstruct.Bound(1)
    }, /^TypeError: itemType is invalid codec$/)
    t.end()
  })

  t.test('checkValue must be a function', function (t) {
    t.throws(function () {
      varstruct.Bound(varstruct.Byte)
    }, /^TypeError: checkValue must be a function$/)
    t.end()
  })

  t.end()
})

test('encode', function (t) {
  t.test('encode 42', function (t) {
    t.same(Int12BitsBE.encode(42).toString('hex'), '002a')
    t.same(Int12BitsBE.encode.bytes, 2)
    t.end()
  })

  t.test('throw on value equal 4096', function (t) {
    t.throws(function () {
      Int12BitsBE.encode(4096)
    }, /^Error: Answer 42!$/)
    t.end()
  })

  t.end()
})

test('decode', function (t) {
  t.test('decode 002a', function (t) {
    t.same(Int12BitsBE.decode(Buffer.from('002a', 'hex')), 42)
    t.same(Int12BitsBE.decode.bytes, 2)
    t.end()
  })

  t.test('throw on value equal -4097', function (t) {
    t.throws(function () {
      Int12BitsBE.decode(Buffer.from([0x00, 0xef, 0xff]), 1)
    }, /^Error: Answer 42!$/)
    t.end()
  })

  t.end()
})

test('encodingLength', function (t) {
  t.test('should be Number equal 2', function (t) {
    t.same(Int12BitsBE.encodingLength(124), 2)
    t.end()
  })

  t.end()
})
