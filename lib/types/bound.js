'use strict'

module.exports = function (itemType, isValidValue) {
  return {
    encode: function encode (value, buffer, offset) {
      isValidValue(value)
      buffer = itemType.encode(value, buffer, offset)
      encode.bytes = itemType.encode.bytes
      return buffer
    },
    decode: function decode (buffer, offset) {
      var value = itemType.decode(buffer, offset)
      isValidValue(value)
      decode.bytes = itemType.decode.bytes
      return value
    },
    encodingLength: function encodingLength (value) {
      isValidValue(value)
      return itemType.encodingLength(value)
    }
  }
}
