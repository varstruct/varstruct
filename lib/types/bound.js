'use strict'
var typeforce = require('../typeforce')

module.exports = function (itemType, isValidValue) {
  typeforce(typeforce.VarStructItem, itemType)

  var length = itemType.length
  if (typeof length === 'function') {
    length = function (value) {
      isValidValue(value)
      return itemType.length(value)
    }
  }

  return {
    encode: function encode (value, buffer, offset) {
      isValidValue(value)
      itemType.encode(value, buffer, offset)
      encode.bytes = itemType.encode.bytes
      return buffer
    },
    decode: function decode (buffer, offset) {
      var value = itemType.decode(buffer, offset)
      isValidValue(value)
      decode.bytes = itemType.decode.bytes
      return value
    },
    length: length
  }
}
