'use strict'
var tap = require('tap')
var varstruct = require('../../lib')

tap.test('type: Array', function (t) {
  var array42 = varstruct.Array(42, varstruct.Buffer(42))

  t.test('encode', function (t) {
    t.test('Expected 42-items Array, got 41-items Array', function (t) {
      t.throws(function () {
        array42.encode(new Array(41))
      }, new Error('Expected 42-items Array, got 41-items Array'))
      t.end()
    })

    t.test('destination buffer is too small', function (t) {
      t.throws(function () {
        array42.encode(new Array(42), new Buffer(4), 1)
      }, new Error('destination buffer is too small'))
      t.end()
    })

    t.end()
  })

  t.test('decode', function (t) {
    t.test('not enough data for decode', function (t) {
      t.throws(function () {
        array42.decode(new Buffer(4), 1)
      }, new Error('not enough data for decode'))
      t.end()
    })

    t.end()
  })

  t.test('length', function (t) {
    t.test('42 items', function (t) {
      t.same(array42.length(new Array(42)), 1768) // 4+ 42 * 42
      t.end()
    })

    t.end()
  })

  t.end()
})
