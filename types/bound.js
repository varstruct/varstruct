'use strict'

module.exports = function (itemType, checkValue) {
  return {
    encode: function encode (value, buffer, offset) {
      checkValue(value)
      buffer = itemType.encode(value, buffer, offset)
      encode.bytes = itemType.encode.bytes
      return buffer
    },
    decode: function decode (buffer, offset) {
      var value = itemType.decode(buffer, offset)
      checkValue(value)
      decode.bytes = itemType.decode.bytes
      return value
    },
    encodingLength: function encodingLength (value) {
      checkValue(value)
      return itemType.encodingLength(value)
    }
  }
}
