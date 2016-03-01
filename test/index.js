'use strict'
var tap = require('tap')
var varstruct = require('../lib')

function noop () {}
var length42 = {
  name: 'length42',
  type: { encode: noop, decode: noop, encodingLength: function () { return 42 } }
}

tap.test('encode', function (t) {
  t.test('buffer length should be in interval (0, 1073741823]', function (t) {
    var struct = varstruct([{
      name: 'Infinity',
      type: { encode: noop, decode: noop, encodingLength: function () { return Infinity } }
    }])
    t.throws(function () {
      struct.encode({})
    }, new RangeError('buffer length should be in interval (0, 1073741823]'))
    t.end()
  })

  t.end()
})

tap.test('decode', function (t) {
  t.end()
})

tap.test('length', function (t) {
  t.test('return valid number', function (t) {
    var struct = varstruct([length42, length42])
    t.same(typeof struct.encodingLength, 'function')
    t.same(struct.encodingLength({}), 84)
    t.end()
  })

  t.test('varstruct copy items', function (t) {
    var items = [length42, length42]
    var struct = varstruct(items)
    items.push(length42)
    t.same(struct.encodingLength({}), 84)
    t.end()
  })

  t.end()
})
