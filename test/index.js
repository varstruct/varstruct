var tape = require('tape')
var crypto = require('crypto')
var b = require('../')

tape('simple', function (t) {

  var byte = b.byte
  var double = b.Double

  t.equal(byte.decode(byte.encode(9)), 9)
  t.equal(byte.decode.bytesRead, 1)
  t.equal(byte.encode.bytesWritten, 1)
  var r = Math.random()
  t.equal(double.decode(double.encode(r)), r)
  t.equal(double.decode.bytesRead, 8)
  t.equal(double.encode.bytesWritten, 8)
  t.end()
})

tape('vector', function (t) {
  var double = b.Double

  var vector = b({
    x: double,
    y: double,
    z: double
  })

  var v = {x: 1, y: 2, z: 3}
  var buffer = vector.encode(v)
  t.equal(vector.encode.bytesWritten, 24)
  console.log(buffer)
  t.equal(buffer.length, vector.length)
  t.deepEqual(vector.decode(buffer), v)
  t.equal(vector.decode.bytesRead, 24)
  t.end()
})

tape('buffer', function (t) {

  var sha256 = b.array(32) //a fixed length buffer

  var message = b({
    num : b.byte,
    hash: sha256
  })

  t.equal(message.length, 33)

  var expected = {
    num: 25,
    hash: crypto.createHash('sha256').digest()
  }
  var buffer = message.encode(expected)
  t.equal(message.encode.bytesWritten, 33)
  t.equal(sha256.encode.bytesWritten, 32)
  t.equal(buffer.length, 33)

  t.deepEqual(message.decode(buffer), expected)
  t.equal(sha256.decode.bytesRead, 32)
  t.equal(message.decode.bytesRead, 33)
  t.end()

})

tape('varbuf', function (t) {
  var slice = b.varbuf(b.byte)
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
    sequence: b.UInt32,
    type: sha256,
    message: b.varbuf(b.byte)
  })
  var empty = crypto.createHash('sha256').digest()

  var zeros = new Buffer(32); zeros.fill()

  var expected = {
    prev     : empty, author : empty,
    sequence : 0,     type   : zeros,
    message  : new Buffer('hello there this is the first message', 'utf8')
  }

  var buffer = message.encode(expected)
  var expectedLength = 32 + 32 + 4 + 32 + expected.message.length + 1

  t.equal(message.encode.bytesWritten, expectedLength)

  t.deepEqual(message.decode(buffer), expected)
  t.equal(message.decode.bytesRead, expectedLength)

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
  t.equal(buf.encode.bytesWritten, expected.length + 2)
  t.deepEqual(buf.decode(buffer), expected)
  t.equal(buf.decode.bytesRead, expected.length + 2)
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

  var expectedLength = 1 + 8*4*4
  t.equal(array.dynamicLength(expected), expectedLength)
  var buffer = array.encode(expected)
  t.equal(array.encode.bytesWritten, expectedLength)
  console.log(buffer)
  t.deepEqual(array.decode(buffer), expected)
  t.equal(array.decode.bytesRead, expectedLength)
  t.end()
})

tape('varstruct inside array', function (t) {
  var struct = b({
    i: b.varint,
    d: b.Double
  })
  var array = b.vararray(b.varint, struct)

  var expected = [          //length of varint
    {i:10, d:0.1},          //1
    {i:142, d:0.1231},      //2
    {i:123456,d:1e23},      //3
    {i:8383838,d:1e23},     //4
    {i:4000000000, d:2e-17} //5
  ]

  var buffer = array.encode(expected)
  var length = 1+2+3+4+5+(5*8)+1
  t.equal(array.encode.bytesWritten, length, 'bytesWritten')
  t.equal(array.dynamicLength(expected), length, 'dynamicLength()')
  t.deepEqual(array.decode(buffer), expected)
  t.equal(array.decode.bytesRead, array.encode.bytesWritten)
  t.end()
})

tape('bounded numbers', function (t) {

  var max32 = b.bound(b.byte, 0, 32)
  var buffer = max32.encode(31)
  console.log(buffer)
  t.deepEqual(buffer, new Buffer([31]))
  t.equal(max32.decode(buffer), 31)
  t.throws(function () {
    max32.encode(33)
  })
  t.end()
})

tape('64bit ints', function (t) {
  var date = Date.now()
  var buffer = b.UInt64.encode(date)
  t.equal(buffer.length, 8)
  t.equal(b.UInt64.encode.bytesWritten, 8)
  t.equal(b.UInt64.decode(buffer), date)
  t.equal(b.UInt64.decode.bytesRead, 8)

  var buffer2 = b.UInt64LE.encode(date)
  t.equal(buffer2.length, 8)
  t.equal(b.UInt64LE.encode.bytesWritten, 8)
  t.equal(b.UInt64LE.decode(buffer2), date)
  t.equal(b.UInt64LE.decode.bytesRead, 8)


  t.notDeepEqual(buffer, buffer2)

  t.end()
})
