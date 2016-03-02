'use strict'
var util = require('../util')

module.exports = function (lengthType) {
  function encodingLength (value) {
    if (!Buffer.isBuffer(value)) throw new TypeError('value must be a Buffer instance')
    return lengthType.encodingLength(value.length) + value.length
  }

  return {
    encode: function encode (value, buffer, offset) {
      if (!Buffer.isBuffer(value)) throw new TypeError('value must be a Buffer instance')
      if (!buffer) buffer = util.newBuffer(encodingLength(value))
      if (!offset) offset = 0
      lengthType.encode(value.length, buffer, offset)
      offset += lengthType.encode.bytes
      if (offset + value.length > buffer.length) throw new RangeError('destination buffer is too small')
      value.copy(buffer, offset, 0, value.length)
      encode.bytes = lengthType.encode.bytes + value.length
      return buffer
    },
    decode: function decode (buffer, offset) {
      if (!offset) offset = 0
      var blength = lengthType.decode(buffer, offset)
      offset += lengthType.decode.bytes
      if (offset + blength > buffer.length) throw new RangeError('not enough data for decode')
      decode.bytes = lengthType.decode.bytes + blength
      return new Buffer(buffer.slice(offset, offset + blength))
    },
    encodingLength: encodingLength
  }
}
