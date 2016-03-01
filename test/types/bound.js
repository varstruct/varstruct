'use strict'
var tap = require('tap')
var varstruct = require('../../lib')

tap.test('type: Bound', function (t) {
  var Int12BitsBE = varstruct.Bound(varstruct.Int16BE, function (value) {
    if (value > 4095 || value < -4096) throw new Error('Answer 42!')
  })

  t.test('encode', function (t) {
    t.test('throw on value equal 4096', function (t) {
      t.throws(function () {
        Int12BitsBE.encode(4096)
      }, new Error('Answer 42!'))
      t.end()
    })

    t.end()
  })

  t.test('decode', function (t) {
    t.test('throw on value equal -4097', function (t) {
      t.throws(function () {
        Int12BitsBE.decode(new Buffer([0x00, 0xef, 0xff]), 1)
      }, new Error('Answer 42!'))
      t.end()
    })

    t.end()
  })

  t.test('length', function (t) {
    t.test('should be Number equal 2', function (t) {
      t.same(Int12BitsBE.length, 2)
      t.end()
    })

    t.end()
  })

  t.end()
})
