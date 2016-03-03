'use strict'
var tap = require('tap')
var varstruct = require('../../')

function bits12 (value) {
  if (value > 4095 || value < -4096) throw new Error('Answer 42!')
}

var Int12BitsBE = varstruct.Bound(varstruct.Int16BE, bits12)

tap.test('encode', function (t) {
  t.test('encode 42', function (t) {
    t.same(Int12BitsBE.encode(42).toString('hex'), '002a')
    t.same(Int12BitsBE.encode.bytes, 2)
    t.end()
  })

  t.test('throw on value equal 4096', function (t) {
    t.throws(function () {
      Int12BitsBE.encode(4096)
    }, new Error('Answer 42!'))
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  t.test('decode 002a', function (t) {
    t.same(Int12BitsBE.decode(new Buffer('002a', 'hex')), 42)
    t.same(Int12BitsBE.decode.bytes, 2)
    t.end()
  })

  t.test('throw on value equal -4097', function (t) {
    t.throws(function () {
      Int12BitsBE.decode(new Buffer([0x00, 0xef, 0xff]), 1)
    }, new Error('Answer 42!'))
    t.end()
  })

  t.end()
})

tap.test('length', function (t) {
  t.test('should be Number equal 2', function (t) {
    t.same(Int12BitsBE.encodingLength(124), 2)
    t.end()
  })

  t.end()
})
