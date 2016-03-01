'use strict'
var tap = require('tap')
var util = require('../lib/util')

tap.test('newBuffer', function (t) {
  t.test('throw error for -1', function (t) {
    t.throws(function () {
      util.newBuffer(-1)
    }, new RangeError('buffer length should be in interval (0, 1073741823]'))
    t.end()
  })

  t.test('throw error for 1073741824', function (t) {
    t.throws(function () {
      util.newBuffer(1073741824)
    }, new RangeError('buffer length should be in interval (0, 1073741823]'))
    t.end()
  })

  t.test('return buffer with length 10 for argument equal 10', function (t) {
    var buffer = util.newBuffer(10)
    t.ok(Buffer.isBuffer(buffer))
    t.same(buffer.length, 10)
    t.end()
  })

  t.end()
})
