'use strict'
var tap = require('tap')
var varstruct = require('../lib')

tap.test('varstruct', function (t) {
  function noop () {}
  var length42 = {
    name: 'length42',
    type: { encode: noop, decode: noop, length: 42 }
  }
  var length42fn = {
    name: 'length42fn',
    type: { encode: noop, decode: noop, length: function () { return 42 } }
  }

  t.test('encode', function (t) {
    t.test('buffer length should be in interval (0, 1073741823]', function (t) {
      var struct = varstruct([{
        name: 'Infinity',
        type: { encode: noop, decode: noop, length: function () { return Infinity } }
      }])
      t.throws(function () {
        struct.encode({})
      }, new Error('buffer length should be in interval (0, 1073741823]'))
      t.end()
    })

    t.end()
  })

  t.test('decode', function (t) {
    t.end()
  })

  t.test('length', function (t) {
    t.test('length property as number', function (t) {
      var struct = varstruct([length42, length42])
      t.same(struct.length, 84)
      t.end()
    })

    t.test('length property as function', function (t) {
      var struct = varstruct([length42, length42fn])
      t.same(typeof struct.length, 'function')
      t.same(struct.length({}), 84)
      t.end()
    })

    t.test('varstruct copy items', function (t) {
      var items = [length42, length42fn]
      var struct = varstruct(items)
      items.push(length42)
      t.same(struct.length({}), 84)
      t.end()
    })

    t.end()
  })

  t.test('bitcoin transaction', function (t) {
    t.end()
  })

  t.end()
})
