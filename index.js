var varint = require('varint')

var ONE = 128, TWO = 128*128, THREE = 128*128*128, FOUR = 128*128*128*128

//I'll make this into a pull request for varint later
//if this turns out to be a good idea.

varint.dynamicLength = function (v) {
  return (
    v <= ONE   ? 1
  : v <= TWO   ? 2
  : v <= THREE ? 3
  : v <= FOUR  ? 4
  :              5
  )
}

function reduce(obj, iter, acc) {
  for(var k in obj)
    acc = iter(acc, obj[k], k, obj)
  return acc
}


exports = module.exports = function (parts) {
  var funLen = false
  var length = reduce(parts, function (acc, v) {
    if(isNaN(v.length)) return funLen = true
    return acc + v.length
  }, 0)

  function lengthOf(part, value) {
    return part.length || part.dynamicLength(value)
  }

  function getLength(obj) {
    return reduce(parts, function (acc, part, k) {
      return acc + lengthOf(part, obj[k])
    }, 0)
  }

  return {
    encode: function (obj) {
      var b = new Buffer(funLen ? getLength(obj) : length )
      var offset = 0
      for(var k in parts) {
        parts[k].encode(obj[k], b, offset)
        offset += lengthOf(parts[k], obj[k])
      }
      return b
    },
    decode: function (buffer) {
      var obj = {}
      var offset = 0
      for(var k in parts) {
        obj[k] = parts[k].decode(buffer, offset)
        offset += lengthOf(parts[k], obj[k]) | 0
      }
      return obj
    },
    length: funLen ? null : length,
    dynamicLength: getLength
  }
}

exports.int8 = {
  encode: function (value, buffer, offset) {
    if(!buffer) return new Buffer([value & 0xff])
    console.log('byte-set', value, buffer, offset)
    buffer[offset] = value
    return buffer
  },
  decode: function (buffer, offset) {
    return buffer[offset | 0]
  },
  length: 1
}

function createNumber(type, len) {
  var read = Buffer.prototype['read' + type]
  var write = Buffer.prototype['write' + type]
  return {
    encode: function (value, b, offset) {
      b = b || new Buffer(len)
      write.call(b, value, offset | 0)
      return b
    },
    decode: function (buffer, offset) {
      return read.call(buffer, offset|0)
    },
    length: len
  }
}

exports.byte =
exports.Int8 =
exports.UInt8 = createNumber('UInt8', 1)

exports.UInt16BE = createNumber('UInt16BE', 1)
exports.UInt32BE = createNumber('UInt32BE', 4)
exports.FloatBE  = createNumber('FloatBE', 4)
exports.DoubleBE = createNumber('DoubleBE', 8)

exports.UInt16BE = createNumber('UInt16LE', 1)
exports.UInt32BE = createNumber('UInt32LE', 4)
exports.FloatBE  = createNumber('FloatLE', 4)
exports.DoubleBE = createNumber('DoubleLE', 8)

exports.array = function (len) {
  return {
    encode: function (value, b, offset) {
      //already encodes a buffer, so if there is no b just return.
      if(!b) return value
      value.copy(b, offset, 0, len)
      return b
    },
    decode: function (buffer, offset) {
      return buffer.slice(offset, offset + len)
    },
    length: len
  }
}

exports.varbuf = function (lenType) {
  return {
    encode: function (value, buffer, offset) {
    buffer = buffer || new Buffer(this.dynamicLength(value) )
      offset = offset | 0
      buffer = lenType.encode(value.length, buffer, offset)
      offset += lenType.length || lenType.dynamicLength(value.length)
      value.copy(buffer, offset, 0, value.length)
      return buffer
    },
    decode: function (buffer, offset) {
      offset = offset | 0
      var length = lenType.decode(buffer, offset)
      offset += lenType.length || lenType.dynamicLength(length)
      return buffer.slice(offset, offset + length)
    },
    dynamicLength: function (value) {
      return value.length + (lenType.length || lenType.dynamicLength(value.length))
    }
  }
}


exports.varint = varint
