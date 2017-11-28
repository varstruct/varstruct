'use strict'
var Buffer = require('safe-buffer').Buffer
var util = require('./util')

module.exports = function (lengthType) {
  if (!util.isAbstractCodec(lengthType)) throw new TypeError('lengthType is invalid codec')

  function _length (value) {
    if (!Buffer.isBuffer(value)) throw new TypeError('value must be a Buffer instance')

    return lengthType.encodingLength(value.length) + value.length
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (!offset) offset = 0

      var bytes = _length(value)
      if (!buffer) buffer = Buffer.allocUnsafe(bytes)
      else if ((buffer.length - offset) < bytes) throw new RangeError('destination buffer is too small')

      lengthType.encode(value.length, buffer, offset)
      offset += lengthType.encode.bytes

      value.copy(buffer, offset)
      encode.bytes = bytes

      return buffer
    },
    decode: function decode (buffer, offset, end) {
      if (!offset) offset = 0
      if (!end) end = buffer.length
      var start = offset

      var length = lengthType.decode(buffer, offset, end)
      offset += lengthType.decode.bytes

      if (offset + length > end) throw new RangeError('not enough data for decode')

      decode.bytes = (offset + length) - start
      return Buffer.from(buffer.slice(offset, offset + length))
    },
    encodingLength: function encodingLength (value) {
      return _length(value)
    }
  }
}
