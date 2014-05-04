

function reduce(obj, iter, acc) {
  for(var k in obj)
    acc = iter(acc, obj[k], k, obj)
  return acc
}


exports = module.exports = function (parts) {
  var length = reduce(parts, function (acc, v) {
    console.log(acc, v)
    if(isNaN(v.length)) throw new Error('length is not a number')
    return acc + v.length
  }, 0)

  return {
    encode: function (obj) {
      var b = new Buffer(length)
      var offset = 0
      for(var k in parts) {
        parts[k].encode(obj[k], b, offset)
        offset += parts[k].length
      }
      return b
    },
    decode: function (buffer) {
      var obj = {}
      var offset = 0
      for(var k in parts) {
        obj[k] = parts[k].decode(buffer, offset)
        offset += parts[k].length | 0
      }
      return obj
    },
    length: length
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

exports.doubleBE = {
  encode: function (value, b, offset) {
    b = b || new Buffer(8)
    b.writeDoubleBE(value, offset | 0)
    return b
  },
  decode: function (buffer, offset) {
    return buffer.readDoubleBE(offset|0)
  },
  length: 8
}

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
    buffer = buffer || new Buffer(this.length(value))
      offset = offset | 0
      buffer = lenType.encode(value.length, buffer, offset)
      console.log(buffer, this.length(value), lenType)
      offset += lenType.length
      value.copy(buffer, offset, 0, value.length)
      return buffer
    },
    decode: function (buffer, offset) {
      offset = offset | 0
      var length = lenType.decode(buffer, offset)
      offset += lenType.length
      return buffer.slice(offset, offset + length)
    },
    length: function (value) {
      return value.length + lenType.length
    }

  }
}
