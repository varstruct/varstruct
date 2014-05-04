var tape = require('tape')
var crypto = require('crypto')
var b = require('../')

tape('simple', function (t) {

  var byte = b.int8
  var double = b.doubleBE

  t.equal(byte.decode(byte.encode(9)), 9)
  var r = Math.random()
  t.equal(double.decode(double.encode(r)), r)
  t.end()
})

tape('vector', function (t) {
  var double = b.doubleBE

  var vector = b({
    x: double,
    y: double,
    z: double
  })

  var v = {x: 1, y: 2, z: 3}
  var buffer = vector.encode(v)
  console.log(buffer)
  t.equal(buffer.length, vector.length)
  t.deepEqual(vector.decode(buffer), v)
  t.end()
})

tape('buffer', function (t) {

  var sha256 = b.array(32) //a fixed length buffer

  var message = b({
    num : b.int8,
    hash: sha256
  })

  t.equal(message.length, 33)

  var expected = {
    num: 25,
    hash: crypto.createHash('sha256').digest()
  }
  var buffer = message.encode(expected)

  t.equal(buffer.length, 33)

  t.deepEqual(message.decode(buffer), expected)
  t.end()

})

tape('varbuf', function (t) {
  var slice = b.varbuf(b.int8)
  var expected = new Buffer([1, 2, 3, 4, 5])
  var buffer = slice.encode(expected)
  t.deepEqual(buffer, new Buffer([5, 1, 2, 3, 4, 5]))
  t.deepEqual(slice.decode(buffer), expected)
  t.end()
})
