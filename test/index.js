var tape = require('tape')
var crypto = require('crypto')
var b = require('../')

tape('simple', function (t) {

  var byte = b.int8
  var double = b.DoubleBE

  t.equal(byte.decode(byte.encode(9)), 9)
  var r = Math.random()
  t.equal(double.decode(double.encode(r)), r)
  t.end()
})

tape('vector', function (t) {
  var double = b.DoubleBE

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

tape('varbuf + static', function (t) {

  var sha256 = b.array(32)

  var message = b({
    prev: sha256,
    author: sha256,
    sequence: b.UInt32BE,
    type: sha256,
    message: b.varbuf(b.int8)
  })
  var empty = crypto.createHash('sha256').digest()

  var zeros = new Buffer(32); zeros.fill()

  var expected = {
    prev     : empty, author : empty,
    sequence : 0,     type   : zeros,
    message  : new Buffer('hello there this is the first message', 'utf8')
  }

  var buffer = message.encode(expected)
  console.log(buffer)

  t.deepEqual(message.decode(buffer), expected)

  t.end()

})

tape('varint buffer', function (t) {

  var buf = b.varbuf(b.varint)

  var buffer = buf.encode(new Buffer('hello'))
  console.log('out', buffer)
  t.deepEqual(new Buffer([0x05, 0x68, 0x65, 0x6c, 0x6c, 0x6f]), buffer)

  var expected = new Buffer(
    'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  + 'hellohellohellohellohellohellohellohellohellohellohellohello\n'
  )

  var buffer = buf.encode(expected)

  console.log(buffer)
  t.equal(buffer.length, expected.length + 2)
  t.deepEqual(buf.decode(buffer), expected)
  t.end()
})

tape('vararray', function (t) {

  var array = b.vararray(b.byte, b.DoubleBE)
  var expected = [
    Math.random(), Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(), Math.random(),
    Math.random(), Math.random(), Math.random(), Math.random(),
  ]

  t.equal(array.dynamicLength(expected), 1 + 8*4*4)
  var buffer = array.encode(expected)
  console.log(buffer)
  t.deepEqual(array.decode(buffer), expected)
  t.end()
})
