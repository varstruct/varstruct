var varint = require('varint')
var int53 = require('int53')

//I'll make this into a pull request for varint later
//if this turns out to be a good idea.

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
    return part.length || part.encodingLength(value)
  }

  function getLength(obj) {
    return reduce(parts, function (acc, part, k) {
      return acc + lengthOf(part, obj[k])
    }, 0)
  }

  return {
    encode: function encode (obj, b, offset) {
      if(!b)
        b = new Buffer(funLen ? getLength(obj) : length )
      offset = offset | 0
      var _offset = offset

      for(var k in parts) {
       parts[k].encode(obj[k], b, offset)
        offset += parts[k].encode.bytesWritten
      }

      encode.bytesWritten = offset - _offset
      return b
    },
    decode: function decode (buffer, offset) {
      offset = offset | 0
      var obj = {}, _offset = offset

      for(var k in parts) {
        obj[k] = parts[k].decode(buffer, offset)
        offset += parts[k].decode.bytesRead
      }

      decode.bytesRead = offset - _offset
      return obj
    },
    length: funLen ? null : length,
    encodingLength: getLength
  }
}

function createNumber(type, len) {
  var read = Buffer.prototype['read' + type]
  var write = Buffer.prototype['write' + type]

  function encode (value, b, offset) {
    b = b || new Buffer(len)
    write.call(b, value, offset | 0)
    return b
  }
  function decode (buffer, offset) {
    return read.call(buffer, offset|0)
  }

  encode.bytesWritten = decode.bytesRead = len
  return {
    encode: encode,
    decode: decode,
    length: len
  }
}

exports.byte =
exports.int8 =
exports.Int8 =
exports.UInt8 = createNumber('UInt8', 1)

exports.UInt16BE = createNumber('UInt16BE', 2)
exports.UInt32BE = createNumber('UInt32BE', 4)
exports.FloatBE  = createNumber('FloatBE', 4)
exports.DoubleBE = createNumber('DoubleBE', 8)

exports.UInt16LE = createNumber('UInt16LE', 2)
exports.UInt32LE = createNumber('UInt32LE', 4)
exports.FloatLE  = createNumber('FloatLE', 4)
exports.DoubleLE = createNumber('DoubleLE', 8)

exports.UInt16 = exports.UInt16BE
exports.UInt32 = exports.UInt32BE
exports.Float = exports.FloatBE
exports.Double = exports.DoubleBE

function createStatic(write, read, len) {
  function encode(v,b,o) {
    if(!b) b = new Buffer(len)
    write(v, b, o|0)
    return b
  }
  function decode (b, o) {
    return read(b, o|0)
  }
  decode.bytesRead = encode.bytesWritten = len
  return {
    encode: encode,
    decode: decode,
    length: len
  }
}

exports.UInt64 =
exports.UInt64BE = createStatic(int53.writeUInt64BE, int53.readUInt64BE, 8)
exports.UInt64LE = createStatic(int53.writeUInt64LE, int53.readUInt64LE, 8)

exports.bound = function (codec, min, max) {
  function check(value) {
    if(value < min || value > max)
      throw new Error('value out of bounds:' + value + '(min='+min+', max='+max+')')
  }
  return {
    encode: function encode (value, b, o) {
      check(value)
      b = codec.encode(value, b, o)
      encode.bytesWritten = codec.encode.bytesWritten
      return b
    },
    decode: codec.decode,
    length: codec.length || null,
    encodingLength: codec.encodingLength ? function (value) {
      check(value)
      return codec.encodingLength(value)
    } : null
  }
}

exports.buffer =
exports.array = function (len) {

  function encode (value, b, offset) {
    //already encodes a buffer, so if there is no b just return.
    if(!b) return value
    value.copy(b, offset | 0, 0, len)
    return b
  }
  function decode (buffer, offset) {
    return buffer.slice(offset, offset + len)
  }
  encode.bytesWritten = decode.bytesRead = len

  return {
    encode: encode,
    decode: decode,
    length: len
  }
}

exports.varbuf = function (lenType) {
  return {
    encode: function encode (value, buffer, offset) {
      buffer = buffer || new Buffer(this.encodingLength(value) )
      offset = offset | 0
      buffer = lenType.encode(value.length, buffer, offset)
      var bytes = lenType.encode.bytesWritten
      value.copy(buffer, offset + bytes, 0, value.length)
      encode.bytesWritten = bytes + value.length
      return buffer
    },
    decode: function decode (buffer, offset) {
      offset = offset | 0
      var length = lenType.decode(buffer, offset)
      var bytes = lenType.decode.bytesRead
      decode.bytesRead = bytes + length
      return buffer.slice(offset + bytes, offset + bytes + length)
    },
    encodingLength: function (value) {
      return value.length + (lenType.length || lenType.encodingLength(value.length))
    }
  }
}


exports.varint = varint

exports.vararray = function (lenType, itemType) {
  function contentLength(array) {
    return  ( itemType.length
            ? itemType.length * array.length
            : array.reduce(function (acc, item) {
                return acc + itemType.encodingLength(item)
              }, 0))
  }

  return {
    encode: function encode (value, buffer, offset) {
      if(!Array.isArray(value))
        throw new Error('can only encode arrays')
      var length = contentLength(value)
      var ll = lenType.length || lenType.encodingLength(length)

      if(!buffer) {
        buffer = new Buffer(ll + length)
        offset = 0
      }
      var _offset = offset
      lenType.encode(length, buffer, offset)
      offset += lenType.encode.bytesWritten

      value.forEach(function (e) {
        itemType.encode(e, buffer, offset)
        offset += itemType.encode.bytesWritten
      })
      encode.bytesWritten = offset - _offset
      return buffer
    },
    decode: function decode (buffer, offset) {
      offset = offset | 0
      var _offset = offset
      var length = lenType.decode(buffer, offset)
      offset += lenType.decode.bytesRead
      var array = [], max = offset + length
      while(offset < max) {
        var last = itemType.decode(buffer, offset)
        offset += itemType.decode.bytesRead
        array.push(last)
      }
      decode.bytesRead = offset - _offset
      return array
    },
    encodingLength: function (value) {
      var length = contentLength(value)
      return (
        contentLength(value)
      + (lenType.length || lenType.encodingLength(length))
      )
    }
  }
}
