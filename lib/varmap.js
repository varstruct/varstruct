'use strict'
var Buffer = require('safe-buffer').Buffer
var util = require('./util')

function VarMap (lengthType, keyType, valueType) {
  if (!util.isAbstractCodec(lengthType)) throw new TypeError('lengthType is invalid codec')
  if (!util.isAbstractCodec(keyType)) throw new TypeError('keyType is invalid codec')
  if (!util.isAbstractCodec(valueType)) throw new TypeError('valueType is invalid codec')

  function _length (object) {
    if (!object) throw new TypeError('Expected object')

    var size = 0
    var i = 0
    for (var key in object) {
      size += keyType.encodingLength(key)
      size += valueType.encodingLength(object[key])
      ++i
    }

    _length.__count = i
    return size + lengthType.encodingLength(i)
  }

  return {
    encode: function encode (object, buffer, offset) {
      if (!offset) offset = 0

      var bytes = _length(object)
      var count = _length.__count
      if (!buffer) buffer = Buffer.allocUnsafe(bytes)
      else if ((buffer.length - offset) < bytes) throw new RangeError('destination buffer is too small')

      lengthType.encode(count, buffer, offset)
      offset += lengthType.encode.bytes

      for (var key in object) {
        keyType.encode(key, buffer, offset)
        offset += keyType.encode.bytes

        valueType.encode(object[key], buffer, offset)
        offset += valueType.encode.bytes
      }

      encode.bytes = bytes
      return buffer
    },
    decode: function decode (buffer, offset, end) {
      if (!offset) offset = 0
      var result = {}
      var count = lengthType.decode(buffer, offset)
      offset += lengthType.encode.bytes

      for (var i = 0; i < count; ++i) {
        var key = keyType.decode(buffer, offset, end)
        offset += keyType.decode.bytes

        var value = valueType.decode(buffer, offset, end)
        offset += valueType.decode.bytes

        result[key] = value
      }

      decode.bytes = offset
      return result
    },
    encodingLength: _length
  }
}

module.exports = VarMap
